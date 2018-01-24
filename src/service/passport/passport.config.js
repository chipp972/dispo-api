// @flow
import { Strategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { Model } from 'mongoose';
import { AuthenticateOptions } from 'passport';
import LOGGER from '../../config/logger';
import env from '../../config/env';
import { AuthenticationError } from '../../config/custom.errors';
import { Application, Request, Response, NextFunction } from 'express';
import type { AdminUser } from './admin/admin';
import type { User } from './user/user';

type PassportConfigOptions = {
  UserModel: Model,
  AdminModel: Model
};

type AuthenticationMiddlewareOptions = {
  app: Application,
  path: string,
  UserModel: Model,
  AdminModel: Model
};

/**
 * register the passport authentication
 * and add user to req if authenticated
 */
export const authenticationMiddleware = ({
  app,
  path,
  UserModel,
  AdminModel
}: AuthenticationMiddlewareOptions) => {
  passport.use(configurePassport({ UserModel, AdminModel }));
  app.use(passport.initialize());
  app.use(path, (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (err, user, info) => {
      if (err) return next(err);
      req.user = user;
      return next();
    })(req, res, next);
  });
};

/**
 * configure the function called everytime
 * secured end points are requested
 * @param {PassportConfigOptions} options
 * @return {Strategy}
 */
export const configurePassport = ({
  UserModel,
  AdminModel
}: PassportConfigOptions): Strategy => {
  const opts: AuthenticateOptions = {
    secretOrKey: env.auth.secretOrKey,
    jwtFromRequest: ExtractJwt.fromHeader('authorization')
  };

  return new Strategy(opts, async (jwtPayload, done) => {
    try {
      const { _id, email, code, role } = jwtPayload;
      LOGGER.debug(jwtPayload, 'jwt-payload');
      if (role === 'admin') {
        // admin authentication
        const account: AdminUser = await AdminModel.findOne({
          _id,
          email,
          code,
          role
        });
        if (!account) {
          LOGGER.error('No admin session found');
          return done(new AuthenticationError(), false);
        }
        return done(undefined, account);
      } else {
        // user authentication
        const user: User = await UserModel.findOne({ _id, email });
        if (!user) {
          LOGGER.error('No user account found');
          return done(new AuthenticationError(), false);
        }
        return done(undefined, user);
      }
    } catch (err) {
      LOGGER.error(err, '| passport jwt');
      return done(err, false);
    }
  });
};
