// @flow
import { Router, Request, Response, NextFunction } from 'express';
import env from '../config/env';

export function initRoutes(routes: Router[]): Router {
  const router = Router();

  router.get('/working', (req: Request, res: Response) =>
    res.json({ success: true }));

  if (env.nodeEnv !== 'production') {
    // activate CORS for dev
    router.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      next();
    });

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
  }
  return router;
}
