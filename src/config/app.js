// @flow
import express, { Router } from 'express';
import applyMiddlewares from './middlewares';
import { initRoutes } from './routes';
import env from './env';

/**
 * Initialize the application and the database
 */
export default function initApp(routes: Router[]): express.Application {
  try {
    const app = express();

    /* express middlewares */
    applyMiddlewares(app);

    /* routes */
    if (env.nodeEnv === 'production') {
      app.use(express.static(`${__dirname}/../../public`));
    }
    app.use(initRoutes(routes));

    return app;
  } catch (err) {
    throw err;
  }
}
