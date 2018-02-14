// @flow
import { Router } from 'express';
import { mongooseCrudConnector } from 'crud-mongoose-connector';
import type { Model } from 'mongoose';

type Options = {
  UserModel: Model,
  isAuthenticationActivated: boolean,
};

export const UserCrudConfig = ({
  UserModel,
  isAuthenticationActivated,
}: Options): Router => ({
  path: '/user',
  operations: mongooseCrudConnector(UserModel),
  policy: {
    create: 'guest',
    read: 'owner',
    update: 'owner',
    delete: 'owner',
    isDisabled: !isAuthenticationActivated,
  },
});
