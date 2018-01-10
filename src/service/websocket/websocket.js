// @flow
import EventEmitter from 'events';
import { Model } from 'mongoose';
import io, { SocketIO } from 'socket.io';
import { Server } from 'http';
import { EVENTS } from './websocket.event';
import LOGGER from '../../config/logger';
import { forEachObjIndexed } from 'ramda';

export type WebsocketOptions = {
  server: Server,
  apiEvents: EventEmitter,
  UserModel: Model,
  AdminUserModel: Model,
  CompanyModel: Model,
  CompanyTypeModel: Model,
  CompanyPopularityModel: Model
};

const addReadHandler = (model, modelName, socket) => {
  socket.on(EVENTS[modelName].read, async (filters: any) => {
    const resultList = await model.find(filters);
    socket.emit(EVENTS[modelName].read, resultList);
  });
};

export const initWebsocket = ({
  server,
  apiEvents,
  UserModel,
  AdminUserModel,
  CompanyModel,
  CompanyTypeModel,
  CompanyPopularityModel
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

    addReadHandler(CompanyModel, 'COMPANY', socket);
    addReadHandler(CompanyTypeModel, 'COMPANY_TYPE', socket);
    addReadHandler(CompanyPopularityModel, 'COMPANY_POPULARITY', socket);
    addReadHandler(UserModel, 'USER', socket);

    socket.on('error', (err: Error) => LOGGER.error(err));
    socket.on('close', () => LOGGER.info('client disconnected'));
  });

  return ws;
};
