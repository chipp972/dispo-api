// @flow
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Model } from 'mongoose';
import passport, { AuthenticateOptions } from 'passport';
import env from '../../config/env';
import type { AdminUser } from './admin/admin';

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
  const strategy = new Strategy(opts, (jwtPayload, done) => {
    const { _id, email, code, role } = jwtPayload;
    console.log(jwtPayload, 'jwt-payload');

    // admin authentication
    if (role === 'admin') {
      return AdminModel.findOne({ _id, email, code, role })
        .then((account: AdminUser) => {
          if (!account) done(undefined, false);
          done(undefined, account);
        })
        .catch((err: Error) => done(err, false));
    }
    // user authentication
    // UserModel.findOne({ _id, mail, password });
    // TODO: finish user auth
  });

  passport.use(strategy);
};
