// @flow
import { Router, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import env from '../../config/env';

export function initRoutes(routes: Router[]): Router {
  const router = Router();

  const corsOptions: CorsOptions = {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 204
  };

  // activate cors
  router.options('*', cors(corsOptions));
  router.use(cors(corsOptions));

  router.get('/working', (req: Request, res: Response) =>
    res.json({ success: true })
  );

  routes.forEach((route: Router) => router.use('/', route));

  /* Handle 404 */
  router.use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error('Not found');
    res.status(404);
    next(err);
  });

  /* error handlers */
  router.use((err, req, res, next) => {
    const stack = env.nodeEnv === 'development' ? err.stack : '';
    return res.status(res.statusCode || 500).json({
      message: err.message,
      stack,
      success: false
    });
  });
  return router;
}
