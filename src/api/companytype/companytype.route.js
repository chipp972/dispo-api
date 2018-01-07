// @flow
import { Request, Router } from 'express';
import EventEmitter from 'events';
import { Model } from 'mongoose';
import { crud } from '../../service/crud/crud';
import { EVENTS } from '../../service/websocket/websocket.event';
import env from '../../config/env';

type CompanyTypeCrudRouteOptions = {
  CompanyTypeModel: Model,
  apiEvents: EventEmitter
};

export const companyTypeCrudRoute = ({
  CompanyTypeModel,
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
        apiEvents.emit(EVENTS.COMPANY_TYPE.deleted, result);
      }
    },
    isAuthenticationActivated: env.auth.isAuthenticationActivated
  });
};
