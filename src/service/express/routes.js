// @flow
import { Application, Router } from 'express';
import { initErrorHandlers } from './errors';

export type AppRoutes = {
  auth: Router[],
  api: Router[]
};

/**
 * register all routes of the express app
 * @param {Application} app
 * @param {AppRoutes} appRoutes
 */
export function initRoutes(app: Application, { auth, api }: AppRoutes): void {
  auth.forEach((route: Router) => app.use(route));

  api.forEach((route: Router) => app.use('/api', route));

  initErrorHandlers(app);
}
