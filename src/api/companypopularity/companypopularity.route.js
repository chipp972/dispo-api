// @flow
import { Request, Router } from 'express';
import EventEmitter from 'events';
import { Model } from 'mongoose';
import { crud } from '../../service/crud/crud';
import { EVENTS } from '../../service/websocket/websocket.event';
import { checkPermission } from '../api.helper';
import type { Company } from '../company/company';
import type { CompanyPopularity } from './companypopularity';

type CompanyPopularityCrudRouteOptions = {
  CompanyPopularityModel: Model,
  apiEvents: EventEmitter
};

export const companyPopularityCrudRoute = ({
  CompanyPopularityModel,
  apiEvents
}: CompanyPopularityCrudRouteOptions): Router => {
  apiEvents.on(EVENTS.COMPANY.deleted, async (company: Company) => {
    const companyPopularities = await CompanyPopularityModel.find({
      companyId: company._id
    });
    companyPopularities.forEach((companyPopularity: CompanyPopularity) => {
      companyPopularity.remove();
      apiEvents.emit(EVENTS.COMPANY_POPULARITY.deleted, companyPopularity);
    });
  });

  return crud({
    path: '/companypopularity',
    model: CompanyPopularityModel,
    before: {
      update: checkPermission,
      delete: checkPermission
    }
  });
};
