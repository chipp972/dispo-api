// @flow
import http from 'http';
// import https from 'https';
import { LoggerInstance } from 'winston';

import initApp from './config/app';
import initRedis from './config/database/redis';
import initMongo from './config/database/mongodb';
import initWebsocket from './config/websocket';

// express routes
import initCompanyRoutes from './api/company/company.route';
// import initCompanyTypeRoutes from './api/company/companytype.route';

// mongoose models
import { getCompanyModel } from './api/company/company.mongo';
import { getCompanyTypeModel } from './api/companytype/companytype.mongo';

// channels
// import { initAdminChannel } from './api/admin/admin.ws';
// import { initUserChannel } from './api/user/user.ws';
import { initCompanyChannel } from './api/company/company.ws';

// other config
import getLogger from './config/logger';
import env from './config/env';

/**
 * Handle server errors
 */
function handleError(server: http.Server, logger: LoggerInstance) {
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
    const redis = await initRedis(logger);
    const mongodb = await initMongo(logger);

    const models: MongooseModels = {
      Company: getCompanyModel(mongodb),
      CompanyType: getCompanyTypeModel(mongodb)
    };

    const routes: ExpressRoute[] = [
      {
        path: '/company',
        router: initCompanyRoutes(models.Company)
      }
    ];

    const app = initApp(routes);
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
