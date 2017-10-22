// @flow
import io from 'socket.io';

import adminChannel from './channels/admin';
import createLogger from './logger';
import env from './env';

export default function initWebsocket(server: any, database: any) {
  const logger = createLogger(env.log.file.websocket);
  const ws = io(server);

  ws.on('connection', (socket) => {
    logger.log('info', 'connection', 'general channel');

    socket.broadcast.emit('news', { hello: 'world' });

    socket.on('ping', (data) => {
      socket.emit('pong', data);
    });

    socket.on('error', err => logger.log('error', 'general channel', err));

    // channels
    adminChannel(socket, database, logger);
  });

  logger.log('info', 'websocket channels', 'initialized');
}
