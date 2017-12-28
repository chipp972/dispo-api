// @flow
import http, { Server } from 'http';
// import https from 'https';

import initApp from './service/express/app';
// import initRedis from './service/redis/redis';
import { initMongoose } from './service/mongodb/mongoose';
import { initWebsocket } from './service/websocket/websocket';
import { LoggerInstance } from 'winston';
import LOGGER from './config/logger';
import env from './config/env';
import { crud } from './service/crud/crud';

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
    // db connections
    // const redis = await initRedis(LOGGER);
    const mongodb = await initMongoose();

    // mongoose models
    const AdminModel = getAdminModel(mongodb);
    const CompanyTypeModel = getCompanyTypeModel(mongodb);
    const UserModel = getUserModel(mongodb);
    const CompanyModel = getCompanyModel(mongodb, UserModel, CompanyTypeModel);
    const CompanyPopularityModel = getCompanyPopularityModel(
      mongodb,
      CompanyModel,
      UserModel
    );

    // express routes
    const appRoutes: AppRoutes = {
      auth: [initAuthRoutes(UserModel, AdminModel)],
      api: [
        userCrudRoute(UserModel, CompanyModel),
        crud({
          path: '/companytype',
          model: CompanyTypeModel,
          // delete associated companies
          after: {
            delete: async (result: any, req: Request, res: Response) => {
              await CompanyModel.remove({ type: result._id });
              return result;
            }
          }
        }),
        crud({
          path: '/company',
          model: CompanyModel
        }),
        crud({
          path: '/companypopularity',
          model: CompanyPopularityModel
        })
      ]
    };

    // express app
    const app = initApp(appRoutes, UserModel, AdminModel);
    app.set('env', env.nodeEnv);
    const server = http.createServer(app).listen(env.port.default);
    // const httpsServer = https.createServer(app).listen(env.port.https);

    initWebsocket(server);

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
