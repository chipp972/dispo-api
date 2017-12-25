// @flow
import { Application, Request, Response, NextFunction } from 'express';
import env from '../../config/env';
import LOGGER from '../../config/logger';
import { AssertionError } from 'assert';

export const initErrorHandlers = (app: Application) => {
  const isDev = env.nodeEnv === 'development';

  /* Handle 404 */
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error('Not found');
    res.status(404);
    next(err);
  });

  // logger
  if (isDev) {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      LOGGER.error(err.message);
      return next(err);
    });
  }

  // assertion errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AssertionError) {
      res.status(400);
      res.type = 'AssertionError';
    }
    return next(err);
  });

  /* default error handlers */
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const stack = isDev ? err.stack : '';
    return res.status(res.statusCode || 500).json({
      message: err.message,
      stack,
      success: false
    });
  });
};
