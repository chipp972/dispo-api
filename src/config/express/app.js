// @flow
import express, { Application, Router } from 'express';
import { Model } from 'mongoose';
import applyMiddlewares from './middlewares';
import { initErrorHandlers } from './errors';

type AppRoutes = {
  auth: Router[],
  api: Router[]
};

/**
 * Initialize the application
 * @param {AppRoutes} appRoutes
 * @param {Model} UserModel
 * @param {Model} AdminModel
 * @return {Application}
 */
export default function initApp(
  appRoutes: AppRoutes,
  UserModel: Model,
  AdminModel: Model
): Application {
  try {
    const app = express();

    /* express middlewares */
    applyMiddlewares(app, UserModel, AdminModel);

    /* routes */
    appRoutes.auth.forEach((route: Router) => app.use(route));
    appRoutes.api.forEach((route: Router) => app.use('/api', route));

    /* errors */
    initErrorHandlers(app);

    return app;
  } catch (err) {
    throw err;
  }
}
