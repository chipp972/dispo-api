// @flow
import io, { SocketIO } from 'socket.io';
import Redis from 'ioredis';
import { Server } from 'http';
import { LoggerInstance } from 'winston';

// import adminChannelConfig from './admin/admin.ws';
import initUserChannel from './user/user.ws';
// import companyChannelConfig from './company/company.ws';

/**
 * Initialize channel listeners for each actions defined in a channel config
 */
function initChannel(
  socket: SocketIO.Socket,
  database: Redis.Redis,
  logger: LoggerInstance,
  channelConfig: ChannelConfig
): void {
  try {
    socket.join(channelConfig.channelName);
    Object.keys(channelConfig.actions).forEach((action: string) => {
      socket.on(action, channelConfig.actions[action]);
    });
  } catch (err) {
    throw new Error(`initChannel ${channelConfig.channelName}: ${err}`);
  }
}

/**
 * Initialize an array of channels
 */
function initChannels(
  socket: SocketIO.Socket,
  database: Redis.Redis,
  logger: LoggerInstance,
  channelConfigFactories: ChannelConfigFactory[]
): void {
  channelConfigFactories
    .map((channelConfigFactory: ChannelConfigFactory) =>
      channelConfigFactory(socket, database))
    .forEach((channelConfig: ChannelConfig) =>
      initChannel(
        socket,
        database,
        logger,
        channelConfig
      ));
}

export default function initWebsocket(
  server: Server,
  database: Redis.Redis,
  logger: LoggerInstance
): void {
  const ws: SocketIO.Server = io(server);

  ws.on('connection', (socket: SocketIO.Socket) => {
    logger.log('info', 'websocket:general', 'client connected');

    // channels
    initChannels(ws, database, logger, [
      initUserChannel
      // adminChannelConfig,
      // companyChannelConfig
    ]);

    socket.on('error', err => logger.log('error', 'websocket:general', err));
    socket.on('close', () =>
      logger.log('info', 'websocket:general', 'client disconnected'));
  });

  logger.log('info', 'websocket channels', 'initialized');
}
