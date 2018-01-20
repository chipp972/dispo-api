// @flow
import { Router, Request, Response, NextFunction } from 'express';
import EventEmitter from 'events';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { EVENTS } from '../../websocket/websocket.event';
import { passportRoutes } from '../passport.constant';
import { formatResponse, handleUnauthorized } from '../../express/route.helper';
import { isValidPassword } from './user.helper';
import { filterProperty } from '../../../helper';
import env from '../../../config/env';
import LOGGER from '../../../config/logger';
import { AuthenticationFailedError } from '../../../config/custom.errors';
import type { Model } from 'mongoose';

type UserAuthRouteOptions = {
  UserModel: Model,
  apiEvents: EventEmitter
};

export const initUserAuthRoutes = ({
  UserModel,
  apiEvents
}: UserAuthRouteOptions): Router => {
  const router = Router();

  // register route
  router.post(
    passportRoutes.user.register.path,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await UserModel.create(req.body);
        const data = filterProperty('password', user.toObject());
        apiEvents.emit(EVENTS.USER.created, data);
        return formatResponse({
          res,
          success: true,
          data,
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
