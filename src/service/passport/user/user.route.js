// @flow
import { Request, Response } from 'express';
import EventEmitter from 'events';
import { crud } from '../../crud/crud';
import { isValidPassword } from './user.helper';
import { filterProperty } from '../../../helper';
import { EVENTS } from '../../websocket/websocket.event';
import env from '../../../config/env';
import type { Model } from 'mongoose';

type UserCrudRouteOptions = {
  UserModel: Model,
  apiEvents: EventEmitter
};

export const userCrudRoutes = ({
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
          data: filterProperty('password', res.data)
        });
    },
    before: {
      // check old password if the user wants to change password
      update: async ({ id, data, user }) => {
        if (!data.password) return;
        const objUser = await UserModel.findById(id);
        const isValidOldPassword = await isValidPassword(
          objUser,
          data.oldPassword
        );
        if (!isValidOldPassword) throw new Error('invalid old password');
      }
    },
    after: {
      create: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.USER.created, result);
      },
      update: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.USER.updated, result);
      },
      delete: async (result: any, req: Request) => {
        apiEvents.emit(EVENTS.USER.deleted, result);
      }
    },
    isAuthenticationActivated: env.auth.isAuthenticationActivated
  });
};
