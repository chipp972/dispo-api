// @flow
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Model } from 'mongoose';
import passport, { AuthenticateOptions } from 'passport';
import env from '../../config/env';
import type { AdminUser } from './admin/admin';
import type { User } from '../../api/user/user';

export const configurePassport = function(
  UserModel: Model,
  AdminModel: Model
): void {
  const opts: AuthenticateOptions = {
    secretOrKey: env.auth.secretOrKey,
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    session: false
  };

  // function called everytime the secured end points are requested
  const strategy = new Strategy(opts, async (jwtPayload, done) => {
    try {
      const { _id, email, code, role, password } = jwtPayload;
      console.log(jwtPayload, 'jwt-payload [passport.config]');
      if (role === 'admin') {
        // admin authentication
        const account: AdminUser = await AdminModel.findOne({
          _id,
          email,
          code,
          role
        });
        if (!account) return done(undefined, false);
        return done(undefined, account);
      } else {
        // user authentication
        const user: User = await UserModel.findOne({ _id, email, password });
        if (!user) return done(undefined, false);
        return done(undefined, user);
      }
    } catch (err) {
      done(err, false);
    }
  });

  passport.use(strategy);
};
