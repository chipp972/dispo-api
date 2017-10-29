// @flow
import Redis from 'ioredis';
import { LoggerInstance } from 'winston';
import { getAdminConfig, setAdminConfig } from './admin.db';

const channelName = 'admin';
const action = {
  getConfig: 'getConfig',
  setConfig: 'setConfig',
  configUpdate: 'configUpdate'
};

export const adminChannel = (
  socket: any,
  logger: LoggerInstance,
  database: Redis.Redis
) => {
  // join the channel
  socket.join(channelName);

  // action handlers
  socket.on(action.getConfig, async () => {
    try {
      const adminConfig = await getAdminConfig(database, logger);
      logger.log('info', 'ADMIN GET REQUEST', adminConfig);
      socket.in(channelName).emit(action.configUpdate, adminConfig);
    } catch (err) {
      logger.log('error', 'ADMIN GET REQUEST', err);
    }
  });

  socket.on(action.setConfig, async (newConfig) => {
    try {
      const res = await setAdminConfig(database, logger);
      socket.in(channelName).emit('result', res);
      socket.in(channelName).broadcast.emit(action.configUpdate, newConfig);
    } catch (err) {
      logger.log('error', action.setConfig, err);
      socket.in(channelName).emit('error', err);
    }
  });
};
