const Redis = require('ioredis');

const redisURL =
  process.env.NODE_ENV === 'production'
    ? process.env.REDIS_URl
    : {
        port: 6379,
        host: '127.0.0.1',
        family: 4,
        db: 0
      };

const redis = new Redis(redisURL);

redis.on('error', err => console.log(err))

export default redis;
