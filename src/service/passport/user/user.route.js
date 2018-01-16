// @flow
import { Request, Response } from 'express';
import EventEmitter from 'events';
import { crud } from '../../crud/crud';
import { isValidPassword } from './user.helper';
import { filterProperty } from '../../../helper';
import { EVENTS } from '../../websocket/websocket.event';
import { checkPermission } from '../../../api/api.helper';
import { InvalidPasswordError } from '../../../config/custom.errors';
import type { Model } from 'mongoose';
import type { User } from './user';

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
    responseFormatter: (req: Response, res: Response) => {
      return res
        .status(res.statusCode || 200)
        .contentType('application/json')
        .json({
          success: res.success ? res.success : true,
          data: Array.isArray(res.data)
            ? res.data.map((user: User) => filterProperty('password', user))
            : filterProperty('password', res.data)
        });
    },
    before: {
      // check old password if the user wants to change password
      update: async ({ id, data, user }) => {
        checkPermission({ id, data, user });
        // TODO: validate data.password
        if (!data.password) return;
        const objUser = await UserModel.findById(id);
        const isValidOldPassword = await isValidPassword(
          objUser,
          data.oldPassword
        );
        if (!isValidOldPassword) throw new InvalidPasswordError();
      },
      delete: checkPermission
    },
    after: {
      create: async (result: any, req: Request) => {
        const cleanedResult = filterProperty('password', result);
        apiEvents.emit(EVENTS.USER.created, cleanedResult);
        return cleanedResult;
      },
      update: async (result: any, req: Request) => {
        const cleanedResult = filterProperty('password', result);
        apiEvents.emit(EVENTS.USER.updated, cleanedResult);
        return cleanedResult;
      },
      delete: async (result: any, req: Request) => {
        const cleanedResult = filterProperty('password', result);
        apiEvents.emit(EVENTS.USER.deleted, cleanedResult);
        return cleanedResult;
      }
    }
  });
};
