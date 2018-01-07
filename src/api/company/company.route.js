// @flow
import { Request, Router } from 'express';
import EventEmitter from 'events';
import { Model } from 'mongoose';
import { crud } from '../../service/crud/crud';
import { EVENTS } from '../../service/websocket/websocket.event';
import { deleteFromCloudinary } from '../../service/cloudinary/cloudinary';
import { updateCompanyAvailability, uploadCompanyLogo } from './company.helper';
import env from '../../config/env';
import type { Company } from './company';
import type { User } from '../user/user';

type CompanyCrudRouteOptions = {
  CompanyModel: Model,
  apiEvents: EventEmitter
};

export const companyCrudRoute = ({
  CompanyModel,
  apiEvents
}: CompanyCrudRouteOptions): Router => {
  // on user delete also delete all his companies
  apiEvents.on(EVENTS.USER.deleted, async (user: User) => {
    const companies = await CompanyModel.find({ owner: user._id });
    companies.forEach((company: Company) => {
      company.remove();
      apiEvents.emit(EVENTS.COMPANY.deleted, company);
    });
  });

  // on company delete also delete its image in cloudinary
  apiEvents.on(EVENTS.COMPANY.deleted, async (company: Company) => {
    try {
      const obj = company.toObject ? company.toObject() : company;
      const { imageCloudId } = obj;
      if (imageCloudId) {
        await deleteFromCloudinary({ publicId: imageCloudId });
      }
    } catch (err) {
      apiEvents.emit('error', err);
    }
  });

  // when the owner set a company available
  apiEvents.on(EVENTS.COMPANY.setAvailable, (id: string) => {
    setTimeout(() => {
      updateCompanyAvailability({
        CompanyModel,
        apiEvents,
        id,
        available: false
      })
        .catch((err: Error) => apiEvents.emit('error', err))
        .then(() => apiEvents.emit(EVENTS.COMPANY.setUnavailable, id));
    }, env.switchToUnavailableDelay);
  });

  return crud({
    path: '/company',
    model: CompanyModel,
    before: {
      create: ({ id, data, user, files }) => {
        uploadCompanyLogo({ id, data, user, files });
        delete data.available;
      },
      update: ({ id, data, user, files }) => {
        uploadCompanyLogo({ id, data, user, files });
        if (data.available) apiEvents.emit(EVENTS.COMPANY.setAvailable, id);
      }
    },
    after: {
      create: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.COMPANY.created, result);
      },
      update: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.COMPANY.updated, result);
      },
      delete: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.COMPANY.deleted, result);
      }
    },
    isAuthenticationActivated: env.auth.isAuthenticationActivated
  });
};
