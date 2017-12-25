// @flow
import http, { Server } from 'http';
// import https from 'https';
import type { AppRoutes } from './service/express/routes';

import initApp from './service/express/app';
// import initRedis from './service/redis/redis';
import { initMongoose } from './service/mongodb/mongoose';
// import initWebsocket from './service/websocket/websocket';
import { LoggerInstance } from 'winston';
import LOGGER from './config/logger';
import env from './config/env';

// auth
import { initAuthRoutes } from './service/passport/auth.route';
import { getAdminModel } from './service/passport/admin/admin.mongo';

// company
import { getCompanyModel } from './api/company/company.mongo';
import { initCompanyRoutes } from './api/company/company.route';
// import { initCompanyChannel } from './api/company/company.ws';

// company types
import { getCompanyTypeModel } from './api/companytype/companytype.mongo';
import { initCompanyTypeRoutes } from './api/companytype/companytype.route';

// user
import { getUserModel } from './api/user/user.mongo';
import { initUserRoutes } from './api/user/user.route';

/**
 * Handle server errors
 * @param {Server} server
 * @param {LoggerInstance} logger
 * @return {void}
 */
function handleServerError(server: Server, logger: LoggerInstance) {
  server.on('error', (err: Error) => {
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
    // db connections
    // const redis = await initRedis(LOGGER);
    const mongodb = await initMongoose();

    // mongoose models
    const AdminModel = getAdminModel(mongodb);
    const CompanyTypeModel = getCompanyTypeModel(mongodb);
    const UserModel = getUserModel(mongodb);
    const CompanyModel = getCompanyModel(mongodb, UserModel, CompanyTypeModel);

    // express routes
    const appRoutes: AppRoutes = {
      auth: [initAuthRoutes(UserModel, AdminModel)],
      api: [
        initUserRoutes(UserModel),
        initCompanyTypeRoutes(CompanyTypeModel),
        initCompanyRoutes(CompanyModel)
      ]
    };

    // express app
    const app = initApp(appRoutes, UserModel, AdminModel);
    app.set('env', env.nodeEnv);
    const server = http.createServer(app).listen(env.port.default);
    // const httpsServer = https.createServer(app).listen(env.port.https);
    //
    // initWebsocket(server, redis, [initCompanyChannel], LOGGER);

    handleServerError(server, LOGGER);

    const cleanExit = () => {
      LOGGER.log('info', 'Server is down');
      // if (env.nodeEnv === 'production') {
      // redis.quit().then(() => process.exit(0));
      // }
    };

    process.once('SIGINT', cleanExit);
    process.once('SIGTERM', cleanExit);

    server.on('listening', () => {
      const addr = server.address();
      const bind =
        typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      LOGGER.info(`Server Listening on ${bind}`);
    });
  } catch (err) {
    LOGGER.log('error', err);
  }
})();
