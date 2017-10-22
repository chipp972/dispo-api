// @flow
import http from 'http';
// import https from 'https';
import initApp from './app/app';
import initRedis from './database/redis';
import initWebsocket from './websocket';
import createLogger from './logger';
import env from './env';

(async () => {
  const logger = createLogger(env.log.file.server);
  const database = await initRedis();
  const app = initApp(database, logger);

  app.set('env', env.nodeEnv);
  const server = http.createServer(app).listen(env.port.http);
  // const httpsServer = https.createServer(app).listen(env.port.https);

  // Handle server errors
  server.on('error', (err: Error) => {
    if (err.syscall !== 'listen') {
      logger.error(err.message);
      throw err;
    }

    const bind = `Port ${env.port.http}`;

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

  const cleanExit = () => {
    logger.log('info', 'Server is down');
    if (env.nodeEnv === 'production') {
      database.quit().then(() => process.exit(0));
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

  initWebsocket(server, database);
})();
