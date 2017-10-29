// @flow
import Redis from 'ioredis';
import { LoggerInstance } from 'winston';

const keys = {
  user: 'admin:user',
  config: 'admin:config'
};

export async function getAdminConfig(redis: Redis.Redis, logger: LoggerInstance) {
  try {
    const adminConfig = await redis.hgetall(keys.config);
    // TODO: check type
    return adminConfig;
  } catch (err) {
    logger.log('error', 'getAdminConfig', err);
    throw err;
  }
}

export async function setAdminConfig(redis: Redis.Redis, logger: LoggerInstance) {
  try {
    // TODO: todo set
    const adminConfig = await redis.hmget(keys.config);
    return adminConfig;
  } catch (err) {
    logger.log('error', 'getAdminConfig', err);
    throw err;
  }
}
