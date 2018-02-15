// @flow
import io, { SocketIO } from 'socket.io';
import { Model } from 'mongoose';
import { Server } from 'http';
import {
  ModuleRegistry,
  getRegistrySingleton,
} from 'singleton-module-registry';

export const initWebsocketServer = (server: Server): SocketIO.Server => {
  const registry: ModuleRegistry = getRegistrySingleton();
  const {
    logger,
    user,
    company,
    companyType,
    companyPopularity,
  } = registry.getModules([
    'logger',
    'user',
    'company',
    'companyType',
    'companyPopularity',
  ]);

  const ws: SocketIO.Server = io(server);

  const emitEvent = (event: string) => {
    registry.on(event, (data: any) => {
      logger.debug(event, JSON.stringify(data));
      ws.emit(event, data);
    });
  };

  // emit events to clients when registry emit something
  ['user', 'company', 'companyType', 'companyPopularity'].forEach(
    (model: string) => {
      ['created', 'updated', 'removed'].forEach((operation: string) => {
        emitEvent(`${model}:${operation}`);
      });
    }
  );

  const addReadHandler = (
    model: Model,
    modelName: string,
    socket: SocketIO.Socket
  ) => {
    const event = `READ_${modelName}`;
    socket.on(event, async (filters: any) => {
      const resultList = await model.find(filters);
      logger.debug(event, resultList);
      socket.emit(event, resultList);
    });
  };

  // client interactions
  ws.on('connection', (socket: SocketIO.Socket) => {
    const clientStr = `| client ${socket.id}`;
    logger.debug('connected', clientStr);

    addReadHandler(company.model, 'COMPANY', socket);
    addReadHandler(companyType.model, 'COMPANYTYPE', socket);
    addReadHandler(companyPopularity.model, 'COMPANYPOPULARITY', socket);
    addReadHandler(user.model, 'USER', socket);

    socket.on('error', (err: Error) => logger.error(err, clientStr));
    socket.on('close', () => logger.debug('disconnected', clientStr));
  });

  return ws;
};
