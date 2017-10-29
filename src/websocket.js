// @flow
import io, { SocketIO } from 'socket.io';
import Redis from 'ioredis';
import { Server } from 'http';
import { LoggerInstance } from 'winston';

// import adminChannelConfig from './admin/admin.ws';
import userChannelConfig from './user/user.ws';
// import companyChannelConfig from './company/company.ws';

/**
 * function to init channel listeners on actions
 */
function initChannel(
  socket: SocketIO.Socket,
  database: Redis.Redis,
  logger: LoggerInstance,
  channelConfig: ChannelConfig
): void {
  try {
    socket.join(channelConfig.channelName);
    Object.keys(channelConfig.actions).forEach((key) => {
      socket.on(key, channelConfig.actions[key]);
    });
  } catch (err) {
    throw new Error(`initChannel: ${err}`);
  }
}

function initChannels(
  socket: SocketIO.Socket,
  database: Redis.Redis,
  logger: LoggerInstance,
  channelConfigs: ChannelConfig[],
): void {
  channelConfigs.forEach((channelConfig: ChannelConfig) =>
    initChannel(socket, database, logger, channelConfig));
}

export default function initWebsocket(
  server: Server,
  database: Redis.Redis,
  logger: LoggerInstance,
): void {
  const ws: SocketIO.Server = io(server);

  ws.on('connection', (socket: SocketIO.Socket) => {
    logger.log('info', 'websocket:general', 'client connected');

    // channels
    initChannels(ws, database, logger, [
      // adminChannelConfig,
      userChannelConfig,
      // companyChannelConfig
    ]);

    socket.on('error', err => logger.log('error', 'websocket:general', err));
    socket.on('close', () =>
      logger.log('info', 'websocket:general', 'client disconnected'));
  });

  logger.log('info', 'websocket channels', 'initialized');
}
