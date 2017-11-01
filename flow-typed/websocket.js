// @flow
import { SocketIO } from 'socket.io';

export type ChannelConfig = {
  channelName: string,
  actions: {
    [actionName: string]: (data: any) => Promise<voiD>
  }
};

export type ChannelConfigFactory = (
  socket: SocketIO.Socket,
  databaseInstance: any,
) => ChannelConfig;
