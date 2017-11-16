// @flow
import express, { Router, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import env from '../config/env';

export function initRoutes(routes: Router[]): Router {
  const router = Router();

  const corsOptions: CorsOptions = {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 204
  };

  if (env.nodeEnv === 'production') {
    router.use('/ui', express.static(`${__dirname}/../../public`));
  }

  // activate cors
  router.options('*', cors(corsOptions));
  router.use(cors(corsOptions));

  router.get('/working', (req: Request, res: Response) =>
    res.json({ success: true }));


  routes.forEach(route => router.use('/', route));

  /* Handle 404 */
  router.use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error('Not found');
    // $FlowFixMe
    err.status = 404;
    next(err);
  });

  /* error handlers (500) */
    router.use((err, req, res, next) => { // eslint-disable-line
    const stack = env.nodeEnv === 'development' ? err.stack : '';
    return res.status(err.status || 500).json({
      message: err.message,
      stack,
      success: false
    });
  });
  return router;
}
