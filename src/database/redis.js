// @flow
import Redis from 'ioredis';
import RedisMock from 'ioredis-mock';

// connection
const options: Redis.RedisOptions =
  process.env.NODE_ENV === 'production'
    ? process.env.REDIS_URL
    : {
      data: {
        'admin:user': {
          login: 'admin',
          password: 'password',
          lastConnectionDate: ''
        },
        'admin:config': {
          sessionExpirationDelay: 0,
          switchToUnavailableDelay: 15,
        },
        'user:id': 1003,
        'company:id': 1,
        userById: {
          'user:1000': `{mail:'huhu.hihi@gmail.com'}`,
          'user:1001': `{mail:'haha@hoho>fr'}`,
        },
        companyById: {
          'company:0': `{name:'comp0'}`
        },
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
