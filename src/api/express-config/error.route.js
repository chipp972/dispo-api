// @flow
import { Request, Response, NextFunction } from 'express';
import { getRegistrySingleton } from 'singleton-module-registry';
import { customErrorFactory } from 'customizable-error';

export const setupErrorRoutes = () => {
  const registry = getRegistrySingleton();
  const { env, app, logger } = registry.getModules(['env', 'app', 'logger']);
  const isProd = env.nodeEnv === 'production';

  /* Handle 404 */
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(
      customErrorFactory({
        name: 'NotFoundError',
        message: 'Not found',
        status: 404,
        code: 'NOT_FOUND',
      })
    );
  });

  // logger
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    return next(err);
  });

  /* default error handlers */
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const stack = isProd ? '' : err.stack;
    const statusCode = err.status || res.statusCode || 500;
    return res.status(statusCode).json({
      type: err.name || 'error',
      message: err.message,
      stack,
      code: err.code || 'ERROR',
      success: false,
    });
  });
};
