// @flow
import io from 'socket.io';
import Redis from 'ioredis';
import { Server } from 'http';

import adminChannel from './channels/admin';
import createLogger from './logger';
import env from './env';

export default function initWebsocket(server: Server, database: Redis.Redis) {
  const logger = createLogger(env.log.file.websocket);
  const ws = io(server);

  ws.on('connection', (socket) => {
    logger.log('info', 'websocket:general', 'client connected');

    // channels
    adminChannel(socket, database, logger);

    socket.on('error', err => logger.log('error', 'websocket:general', err));
    socket.on('close', () =>
      logger.log('info', 'websocket:general', 'client disconnected'));
  });

  logger.log('info', 'websocket channels', 'initialized');
}
