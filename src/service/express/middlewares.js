// @flow
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { Application, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Model } from 'mongoose';
import cors, { CorsOptions } from 'cors';
import { configurePassport } from '../passport/passport.config';
import env from '../../config/env';

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

  // logs
  if (env.nodeEnv === 'development') app.use(morgan('dev'));
  app.use(morgan(logmode));

  // requests
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
  if (env.auth.isAuthenticationActivated || env.nodeEnv === 'production') {
    app.use(passport.initialize());
    configurePassport(UserModel, AdminModel);
    app.use(
      '/api',
      passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/auth/failure'
      }),
      (req: Request, res: Response, next: NextFunction) => {
        console.log(req.user, 'user [middlewares.js]');
        next();
      }
    );
  }

  return app;
}
