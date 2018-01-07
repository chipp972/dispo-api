// @flow
import { Request, Router } from 'express';
import EventEmitter from 'events';
import { Model } from 'mongoose';
import { crud } from '../../service/crud/crud';
import { EVENTS } from '../../service/websocket/websocket.event';
import env from '../../config/env';
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
    after: {
      create: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.COMPANY_TYPE.created, result);
      },
      update: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.COMPANY_TYPE.updated, result);
      },
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
        apiEvents.emit(EVENTS.COMPANY_TYPE.deleted, result);
      }
    },
    isAuthenticationActivated: env.auth.isAuthenticationActivated
  });
};
