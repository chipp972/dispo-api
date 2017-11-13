// @flow
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { Application } from 'express';
import env from '../config/env';

/**
 * add middlewares to express
 */
export default function applyMiddlewares(app: Application) {
  /* config and logger init */
  const logmode = env.nodeEnv === 'production' ? 'combined' : 'short';

  // security
  app.use(helmet());

  // authentication
  // app.use(passport.initialize());
  // configurePassport(database, passport);
  // initAuthentication(app, database, passport)

  // logs
  if (env.nodeEnv === 'development') app.use(morgan('dev'));
  app.use(morgan(logmode));

  // requests
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  return app;
}
