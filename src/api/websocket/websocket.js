// @flow
import io, { SocketIO } from 'socket.io';
import { Server } from 'http';
import {
  ModuleRegistry,
  getRegistrySingleton,
} from 'singleton-module-registry';

export const initWebsocketServer = (server: Server): SocketIO.Server => {
  const registry: ModuleRegistry = getRegistrySingleton();
  const { logger } = registry.getModules(['logger']);

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

  // client interactions
  ws.on('connection', (socket: SocketIO.Socket) => {
    const clientStr = `| client ${socket.id}`;
    logger.debug('connected', clientStr);

    socket.on('error', (err: Error) => logger.error(err, clientStr));
    socket.on('close', () => logger.debug('disconnected', clientStr));
  });

  return ws;
};
