// @flow
import Redis from 'ioredis';
import { LoggerInstance } from 'winston';
import dbKeys from '../database/keys';

const GET_ADMIN_CONFIG = 'GET_ADMIN_CONFIG';
const SET_ADMIN_CONFIG = 'SET_ADMIN_CONFIG';
const ADMIN_CONFIG_UPDATE = 'ADMIN_CONFIG_UPDATE';

export default function adminListeners(socket: any, database: Redis.Redis, logger: LoggerInstance) {
  socket.on(GET_ADMIN_CONFIG, async () => {
    const adminConfig = await database.hgetall(dbKeys.admin.user);
    logger.log('info', 'ADMIN GET REQUEST', adminConfig);
    // TODO: emit if no error
    socket.emit(ADMIN_CONFIG_UPDATE, adminConfig);
  });

  socket.on(SET_ADMIN_CONFIG, async (newConfig) => {
    const dbResponse = await database.set(dbKeys.admin.config, newConfig);
    logger.log('info', 'ADMIN SET REQUEST', dbResponse);
    // TODO: broadcast if no error
    socket.broadcast.emit(ADMIN_CONFIG_UPDATE, newConfig);
    socket.emit(ADMIN_CONFIG_UPDATE, newConfig);
  });
}
