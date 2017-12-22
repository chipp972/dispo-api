// @flow
import io, { SocketIO } from 'socket.io';
import Redis from 'ioredis';
import { Server } from 'http';
import { LoggerInstance } from 'winston';

export type ChannelConfig = {
  channelName: string,
  actions: {
    [actionName: string]: (data: any) => Promise<{}>
  }
};

export type ChannelConfigFactory = (
  socket: SocketIO.Socket,
  databaseInstance: any
) => ChannelConfig;

/**
 * Initialize channel listeners for each actions defined in a channel config
 */
function initChannel(
  socket: SocketIO.Socket,
  database: Redis.Redis,
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
  channelConfigFactories: ChannelConfigFactory[]
): void {
  channelConfigFactories
    .map((channelConfigFactory: ChannelConfigFactory) =>
      channelConfigFactory(socket, database)
    )
    .forEach((channelConfig: ChannelConfig) =>
      initChannel(socket, database, channelConfig)
    );
}

export default function initWebsocket(
  server: Server,
  database: Redis.Redis,
  channelConfigFactories: ChannelConfigFactory[],
  logger: LoggerInstance
): void {
  const ws: SocketIO.Server = io(server);

  ws.on('connection', (socket: SocketIO.Socket) => {
    logger.log('info', 'websocket:general', 'client connected');

    // channels initialisation
    initChannels(socket, database, channelConfigFactories);

    socket.on('error', (err: Error) =>
      logger.log('error', 'websocket:general', err)
    );
    socket.on('close', () =>
      logger.log('info', 'websocket:general', 'client disconnected')
    );
  });

  logger.log('info', 'websocket channels', 'initialized');
}
