// @flow
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';
import { LoggerInstance } from 'winston';
import redisMockObject from './redis.mock';
import env from '../config/env';

export default async function initRedis(logger: LoggerInstance): Promise<Redis.Redis> {
  // connection
  const redis: Redis.Redis =
    env.nodeEnv === 'production'
      ? new Redis(process.env.REDIS_URL)
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

    // init admin user and conf
    redis.once('ready', async () => {
      logger.log('info', 'redis', 'ready');
      const res: Redis.ResCallbackT = await redis.hmget(
        'admin:user',
        'login',
        'password'
      );
      if (res.filter(value => value !== null).length < 2) {
        const res2: Redis.ResCallbackT = await redis.hmset(
          'admin:user',
          'login',
          process.env.DEFAULT_ADMIN_LOGIN,
          'password',
          process.env.DEFAULT_ADMIN_PASSWORD
        );
        logger.log('info', `admin user creation: ${res2}`);
      } else {
        logger.log('info', 'admin user already exists');
      }
      resolve(redis);
    });
  });
}
