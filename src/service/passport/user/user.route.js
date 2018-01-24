// @flow
import { Request } from 'express';
import EventEmitter from 'events';
import { crud } from '../../crud/crud';
import { isValidPassword } from './user.helper';
import { filterProperty } from '../../../helper';
import { EVENTS } from '../../websocket/websocket.event';
import { checkPermission } from '../../../api/api.helper';
import { InvalidPasswordError } from '../../../config/custom.errors';
import type { Model } from 'mongoose';

type UserCrudRouteOptions = {
  UserModel: Model,
  apiEvents: EventEmitter
};

export const userCrudRoute = ({
  UserModel,
  apiEvents
}: UserCrudRouteOptions) => {
  return crud({
    path: '/user',
    model: UserModel,
    before: {
      // check old password if the user wants to change password
      update: async ({ id, data, user }) => {
        try {
          const resPerm = checkPermission({ id, data, user });
          if (!resPerm.success) return resPerm;
          if (!data.password) return { success: true };
          const objUser = await UserModel.findById(id);
          const isValidOldPassword = await isValidPassword(
            objUser,
            data.oldPassword
          );
          if (!isValidOldPassword) {
            return { success: false, error: new InvalidPasswordError() };
          }
          return { success: true };
        } catch (error) {
          return { success: false, error };
        }
      },
      delete: checkPermission
    }
  });
};
