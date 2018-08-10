// @flow
import { initMongoose } from './config/mongodb/mongoose';
import { initApi } from './api/api';
import LOGGER from './config/logger';
import { env } from './config/env';
import { Server } from 'http';
import {
  saveLogoInCloudinary,
  deleteFromCloudinary,
} from './service/cloudinary/cloudinary';
import { mapUtil } from './service/google/map.utils';
import { sendMail } from './service/mail/smtp';
import {
  getRegistrySingleton,
  ModuleRegistry,
} from 'singleton-module-registry';

/**
 * Handle server errors
 * @param {Server} server
 * @param {LoggerInstance} logger
 * @return {void}
 */
function handleServerError(server: Server) {
  server.on('error', (err: any) => {
    if (err.syscall !== 'listen') {
      LOGGER.error(err.message);
      throw err;
    }

    const bind = `Port ${env.port.default}`;

    // $flowFixMe
    switch (err.code) {
      case 'EACCES':
        LOGGER.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        LOGGER.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        LOGGER.error(err.message);
        throw err;
    }
  });
}

const cleanExit = (registry: ModuleRegistry, LOG: any) => async () => {
  LOG.info('Server is down');
  registry.clean();
  process.exit(0);
};

const onListening = (server: Server, LOG: any) => () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  LOG.info(`Server Listening on ${bind}`);
  LOG.info(`Process pid is ${process.pid}`);
};

(async () => {
  try {
    const registry = getRegistrySingleton();
    registry
      .registerModule(env, 'env')
      .registerModule(LOGGER, 'logger')
      .registerModule(await initMongoose(), 'mongodb')
      .registerModule({
        id: 'cloud',
        saveImage: saveLogoInCloudinary,
        deleteImage: deleteFromCloudinary,
      })
      .registerModule({
        id: 'mailUtil',
        sendMail,
      })
      .registerModule({
        id: 'mapUtil',
        ...mapUtil,
      });

    const server = initApi(registry);

    handleServerError(server);

    process.once('SIGINT', cleanExit(registry, LOGGER));
    process.once('SIGTERM', cleanExit(registry, LOGGER));
    server.on('listening', onListening(server, LOGGER));
  } catch (err) {
    LOGGER.error(err);
  }
})();
