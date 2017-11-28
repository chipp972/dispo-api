// @flow
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Model } from 'mongoose';
import passport, { AuthenticateOptions } from 'passport';
import env from './env';

export const configurePassport = function(
  UserModel: Model,
  AdminModel: Model
): void {
  const opts: AuthenticateOptions = {
    secretOrKey: env.auth.secretOrKey,
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    session: false
  };

  const strategy = new Strategy(opts, (jwtPayload, done) => {
    console.log(jwtPayload);
    const { _id, email, code, role } = jwtPayload;
    const model = role === 'admin' ? AdminModel : UserModel;
    model
      .findOne({ _id, email, code, role })
      .then((account) => {
        if (!account) done(undefined, false);
        done(undefined, account);
      })
      .catch((err: Error) => done(err, false));
  });

  passport.use(strategy);
};
