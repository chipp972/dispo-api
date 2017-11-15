// @flow
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';
import { LoggerInstance } from 'winston';
import redisMockObject from './redis.mock';
import env from '../env';

export default async function initRedis(logger: LoggerInstance): Promise<Redis.Redis> {
  // connection
  const redis: Redis.Redis =
    env.nodeEnv === 'production'
      ? new Redis(env.database.redisUrl)
      : new Redis(env.database.redisUrl, {
        retryStrategy: () => false
      });

  return new Promise((resolve, reject) => {
    // error handling
    redis.on('error', (err: Redis.ReplyError) => {
      if (env.nodeEnv === 'production') reject(err);
      logger.log('info', 'using redis mock');
      resolve(new RedisMock(redisMockObject));
    });

    // init redis store
    redis.once('ready', async () => {
      resolve(redis);
    });
  });
}
