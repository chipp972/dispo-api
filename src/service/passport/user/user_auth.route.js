// @flow
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import env from '../../../config/env';
import { passportRoutes } from '../passport.constant';
import { formatResponse, handleUnauthorized } from '../../express/route.helper';
import { isValidPassword } from './user.helper';
import { filterProperty } from '../../../helper';
import type { Model } from 'mongoose';

type UserAuthRouteOptions = {
  UserModel: Model
};

export const initUserAuthRoutes = ({
  UserModel
}: UserAuthRouteOptions): Router => {
  const router = Router();
  router.post(
    passportRoutes.user.register.path,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await UserModel.create(req.body);
        return formatResponse({
          res,
          success: true,
          data: filterProperty('password', user),
          status: 201
        });
      } catch (err) {
        next(err);
      }
    }
  );

  router
    .post(
      passportRoutes.user.login.path,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { email, password } = req.body;
          const user = await UserModel.find({ email });
          const isValid = await isValidPassword(user, password);
          if (!isValid) return next();
          const token = jwt.sign(user.toJSON(), env.auth.secretOrKey, {
            expiresIn: env.auth.sessionExpiration
          });
          const data = {
            tokenId: user._id,
            token,
            expireAt: moment()
              .add(env.auth.sessionExpiration, 'seconds')
              .unix()
          };
          return formatResponse({ res, data });
        } catch (err) {
          next(err);
        }
      }
    )
    .post(handleUnauthorized);

  return router;
};
