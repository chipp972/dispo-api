// @flow
import { crud } from '../../service/crud/crud';
import { filterProperty } from '../../helper';
import { isValidPassword } from './user.helper';
import { Model } from 'mongoose';
import { Request, Response, Router } from 'express';
import env from '../../config/env';

export const userCrudRoute = (
  UserModel: Model,
  CompanyModel: Model
): Router => {
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
    // delete owned companies
    after: {
      delete: async (result: any, req: Request, res: Response) => {
        await CompanyModel.remove({ owner: result._id });
        return result;
      }
    },
    isAuthenticationActivated: env.auth.isAuthenticationActivated
  });
};
