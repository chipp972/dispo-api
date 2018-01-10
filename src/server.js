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

// auth
import { getAdminModel } from './service/passport/admin/admin.mongo';
import { getUserModel } from './service/passport/user/user.mongo';
import { initAuthRoutes } from './service/passport/auth.route';

// api
import { getCompanyModel } from './api/company/company.mongo';
import { getCompanyTypeModel } from './api/companytype/companytype.mongo';
import { getCompanyPopularityModel } from './api/companypopularity/companypopularity.mongo';
import { userCrudRoute } from './api/user/user.route';
import { companyCrudRoute } from './api/company/company.route';
import { companyTypeCrudRoute } from './api/companytype/companytype.route';
import { companyPopularityCrudRoute } from './api/companypopularity/companypopularity.route';

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
    const AdminUserModel = getAdminModel(mongodb);
    const UserModel = getUserModel(mongodb);
    const CompanyTypeModel = getCompanyTypeModel(mongodb);
    const CompanyModel = getCompanyModel(mongodb, UserModel, CompanyTypeModel);
    const CompanyPopularityModel = getCompanyPopularityModel(
      mongodb,
      CompanyModel,
      UserModel
    );

    // express routes
    const appRoutes: AppRoutes = {
      auth: [initAuthRoutes({ UserModel, AdminUserModel, apiEvents })],
      api: [
        userCrudRoute({ UserModel, apiEvents }),
        companyCrudRoute({ CompanyModel, apiEvents }),
        companyPopularityCrudRoute({ CompanyPopularityModel, apiEvents }),
        companyTypeCrudRoute({ CompanyTypeModel, CompanyModel, apiEvents })
      ]
    };

    // express app
    const app = initApp(appRoutes, UserModel, AdminUserModel);
    app.set('env', env.nodeEnv);
    const server = http.createServer(app).listen(env.port.default);

    initWebsocket({
      server,
      apiEvents,
      UserModel,
      AdminUserModel,
      CompanyModel,
      CompanyTypeModel,
      CompanyPopularityModel
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
