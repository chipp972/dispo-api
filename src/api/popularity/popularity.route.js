// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import { crud } from 'another-express-crud';
import { mongooseCrudConnector } from 'crud-mongoose-connector';

type Options = {
  CompanyPopularityModel: Model,
  isAuthenticationActivated: boolean,
};

export const companyPopularityCrudRoute = ({
  CompanyPopularityModel,
  isAuthenticationActivated,
}: Options): Router => {
  return crud({
    path: '/companypopularity',
    operations: mongooseCrudConnector(CompanyPopularityModel),
    policy: {
      create: 'user',
      read: 'guest',
      update: 'admin',
      delete: 'admin',
      isDisabled: !isAuthenticationActivated,
    },
  });
};
