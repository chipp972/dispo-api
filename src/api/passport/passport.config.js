// @flow
import { Application, Request, Response, NextFunction } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { Model, Document } from 'mongoose';
import { AuthenticateOptions } from 'passport';
import { createNewAuthenticationError } from './passport.error';
import type { PasswordLessCredentials } from './passwordless/passwordless.mongo';
import type { Credentials } from './credentials/credentials.mongo';

type PassportConfigOptions = {
  UserModel: Model,
  PasswordLessCredentialsModel: Model,
  CredentialsModel: Model,
  secretOrKey: string,
  logger: any,
};

type AuthenticationMiddlewareOptions = {
  app: Application,
  path: string,
  UserModel: Model,
  PasswordLessCredentialsModel: Model,
  CredentialsModel: Model,
  secretOrKey: string,
  logger: any,
};

/**
 * register the passport authentication
 * and add user to req if authenticated
 */
export const setupAuthenticationMiddleware = ({
  app,
  path,
  UserModel,
  PasswordLessCredentialsModel,
  CredentialsModel,
  secretOrKey,
  logger,
}: AuthenticationMiddlewareOptions) => {
  passport.use(
    configurePassport({
      UserModel,
      PasswordLessCredentialsModel,
      CredentialsModel,
      secretOrKey,
      logger,
    })
  );
  app.use(passport.initialize());
  app.use(path, (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (err?: Error, user?: any, info?: any) => {
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
const configurePassport = ({
  UserModel,
  PasswordLessCredentialsModel,
  CredentialsModel,
  secretOrKey,
  logger,
}: PassportConfigOptions): Strategy => {
  const opts: AuthenticateOptions = {
    secretOrKey,
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  };

  return new Strategy(
    opts,
    async (
      jwtPayload: Credentials & PasswordLessCredentials,
      done: Function
    ) => {
      try {
        const { _id, email, code, role, password } = jwtPayload;
        logger.debug(jwtPayload, 'jwt-payload');
        if (code) {
          // passwordless authentication
          const plCredentials: PasswordLessCredentials = await PasswordLessCredentialsModel.findOne(
            {
              email,
              code,
              role,
            }
          );
          if (!plCredentials) {
            logger.error('No admin session found');
            return done(createNewAuthenticationError(), false);
          }
        } else if (password) {
          // email-password authentication
          const credentials: Credentials = await CredentialsModel.findOne({
            email,
            role,
          });
          if (!credentials) {
            logger.error('No corresponding credentials found');
            return done(createNewAuthenticationError(), false);
          }
        }
        const user: Document = await UserModel.findOne({ email });
        const userObj = user ? user.toObject() : { email, _id };
        return done(undefined, { ...userObj, role });
      } catch (err) {
        logger.error(err, '| passport jwt');
        return done(err, false);
      }
    }
  );
};
