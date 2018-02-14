// @flow
import { Router, Request, Response, NextFunction } from 'express';
import { initPasswordLessRoutes } from './passwordless/passwordless.route';
import { initCredentialsRoutes } from './credentials/credentials.route';
import { passportRoutes } from './passport.constant';
import { createNewAuthenticationFailedError } from './passport.error';
import { formatResponse, handleUnauthorized } from './passport.helper';
import type { Model } from 'mongoose';

type Options = {
  PasswordLessCredentialsModel: Model,
  CredentialsModel: Model,
  UserModel: Model,
  userRouterConfig: any,
  sendMail: (any) => any,
  validDuration: number,
  credentialsTokenExpiration: number,
  passwordLessTokenExpiration: number,
  secretOrKey: string,
};

export function getPassportRoutes({
  PasswordLessCredentialsModel,
  CredentialsModel,
  UserModel,
  userRouterConfig,
  sendMail,
  validDuration,
  credentialsTokenExpiration,
  passwordLessTokenExpiration,
  secretOrKey,
}: Options): Router {
  const router = Router();

  router.use(
    '/',
    initPasswordLessRoutes({
      PasswordLessCredentialsModel,
      sendMail,
      validDuration,
      tokenExpiration: passwordLessTokenExpiration,
      secretOrKey,
      handleUnauthorized,
      routes: {
        sendCode: passportRoutes.admin.sendCode.path,
        authenticate: passportRoutes.admin.authenticate.path,
        logout: passportRoutes.admin.logout.path,
      },
    })
  );

  router.use(
    '/',
    initCredentialsRoutes({
      secretOrKey,
      tokenExpiration: credentialsTokenExpiration,
      UserModel,
      CredentialsModel,
      formatResponse,
      handleUnauthorized,
      createNewAuthenticationFailedError,
      userRouterConfig,
      routes: {
        register: passportRoutes.user.register.path,
        login: passportRoutes.user.login.path,
      },
    })
  );

  // authentication failure route
  router
    .route(passportRoutes.failure.path)
    .get((req: Request, res: Response, next: NextFunction) =>
      next(createNewAuthenticationFailedError())
    );

  return router;
}
