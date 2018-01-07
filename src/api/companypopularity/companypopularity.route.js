// @flow
import { Request, Router } from 'express';
import EventEmitter from 'events';
import { Model } from 'mongoose';
import { crud } from '../../service/crud/crud';
import { EVENTS } from '../../service/websocket/websocket.event';
import env from '../../config/env';
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
    after: {
      create: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.COMPANY_POPULARITY.created, result);
      },
      update: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.COMPANY_POPULARITY.updated, result);
      },
      delete: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.COMPANY_POPULARITY.deleted, result);
      }
    },
    isAuthenticationActivated: env.auth.isAuthenticationActivated
  });
};
