// @flow
import http, { Server } from 'http';
import EventEmitter from 'events';
// import https from 'https';

import initApp from './service/express/app';
// import initRedis from './service/redis/redis';
import { initMongoose } from './service/mongodb/mongoose';
import { LoggerInstance } from 'winston';
import LOGGER from './config/logger';
import env from './config/env';
import { crud } from './service/crud/crud';

import { initWebsocket } from './service/websocket/websocket';
import { EVENTS } from './service/websocket/websocket.event';

// auth
import { getAdminModel } from './service/passport/admin/admin.mongo';
import { initAuthRoutes } from './service/passport/auth.route';

// api
import { getCompanyModel } from './api/company/company.mongo';
import { getCompanyTypeModel } from './api/companytype/companytype.mongo';
import { getCompanyPopularityModel } from './api/companypopularity/companypopularity.mongo';
import { getUserModel } from './api/user/user.mongo';
import { userCrudRoute } from './api/user/user.route';

// types
import type { AppRoutes } from './service/express/routes';

/**
 * Handle server errors
 * @param {Server} server
 * @param {LoggerInstance} logger
 * @return {void}
 */
function handleServerError(server: Server, logger: LoggerInstance) {
  server.on('error', (err: any) => {
    if (err.syscall !== 'listen') {
      logger.error(err.message);
      throw err;
    }

    const bind = `Port ${env.port.default}`;

    // $flowFixMe
    switch (err.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        logger.error(err.message);
        throw err;
    }
  });
}

(async () => {
  try {
    // event emitters
    const apiEvents = new EventEmitter();

    // db connections
    // const redis = await initRedis(LOGGER);
    const mongodb = await initMongoose();

    // mongoose models
    const AdminModel = getAdminModel(mongodb);
    const CompanyTypeModel = getCompanyTypeModel(mongodb);
    const UserModel = getUserModel(mongodb);
    const CompanyModel = getCompanyModel(
      mongodb,
      UserModel,
      CompanyTypeModel,
      (company: any) => apiEvents.emit(EVENTS.COMPANY.deleted, company)
    );
    const CompanyPopularityModel = getCompanyPopularityModel(
      mongodb,
      CompanyModel,
      UserModel
    );

    // express routes
    const appRoutes: AppRoutes = {
      auth: [initAuthRoutes(UserModel, AdminModel)],
      api: [
        userCrudRoute(UserModel, CompanyModel, apiEvents),
        crud({
          path: '/companytype',
          model: CompanyTypeModel,
          after: {
            create: async (result: any, req: Request) => {
              apiEvents.emit(EVENTS.COMPANY_TYPE.created, result);
            },
            update: async (result: any, req: Request) => {
              apiEvents.emit(EVENTS.COMPANY_TYPE.updated, result);
            },
            delete: async (result: any, req: Request) => {
              await CompanyModel.remove({ type: result._id });
              apiEvents.emit(EVENTS.COMPANY_TYPE.deleted, result);
            }
          },
          isAuthenticationActivated: env.auth.isAuthenticationActivated
        }),
        crud({
          path: '/company',
          model: CompanyModel,
          after: {
            create: async (result: any, req: Request) => {
              apiEvents.emit(EVENTS.COMPANY.created, result);
            },
            update: async (result: any, req: Request) => {
              apiEvents.emit(EVENTS.COMPANY.updated, result);
            },
            delete: async (result: any, req: Request) => {
              await CompanyPopularityModel.remove({ companyId: result._id });
              apiEvents.emit(EVENTS.COMPANY.deleted, result);
            }
          },
          isAuthenticationActivated: env.auth.isAuthenticationActivated
        }),
        crud({
          path: '/companypopularity',
          model: CompanyPopularityModel,
          after: {
            create: async (result: any, req: Request) => {
              apiEvents.emit(EVENTS.COMPANY_POPULARITY.created, result);
            },
            update: async (result: any, req: Request) => {
              apiEvents.emit(EVENTS.COMPANY_POPULARITY.updated, result);
            },
            delete: async (result: any, req: Request) => {
              apiEvents.emit(EVENTS.COMPANY_POPULARITY.deleted, result);
            }
          },
          isAuthenticationActivated: env.auth.isAuthenticationActivated
        })
      ]
    };

    // express app
    const app = initApp(appRoutes, UserModel, AdminModel);
    app.set('env', env.nodeEnv);
    const server = http.createServer(app).listen(env.port.default);

    initWebsocket({
      server,
      apiEvents,
      UserModel,
      AdminModel
    });

    handleServerError(server, LOGGER);

    const cleanExit = () => {
      LOGGER.info('Server is down');
      // if (env.nodeEnv === 'production') {
      // redis.quit().then(() => process.exit(0));
      // }
      process.exit(0);
    };

    process.once('SIGINT', cleanExit);
    process.once('SIGTERM', cleanExit);

    server.on('listening', () => {
      const addr = server.address();
      const bind =
        typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      LOGGER.info(`Server Listening on ${bind}`);
      LOGGER.info(`Process pid is ${process.pid}`);
    });
  } catch (err) {
    LOGGER.error(err);
  }
})();
