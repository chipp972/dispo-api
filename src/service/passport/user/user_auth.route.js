// @flow
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { passportRoutes } from '../passport.constant';
import { formatResponse, handleUnauthorized } from '../../express/route.helper';
import { isValidPassword } from './user.helper';
import { filterProperty } from '../../../helper';
import env from '../../../config/env';
import LOGGER from '../../../config/logger';
import { AuthenticationFailedError } from '../../../config/custom.errors';
import type { Model } from 'mongoose';

type UserAuthRouteOptions = {
  UserModel: Model
};

export const initUserAuthRoutes = ({
  UserModel
}: UserAuthRouteOptions): Router => {
  const router = Router();

  // register route
  router.post(
    passportRoutes.user.register.path,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await UserModel.create(req.body);
        return formatResponse({
          res,
          success: true,
          data: filterProperty('password', user.toObject()),
          status: 201
        });
      } catch (err) {
        next(err);
      }
    }
  );

  // login route
  router
    .post(
      passportRoutes.user.login.path,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { email, password } = req.body;
          const user = await UserModel.findOne({ email });
          if (!user) {
            LOGGER.error('User not found', 'User Login');
            return next(new AuthenticationFailedError());
          }
          const isValid = await isValidPassword(user, password);
          if (!isValid) {
            LOGGER.error('Invalid password', 'User Login');
            return next(new AuthenticationFailedError());
          }
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
          LOGGER.error(err, 'User Login');
          next(err);
        }
      }
    )
    .post(handleUnauthorized);

  return router;
};
