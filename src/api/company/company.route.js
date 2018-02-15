// @flow
import { Request, Router } from 'express';
import { Model } from 'mongoose';
import { crud } from 'another-express-crud';
import { mongooseCrudConnector } from 'crud-mongoose-connector';
import { uploadCompanyLogo } from './company.helper';
import { TooMuchCompaniesError } from './company.error';
import type { Company } from './company.mongo';

type Options = {
  CompanyModel: Model,
  isAuthenticationActivated: boolean,
  LOGGER: any,
  maxCompanyNumber: number,
  switchToUnavailableDelay: number,
  saveImage: (path: string) => Promise<any>,
  deleteImage: ({ publicId: string }) => Promise<any>,
};

export const companyCrudRoute = ({
  CompanyModel,
  isAuthenticationActivated,
  switchToUnavailableDelay,
  saveImage,
  deleteImage,
  LOGGER,
  maxCompanyNumber,
}: Options): Router => {
  const operations = mongooseCrudConnector(CompanyModel);
  return crud({
    path: '/company',
    operations,
    policy: {
      create: 'owner',
      read: 'guest',
      update: 'owner',
      delete: 'owner',
      isDisabled: !isAuthenticationActivated,
    },
    hooks: {
      before: {
        all: async ({ id, data, user, files }) => {
          if (data) {
            delete data.geoAddress;
          }
          return { success: true };
        },
        create: async ({ id, data, user, files }) => {
          try {
            // add owner as user if no owner provided
            if (!data.owner && user && user.role !== 'admin') {
              data.owner = user._id;
            }
            // check if user don't have too much companies
            const companyNumber = await CompanyModel.count({
              owner: data.owner,
            });
            if (companyNumber >= maxCompanyNumber) {
              return {
                success: false,
                error: new TooMuchCompaniesError(),
              };
            }
            // save logo
            const resUpload = await uploadCompanyLogo({
              data,
              files,
              LOGGER,
              deleteImage,
              saveImage,
            });
            return resUpload;
          } catch (error) {
            return { success: false, error };
          }
        },
        update: async ({ id, data, user, files }) => {
          try {
            const resUpload = await uploadCompanyLogo({
              data,
              files,
              LOGGER,
              deleteImage,
              saveImage,
            });
            return resUpload;
          } catch (error) {
            return { success: false, error };
          }
        },
      },
      after: {
        update: async ({ _id, available }: Company, req: Request) => {
          // when the owner set a company available
          // reset to unvailable after the delay
          if (available) {
            setTimeout(async () => {
              try {
                operations.update({ id: _id, data: { available: false } });
              } catch (err) {
                LOGGER.error(err);
              }
            }, switchToUnavailableDelay);
          }
        },
      },
    },
  });
};
