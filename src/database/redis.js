// @flow
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';
import redisMockObject from './mock';
import createLogger from '../logger';
import env from '../env';

export default function initRedis(): Redis.Redis {
  // logger
  const logger = createLogger(env.log.file.database);

  // connection
  const redis: Redis.Redis =
    process.env.NODE_ENV === 'production'
      ? new Redis(process.env.REDIS_URL)
      : new RedisMock(redisMockObject);

  // error handling
  redis.on('error', (err: Redis.ReplyError) =>
    logger.log('error', 'redis', err));

  // init admin user and conf
  redis.once('ready', () => {
    logger.log('info', 'redis', 'ready');
    redis
      .hmget('admin:user', 'login', 'password')
      .then((res: Redis.ResCallbackT) => {
        if (res.filter(value => value !== null).length < 2) {
          redis
            .hmset(
              'admin:user',
              'login',
              process.env.DEFAULT_ADMIN_LOGIN,
              'password',
              process.env.DEFAULT_ADMIN_PASSWORD
            )
            .then((res2: Redis.ResCallbackT) =>
              logger.log('info', `admin user creation: ${res2}`));
        } else {
          logger.log('info', 'admin user already exists');
        }
      });
  });

  return redis;
}
