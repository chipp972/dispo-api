// @flow
import express, { Router, Application } from 'express';
import { Model } from 'mongoose';
import applyMiddlewares from './middlewares';
import { initRoutes } from './routes';

/**
 * Initialize the application
 * @param {Router[]} routes
 * @param {Model} UserModel
 * @param {Model} AdminModel
 * @return {Application}
 */
export default function initApp(
  routes: Router[],
  UserModel: Model,
  AdminModel: Model
): Application {
  try {
    const app = express();

    /* express middlewares */
    applyMiddlewares(app, UserModel, AdminModel);

    /* routes */
    app.use(initRoutes(routes));

    return app;
  } catch (err) {
    throw err;
  }
}
