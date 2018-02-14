// @flow
import { Module, getRegistrySingleton } from 'singleton-module-registry';
import { setupAuthenticationMiddleware } from './passport.config';
import { getCredentialsModel } from './credentials/credentials.mongo';
import { getPasswordLessCredentialsModel } from './passwordless/passwordless.mongo';
import { getPassportRoutes } from './passport.route';

export const setupAuthentication = (): Module => {
  const registry = getRegistrySingleton();
  const { app, env, mongodb, user, mailUtil, logger } = registry.getModules([
    'app',
    'env',
    'mongodb',
    'user',
    'mailUtil',
    'logger',
  ]);

  const CredentialsModel = getCredentialsModel({
    mongooseConnection: mongodb,
    saltRounds: env.auth.saltRounds,
  });
  const PasswordLessCredentialsModel = getPasswordLessCredentialsModel(mongodb);

  const router = getPassportRoutes({
    PasswordLessCredentialsModel,
    CredentialsModel,
    UserModel: user.model,
    userRouterConfig: user.routerConfig,
    sendMail: mailUtil.sendMail,
    validDuration: env.auth.admin.validDuration,
    credentialsTokenExpiration: env.auth.tokenExpiration,
    passwordLessTokenExpiration: env.auth.admin.tokenExpiration,
    secretOrKey: env.auth.secretOrKey,
  });

  setupAuthenticationMiddleware({
    app,
    path: '/',
    UserModel: user.model,
    PasswordLessCredentialsModel,
    CredentialsModel,
    secretOrKey: env.auth.secretOrKey,
    logger,
  });

  const module = {
    required: ['app', 'env', 'mongodb', 'mailUtil', 'user', 'logger'],
    id: 'authentication',
    router,
  };

  registry.on('user:removed', (user: { email: string }) => {
    CredentialsModel.findOneAndRemove({ email: user.email });
    PasswordLessCredentialsModel.findOneAndRemove({ email: user.email });
  });

  registry.registerModule(module);
  return module;
};
