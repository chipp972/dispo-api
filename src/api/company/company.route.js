// @flow
import { Request, Router } from 'express';
import EventEmitter from 'events';
import { Model } from 'mongoose';
import { crud } from '../../service/crud/crud';
import { EVENTS } from '../../service/websocket/websocket.event';
import {
  saveLogoInCloudinary,
  deleteFromCloudinary
} from '../../service/cloudinary/cloudinary';
import env from '../../config/env';
import type { CompanyType } from '../companytype/companytype';
import type { Company } from './company';
import type { User } from '../user/user';
import type { CrudOptions } from '../../service/crud/crud';

type CompanyCrudRouteOptions = {
  CompanyModel: Model,
  apiEvents: EventEmitter
};

/**
 * Verify if the logo of the company is already uploaded
 * and delete it then upload the image given
 */
const uploadCompanyLogo = async ({ id, data, user, files }: CrudOptions) => {
  delete data.geoAddress; // can't trust client
  const img = files.companyImage;
  if (!img) return;
  if (data.imageCloudId && /cloudinary/.test(data.imageUrl)) {
    await deleteFromCloudinary({
      publicId: data.imageCloudId
    });
  }
  const uploadRes = await saveLogoInCloudinary(img.path);
  data.imageCloudId = uploadRes.public_id;
  data.imageUrl = uploadRes.secure_url;
};

export const companyCrudRoute = ({
  CompanyModel,
  apiEvents
}: CompanyCrudRouteOptions): Router => {
  // on company type delete delete all companies
  // that have this company type
  apiEvents.on(
    EVENTS.COMPANY_TYPE.deleted,
    async (companyType: CompanyType) => {
      const companies = await CompanyModel.find({ type: companyType._id });
      companies.forEach((company: Company) => {
        company.remove();
        apiEvents.emit(EVENTS.COMPANY.deleted, company);
      });
    }
  );

  // on user delete also delete all his companies
  apiEvents.on(EVENTS.USER.deleted, async (user: User) => {
    const companies = await CompanyModel.find({ owner: user._id });
    companies.forEach((company: Company) => {
      company.remove();
      apiEvents.emit(EVENTS.COMPANY.deleted, company);
    });
  });

  // on company delete also delete its image in the cloud
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
      create: uploadCompanyLogo,
      update: uploadCompanyLogo
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
