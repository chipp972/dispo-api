// @flow
import http, { Server } from 'http';
import express from 'express';
import { applyMiddlewares } from './express-config/middlewares';
import { setupErrorRoutes } from './express-config/error.route';
import { ModuleRegistry } from 'singleton-module-registry';
import { registerCompanyTypeModule } from './companytype/companytype.module';
import { registerUserModule } from './user/user.module';
import { registerCompanyModule } from './company/company.module';
import { registerPopularityModule } from './popularity/popularity.module';
import { setupAuthentication } from './passport/passport.setup';
import { initWebsocketServer } from './websocket/websocket';

export function initApi(registry: ModuleRegistry): Server {
  const app = express();

  registry.registerModule(app, 'app');
  const { auth, port } = registry.getModule('env');
  const companyTypeModule = registerCompanyTypeModule();
  const userModule = registerUserModule();
  const companyModule = registerCompanyModule();
  const companyPopularityModule = registerPopularityModule();

  // middlewares
  applyMiddlewares();

  // authentication middleware and routes
  if (auth.isAuthenticationActivated) {
    const authenticationModule = setupAuthentication();
    app.use('/', authenticationModule.router);
  }

  // api routes
  app.use('/api', companyTypeModule.router);
  if (!auth.isAuthenticationActivated) app.use('/api', userModule.router);
  app.use('/api', companyModule.router);
  app.use('/api', companyPopularityModule.router);

  // error handling routes
  setupErrorRoutes();

  const server = http.createServer(app).listen(port.default);

  // setup websocket API
  initWebsocketServer(server);

  return server;
}
