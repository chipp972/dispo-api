// @flow
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';

// connection
const options: Redis.RedisOptions =
  process.env.NODE_ENV === 'production'
    ? { host: process.env.REDIS_URL, db: 0, showFriendlyErrorStack: false }
    : {
      data: {
        'admin:user': {
          login: 'admin',
          password: 'password'
        },
        user_next: '3',
        emails: {
          'clark@daily.planet': '1',
          'bruce@wayne.enterprises': '2'
        },
        'user:1': {
          id: '1',
          username: 'superman',
          email: 'clark@daily.planet'
        },
        'user:2': {
          id: '2',
          username: 'batman',
          email: 'bruce@wayne.enterprises'
        }
      }
    };

const redis: Redis.Redis =
  process.env.NODE_ENV === 'production'
    ? new Redis(options)
    : new RedisMock(options);

// error handling
redis.on('error', (err: Redis.ReplyError) => console.log(err));

// init admin user and conf
redis.once('ready', () => {
  redis.hmget('admin:user', 'login', 'password').then((res: Redis.ResCallbackT) => {
    if (res.filter(value => value !== null).length < 2) {
      redis
        .hmset(
          'admin:user',
          'login',
          process.env.DEFAULT_ADMIN_LOGIN,
          'password',
          process.env.DEFAULT_ADMIN_PASSWORD
        )
        .then((res2: Redis.ResCallbackT) => console.log(res2));
    }
  });
});

export default redis;
