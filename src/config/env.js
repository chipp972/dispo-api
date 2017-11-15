// @flow

export default {
  database: {
    redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379/',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost/test',
    mongoPoolSize: process.env.MONGO_POOL_SIZE || 5
  },
  port: {
    default: process.env.PORT || 5000,
    http: process.env.HTTP || 80,
    https: process.env.HTTPS_PORT || 443
  },
  nodeEnv: process.env.NODE_ENV || 'development',
  log: {
    folder: process.env.LOG_FOLDER || 'logs',
    file: {
      server: process.env.LOGFILE_SERVER || 'server',
      database: process.env.LOGFILE_DATABASE || 'redis',
      websocket: process.env.LOGFILE_WEBSOCKET || 'websocket'
    }
  },
  queue: {
    concurrency: process.env.QUEUE_CONCURRENCY || 1
  },
  google: {
    apiKey: process.env.GOOGLE_API_KEY,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  defaultAdminLogin: process.env.DEFAULT_ADMIN_LOGIN || 'admin',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'password123',
  sessionExpiration: process.env.SESSION_EXPIRATION || 86400
};
