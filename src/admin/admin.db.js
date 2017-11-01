// @flow
import Redis from 'ioredis';
import type { AdminConfig } from './admin.type';

const redisKeys = {
  user: 'admin:user',
  config: 'admin:config'
};

/**
 * Retrieve the admin config
 */
export async function getAdminConfig(redis: Redis.Redis): Promise<AdminConfig> {
  try {
    const adminConfig = await redis.hgetall(redisKeys.config);
    // TODO: check type
    return adminConfig;
  } catch (err) {
    throw new Error(`getAdminConfig: ${err}`);
  }
}

/**
 * Set admin config in mongo database and redis database
 */
export async function setAdminConfig(redis: Redis.Redis): Promise<AdminConfig> {
  try {
    // TODO: todo set
    const adminConfig = await redis.hmget(redisKeys.config);
    return adminConfig;
  } catch (err) {
    throw new Error(`setAdminConfig: ${err}`);
  }
}
