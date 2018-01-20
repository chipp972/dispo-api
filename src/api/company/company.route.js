// @flow
import { Request, Router } from 'express';
import EventEmitter from 'events';
import { Model } from 'mongoose';
import { crud } from '../../service/crud/crud';
import { EVENTS } from '../../service/websocket/websocket.event';
import { deleteFromCloudinary } from '../../service/cloudinary/cloudinary';
import { updateCompanyAvailability, uploadCompanyLogo } from './company.helper';
import env from '../../config/env';
import { TooMuchCompaniesError } from '../../config/custom.errors';
import { checkPermission } from '../api.helper';
import type { Company } from './company';

type CompanyCrudRouteOptions = {
  CompanyModel: Model,
  apiEvents: EventEmitter
};

export const companyCrudRoute = ({
  CompanyModel,
  apiEvents
}: CompanyCrudRouteOptions): Router => {
  // on user delete also delete all his companies
  apiEvents.on(EVENTS.USER.deleted, async (user: any) => {
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

  return crud({
    path: '/company',
    model: CompanyModel,
    before: {
      create: async ({ id, data, user, files }) => {
        try {
          // add owner as user if no owner provided
          if (!data.owner && user.role !== 'admin') data.owner = user._id;
          // check if owner or admin
          const resPerm = checkPermission({ id, data, user });
          if (!resPerm.success) return resPerm;
          // check if user don't have too much companies
          const companyNumber = await CompanyModel.count({ owner: data.owner });
          if (companyNumber > env.maxCompanyNumber) {
            return { success: false, error: new TooMuchCompaniesError() };
          }
          const resUpload = await uploadCompanyLogo({ id, data, user, files });
          if (!resUpload.success) return resUpload;
          delete data.geoAddress;
          delete data.available;
          return { success: true };
        } catch (error) {
          return { success: false, error };
        }
      },
      update: async ({ id, data, user, files }) => {
        try {
          delete data.geoAddress;
          const resPerm = checkPermission({ id, data, user });
          if (!resPerm.success) return resPerm;
          const resUpload = await uploadCompanyLogo({ id, data, user, files });
          if (!resUpload.success) return resUpload;
          // when the owner set a company available
          // reset to unvailable after the delay
          if (data.available) {
            setTimeout(() => {
              updateCompanyAvailability({
                CompanyModel,
                id,
                available: false
              })
                .then((company: Company) =>
                  apiEvents.emit(EVENTS.COMPANY.updated, company)
                )
                .catch((err: Error) => apiEvents.emit('error', err));
            }, env.switchToUnavailableDelay);
          }
          return { success: true };
        } catch (error) {
          return { success: false, error };
        }
      },
      delete: checkPermission
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
    }
  });
};
