// @flow
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
// import passport from 'passport';
import Redis from 'ioredis';
import { LoggerInstance } from 'winston';

import env from '../config/env';
import initRoutes from './routes';
// import { configurePassport } from './auth';

/**
 * Initialize the application and the database
 */
export default function initApp(
  database: Redis.Redis,
  logger: LoggerInstance
): express.Application {
  try {
    /* config and logger init */
    const logmode = env.nodeEnv === 'production' ? 'combined' : 'short';
    // database and app init
    const app = express();

    /* express middlewares */

    // security
    app.use(helmet());

    // authentication
    // app.use(passport.initialize());
    // configurePassport(database, passport);
    // initAuthentication(app, database, passport)

    // logs
    if (env.nodeEnv === 'development') app.use(morgan('dev'));
    app.use(morgan(logmode, { stream: logger.morganStream }));

    // requests
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    /* routes */
    app.use(express.static(`${__dirname}/../public`));
    app.use(initRoutes(database, logger));

    /* Handle 404 */
    app.use((req: Request, res: Response, next: NextFunction) => {
      logger.log('info', 'app', '404 not found');
      const err = new Error('Not found');
      // $FlowFixMe
      err.status = 404;
      next(err);
    });

    /* error handlers */
    app.use((err, req, res, next) => { // eslint-disable-line
      const stack = env.nodeEnv === 'development' ? err.stack : '';
      return res.status(err.status || 500).json({
        message: err.message,
        stack,
        success: false
      });
    });

    return app;
  } catch (err) {
    logger.log('error', 'app', err);
    throw err;
  }
}
