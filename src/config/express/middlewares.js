// @flow
import helmet from 'helmet';
import formData from 'express-form-data';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import { Application } from 'express';
import { Model } from 'mongoose';
import { authenticationMiddleware } from '../../service/passport/passport.config';
import env from '../env';

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
  const isProd = env.nodeEnv === 'production';
  const logmode = isProd ? 'combined' : 'short';

  // security
  app.use(helmet());

  // logs
  if (!isProd) app.use(morgan('dev'));
  app.use(morgan(logmode));

  // multi-part form data
  app.use(formData.parse({ autoFiles: true }));
  app.use(formData.format());
  app.use(formData.stream());
  app.use(formData.union());

  // json body
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // cors
  const corsOptions: CorsOptions = {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 204
  };
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));

  // authentication
  if (env.auth.isAuthenticationActivated) {
    authenticationMiddleware({ path: '/api', app, UserModel, AdminModel });
  }

  return app;
}
