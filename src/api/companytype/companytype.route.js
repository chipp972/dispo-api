// @flow
import { Request, Router } from 'express';
import EventEmitter from 'events';
import { Model } from 'mongoose';
import { crud } from '../../service/crud/crud';
import { EVENTS } from '../../service/websocket/websocket.event';
import { checkPermission } from '../api.helper';
import type { Company } from '../company/company';

type CompanyTypeCrudRouteOptions = {
  CompanyTypeModel: Model,
  CompanyModel: Model,
  apiEvents: EventEmitter
};

export const companyTypeCrudRoute = ({
  CompanyTypeModel,
  CompanyModel,
  apiEvents
}: CompanyTypeCrudRouteOptions): Router => {
  return crud({
    path: '/companytype',
    model: CompanyTypeModel,
    before: {
      create: checkPermission,
      update: checkPermission,
      delete: checkPermission
    },
    after: {
      delete: async (result: any, req: Request) => {
        const { defaultCompanyType } = req.body;
        if (defaultCompanyType) {
          const companies = await CompanyModel.find({ type: result._id });
          companies.forEach((company: Company) => {
            const newCompany = Object.assign(company, {
              type: defaultCompanyType
            });
            newCompany.save();
            apiEvents.emit(EVENTS.COMPANY.updated, newCompany);
          });
        } else {
          const companies = await CompanyModel.find({ type: result._id });
          companies.forEach((company: Company) => {
            company.remove();
            apiEvents.emit(EVENTS.COMPANY.deleted, company);
          });
        }
      }
    }
  });
};
