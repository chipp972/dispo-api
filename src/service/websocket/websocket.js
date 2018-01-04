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

  const emitEvent = (event: string, key: string) => {
    apiEvents.on(event, (data: any) => ws.emit(event, data));
  };

  // emit events to clients when apiEvent emit something
  forEachObjIndexed(emitEvent, EVENTS.USER);
  forEachObjIndexed(emitEvent, EVENTS.COMPANY);
  forEachObjIndexed(emitEvent, EVENTS.COMPANY_TYPE);
  forEachObjIndexed(emitEvent, EVENTS.COMPANY_POPULARITY);

  // client interactions
  ws.on('connection', (socket: SocketIO.Socket) => {
    LOGGER.info('client connected');

    socket.on('error', (err: Error) => LOGGER.error(err));
    socket.on('close', () => LOGGER.info('client disconnected'));
  });

  return ws;
};
