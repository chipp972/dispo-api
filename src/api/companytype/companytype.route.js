// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import { crud } from 'another-express-crud';
import { mongooseCrudConnector } from 'crud-mongoose-connector';

type Options = {
  CompanyTypeModel: Model,
  isAuthenticationActivated: boolean,
};

export const companyTypeCrudRoute = ({
  CompanyTypeModel,
  isAuthenticationActivated,
}: Options): Router => {
  return crud({
    path: '/companytype',
    operations: mongooseCrudConnector(CompanyTypeModel),
    policy: {
      create: 'admin',
      update: 'admin',
      delete: 'admin',
      isDisabled: !isAuthenticationActivated,
    },
  });
};
