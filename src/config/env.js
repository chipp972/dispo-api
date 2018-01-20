// @flow
export default {
  debug: process.env.DEBUG === '1' || false,
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
    isAuthenticationActivated: process.env.IS_AUTHENTICATION_ACTIVATED
      ? process.env.IS_AUTHENTICATION_ACTIVATED === '1'
      : true,
    secretOrKey: process.env.AUTH_SECRET_OR_KEY || 'space_cat',
    sessionExpiration: parseInt(process.env.SESSION_EXPIRATION, 10) || 86400,
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 12,
    admin: {
      validDuration: parseInt(process.env.ADMIN_CODE_VALID_DURATION, 10) || 300,
      sessionExpiration:
        parseInt(process.env.ADMIN_SESSION_EXPIRATION, 10) || 2700
    }
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
    host: process.env.MAILGUN_SMTP_SERVER || '',
    port: process.env.MAILGUN_SMTP_PORT || '',
    user: process.env.MAILGUN_SMTP_LOGIN || '',
    pass: process.env.MAILGUN_SMTP_PASSWORD || ''
  },
  maxCompanyNumber: process.env.MAX_COMPANY_NB || 5,
  switchToUnavailableDelay:
    parseInt(process.env.SWITCH_TO_UNAVAILABLE, 10) || 900
};
