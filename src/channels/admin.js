// @flow
import Redis from 'ioredis';
import { LoggerInstance } from 'winston';
import { keys, channels, actions } from '../database/constants';
import { getAdminConfig, setAdminConfig } from '../database/admin';

export default function adminListeners(
  socket: any,
  database: Redis.Redis,
  logger: LoggerInstance
) {
  // join the channel
  socket.join(channels.admin);

  // action handlers
  socket.on(actions.admin.getConfig, async () => {
    try {
      const adminConfig = await getAdminConfig(database, logger);
      logger.log('info', 'ADMIN GET REQUEST', adminConfig);
      socket.in(channels.admin).emit(actions.admin.update, adminConfig);
    } catch (err) {
      logger.log('error', 'ADMIN GET REQUEST', err);
    }
  });

  socket.on(actions.admin.setConfig, async (newConfig) => {
    const res2 = await database.set(keys.admin.config, newConfig);
    if (res2 === 'OK') {
      socket.in(channels.admin).emit(actions.admin.update, newConfig);
      socket.in(channels.admin).broadcast.emit(actions.admin.update, newConfig);
    } else {
      logger.log('error', 'ADMIN SET REQUEST', res2);
      socket.in(channels.admin).emit(actions.admin.update, newConfig);
    }
  });
}
