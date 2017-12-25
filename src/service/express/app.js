// @flow
import express, { Application } from 'express';
import { Model } from 'mongoose';
import applyMiddlewares from './middlewares';
import { initRoutes } from './routes';
import type { AppRoutes } from './routes';

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
    initRoutes(app, appRoutes);

    return app;
  } catch (err) {
    throw err;
  }
}
