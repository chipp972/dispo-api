// @flow
import { Application, Request, Response, NextFunction } from 'express';
import env from '../../config/env';
import LOGGER from '../../config/logger';
import { NotFoundError } from '../../config/custom.errors';
import { AssertionError } from 'assert';

export const initErrorHandlers = (app: Application) => {
  const isDev = env.nodeEnv === 'development';

  /* Handle 404 */
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError());
  });

  // logger
  if (isDev) {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      LOGGER.error(err.message);
      return next(err);
    });
  }

  /* default error handlers */
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const stack = isDev ? err.stack : '';
    const statusCode = err.status
      ? err.status
      : res.statusCode ? res.statusCode : 500;
    return res.status(statusCode).json({
      type: err.name || 'error',
      message: err.message,
      stack,
      success: false
    });
  });
};
