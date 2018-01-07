// @flow
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors, { CorsOptions } from 'cors';
import { configurePassport } from '../passport/passport.config';
import env from '../../config/env';
import { Application, Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import formData from 'express-form-data';

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
    app.use(passport.initialize());
    configurePassport(UserModel, AdminModel);
    app.use(
      '/api',
      passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/auth/failure'
      }),
      (req: Request, res: Response, next: NextFunction) => {
        next();
      }
    );
  }

  return app;
}
