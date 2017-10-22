// @flow
import { LoggerInstance } from 'winston';
import { Router, Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';

export default function initRoutes(database: Redis.Redis, logger: LoggerInstance): Router {
  const router = Router();
  // redirection
  router.get('/', (req: Request, res: Response) => res.redirect('/index.html'));
  router.get('/working', (req, res) => res.json({ success: true }));

  // Handle 404
  router.use((req: Request, res: Response, next: NextFunction) => {
    logger.log('info', 'app', '404 not found');
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  });

  logger.log('info', 'app', 'route initialized');
  return router;
}
