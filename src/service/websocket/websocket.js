// @flow
import io, { SocketIO } from 'socket.io';
import { Server } from 'http';
import { EVENTS } from './websocket.event';
import LOGGER from '../../config/logger';
import { forEachObjIndexed } from 'ramda';

export const initWebsocket = (server: Server): SocketIO.Server => {
  const ws: SocketIO.Server = io(server);

  ws.on('connection', (socket: SocketIO.Socket) => {
    LOGGER.info('client connected');

    socket.on('error', (err: Error) => LOGGER.error(err));
    socket.on('close', () => LOGGER.info('client disconnected'));

    // broadcast all company events when received
    const broadcastEvent = (key, event) =>
      socket.on(event, (data: any) => socket.broadcast.emit(event, data));

    forEachObjIndexed(broadcastEvent, EVENTS.COMPANY);
  });
  return ws;
};
