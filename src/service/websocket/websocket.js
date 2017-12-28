// @flow
import EventEmitter from 'events';
import { Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import io, { SocketIO } from 'socket.io';
import { Server } from 'http';
import { EVENTS } from './websocket.event';
import LOGGER from '../../config/logger';
import { forEachObjIndexed } from 'ramda';
import env from '../../config/env';

export type WebsocketOptions = {
  server: Server,
  apiEvents: EventEmitter,
  UserModel: Model,
  AdminModel: Model
};

export const initWebsocket = ({
  server,
  apiEvents,
  UserModel,
  AdminModel
}: WebsocketOptions): SocketIO.Server => {
  const ws: SocketIO.Server = io(server);

  // emit events to clients
  const emitEvent = (key, event) =>
    apiEvents.on(event, (data: any) => ws.emit(event, data));
  forEachObjIndexed(emitEvent, EVENTS.COMPANY);

  // authentication middleware
  ws.use((socket, next) => {
    const token = socket.handshake.query.token;
    jwt.verify(token, env.auth.secretOrKey, (jwtPayload: { role: string }) => {
      const { _id, email, code, role } = jwtPayload;
      console.log(jwtPayload, 'jwtttt');
      // TODO: finish verification
      return next();
      return next(new Error('authentication error'));
    });
  });

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
