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
    apiEvents.on(event, (data: any) => {
      LOGGER.debug(event, JSON.stringify(data));
      ws.emit(event, data);
    });
  };

  const addReadHandler = (model, modelName, socket) => {
    socket.on(EVENTS[modelName].read, async (filters: any) => {
      const resultList = await model.find(filters);
      LOGGER.debug(EVENTS[modelName].read, resultList);
      socket.emit(EVENTS[modelName].read, resultList);
    });
  };

  // emit events to clients when apiEvent emit something
  forEachObjIndexed(emitEvent, EVENTS.USER);
  forEachObjIndexed(emitEvent, EVENTS.COMPANY);
  forEachObjIndexed(emitEvent, EVENTS.COMPANY_TYPE);
  forEachObjIndexed(emitEvent, EVENTS.COMPANY_POPULARITY);

  // client interactions
  ws.on('connection', (socket: SocketIO.Socket) => {
    const clientStr = `| client ${socket.id}`;
    LOGGER.debug('connected', clientStr);

    addReadHandler(CompanyModel, 'COMPANY', socket);
    addReadHandler(CompanyTypeModel, 'COMPANY_TYPE', socket);
    addReadHandler(CompanyPopularityModel, 'COMPANY_POPULARITY', socket);
    addReadHandler(UserModel, 'USER', socket);

    socket.on('error', (err: Error) => LOGGER.error(err, clientStr));
    socket.on('close', () => LOGGER.debug('disconnected', clientStr));
  });

  return ws;
};
