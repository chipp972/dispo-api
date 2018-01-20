// @flow
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Model } from 'mongoose';
import { AuthenticateOptions } from 'passport';
import LOGGER from '../../config/logger';
import env from '../../config/env';
import { AuthenticationFailedError } from '../../config/custom.errors';
import type { AdminUser } from './admin/admin';
import type { User } from './user/user';

type PassportConfigOptions = {
  UserModel: Model,
  AdminModel: Model
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
          return done(new AuthenticationFailedError(), false);
        }
        return done(undefined, account);
      } else {
        // user authentication
        const user: User = await UserModel.findOne({ _id, email });
        if (!user) {
          LOGGER.error('No user account found');
          return done(new AuthenticationFailedError(), false);
        }
        return done(undefined, user);
      }
    } catch (err) {
      LOGGER.error(err, 'passport jwt strategy error');
      return done(err, false);
    }
  });
};
