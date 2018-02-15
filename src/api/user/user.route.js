// @flow
import type { CrudGenOptions } from 'another-express-crud';
import { mongooseCrudConnector } from 'crud-mongoose-connector';
import type { Model } from 'mongoose';

type Options = {
  UserModel: Model,
  isAuthenticationActivated: boolean,
};

export const UserCrudConfig = ({
  UserModel,
  isAuthenticationActivated,
}: Options): CrudGenOptions => ({
  path: '/user',
  operations: mongooseCrudConnector(UserModel),
  policy: {
    create: 'guest',
    read: 'user',
    update: 'owner',
    delete: 'owner',
    isDisabled: !isAuthenticationActivated,
  },
});
