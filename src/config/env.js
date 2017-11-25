// @flow
export default {
  nodeEnv: process.env.NODE_ENV || 'development',
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
  auth: {
    secretOrKey: process.env.AUTH_SECRET_OR_KEY || 'space_cat',
    sessionExpiration: process.env.TOKEN_EXPIRATION || 86400,
    admin: {
      validDuration: process.env.ADMIN_CODE_VALID_DURATION || 300,
      sessionExpiration: process.env.ADMIN_TOKEN_EXPIRATION || 2700,
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
  mail: {
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: process.env.MAILGUN_DOMAIN || '',
    publicKey: process.env.MAILGUN_PUBLIC_KEY || '',
    login: process.env.MAILGUN_SMTP_LOGIN || '',
    password: process.env.MAILGUN_SMTP_PASSWORD || '',
    host: process.env.MAILGUN_SMTP_SERVER || '',
    port: process.env.MAILGUN_SMTP_PORT || ''
  },
  switchToUnavailableDelay: process.env.SWITCH_TO_UNAVAILABLE || 900
};
