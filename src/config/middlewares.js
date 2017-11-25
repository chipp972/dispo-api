// @flow
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { Application } from 'express';
import passport from 'passport';
import { Model } from 'mongoose';
import { configurePassport } from './auth';
import env from '../config/env';

/**
 * add middlewares to express app
 * @param {Application} app
 * @param {Model} UserModel
 * @param {Model} AdminModel
 * @return {void}
 */
export default function applyMiddlewares(
  app: Application,
  UserModel: Model,
  AdminModel: Model
): void {
  /* config and logger init */
  const logmode = env.nodeEnv === 'production' ? 'combined' : 'short';

  // security
  app.use(helmet());

  // authentication
  app.use(passport.initialize());
  configurePassport(UserModel, AdminModel);

  // logs
  if (env.nodeEnv === 'development') app.use(morgan('dev'));
  app.use(morgan(logmode));

  // requests
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  return app;
}
