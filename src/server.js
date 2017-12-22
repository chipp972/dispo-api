// @flow
import http, { Server } from 'http';
// import https from 'https';
import { Router } from 'express';
import { LoggerInstance } from 'winston';

import initApp from './service/express/app';
import initRedis from './service/redis/redis';
import initMongoose from './service/mongodb/mongodb';
import initWebsocket from './service/websocket/websocket';
import getLogger from './config/logger';
import env from './config/env';

// auth
import { initAuthRoutes } from './api/auth/auth.route';

// admin
import { getAdminModel } from './api/admin/admin.mongo';
import { initAdminRoutes } from './api/admin/admin.route';

// company
import { getCompanyModel } from './api/company/company.mongo';
import { initCompanyRoutes } from './api/company/company.route';
import { initCompanyChannel } from './api/company/company.ws';

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
function handleError(server: Server, logger: LoggerInstance) {
  server.on('error', (err: Error) => {
    if (err.syscall !== 'listen') {
      logger.error(err.message);
      throw err;
    }

    const bind = `Port ${env.port.default}`;

    // $FlowFixMe
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
  const logger = getLogger();
  try {
    // db connections
    const redis = await initRedis(logger);
    const mongodb = await initMongoose(logger);

    // mongoose models
    const AdminModel = getAdminModel(mongodb);
    const CompanyTypeModel = getCompanyTypeModel(mongodb);
    const UserModel = getUserModel(mongodb);
    const CompanyModel = getCompanyModel(mongodb, UserModel, CompanyTypeModel);

    // express routes
    const routes: Router[] = [
      initAuthRoutes(UserModel, AdminModel),
      initAdminRoutes(AdminModel),
      initUserRoutes(UserModel),
      initCompanyTypeRoutes(CompanyTypeModel),
      initCompanyRoutes(CompanyModel)
    ];

    // express app
    const app = initApp(routes, UserModel, AdminModel);
    app.set('env', env.nodeEnv);
    const server = http.createServer(app).listen(env.port.default);
    // const httpsServer = https.createServer(app).listen(env.port.https);
    initWebsocket(server, redis, [initCompanyChannel], logger);

    handleError(server, logger);

    const cleanExit = () => {
      logger.log('info', 'Server is down');
      if (env.nodeEnv === 'production') {
        redis.quit().then(() => process.exit(0));
      }
    };

    process.once('SIGINT', cleanExit);
    process.once('SIGTERM', cleanExit);

    server.on('listening', () => {
      const addr = server.address();
      const bind =
        typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
      logger.info(`Server Listening on ${bind}`);
    });
  } catch (err) {
    logger.log('error', err);
    throw err;
  }
})();
