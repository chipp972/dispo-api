// @flow
import { SocketIO } from 'socket.io';

export type ChannelConfig = {
  channelName: string,
  actions: {
    [actionName: string]: (str: string) => void
  }
};

export type ChannelConfigFactory = (
  socket: SocketIO.Socket,
  databaseInstance: any,
) => ChannelConfig;
