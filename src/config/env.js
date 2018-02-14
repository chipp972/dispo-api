// @flow
type EnvObject = {
  [key: string]: any,
  debug: boolean,
  nodeEnv: string,
  database: {
    redisUrl: string,
    mongodbUri: string,
    mongoPoolSize: number,
  },
  port: {
    default: number,
    http: number,
    https: number,
  },
  auth: {
    isAuthenticationActivated: boolean,
    secretOrKey: string,
    tokenExpiration: number,
    saltRounds: number,
    admin: {
      validDuration: number,
      tokenExpiration: number,
    },
  },
  google: {
    apiKey: string,
    clientId: string,
    clientSecret: string,
  },
  mail: {
    apiKey: string,
    domain: string,
    publicKey: string,
    host: string,
    port: string,
    user: string,
    pass: string,
  },
  maxCompanyNumber: number,
  switchToUnavailableDelay: number,
  allowEarlyRefresh: boolean,
};

export const env: EnvObject = {
  debug: process.env.DEBUG === '1' || false,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379/',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost/test',
    mongoPoolSize: parseInt(process.env.MONGO_POOL_SIZE, 10) || 5,
  },
  port: {
    default: parseInt(process.env.PORT, 10) || 5000,
    http: parseInt(process.env.HTTP, 10) || 80,
    https: parseInt(process.env.HTTPS_PORT, 10) || 443,
  },
  auth: {
    isAuthenticationActivated: process.env.IS_AUTHENTICATION_ACTIVATED
      ? process.env.IS_AUTHENTICATION_ACTIVATED === '1'
      : true,
    secretOrKey: process.env.AUTH_SECRET_OR_KEY || 'space_cat',
    tokenExpiration: parseInt(process.env.TOKEN_EXPIRATION, 10) || 86400,
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10) || 12,
    admin: {
      validDuration: parseInt(process.env.ADMIN_CODE_VALID_DURATION, 10) || 300,
      tokenExpiration: parseInt(process.env.ADMIN_TOKEN_EXPIRATION, 10) || 2700,
    },
  },
  google: {
    apiKey: process.env.GOOGLE_API_KEY || '',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  mail: {
    apiKey: process.env.MAILGUN_API_KEY || '',
    domain: process.env.MAILGUN_DOMAIN || '',
    publicKey: process.env.MAILGUN_PUBLIC_KEY || '',
    host: process.env.MAILGUN_SMTP_SERVER || '',
    port: process.env.MAILGUN_SMTP_PORT || '',
    user: process.env.MAILGUN_SMTP_LOGIN || '',
    pass: process.env.MAILGUN_SMTP_PASSWORD || '',
  },
  maxCompanyNumber: parseInt(process.env.MAX_COMPANY_NB, 10) || 5,
  switchToUnavailableDelay:
    parseInt(process.env.SWITCH_TO_UNAVAILABLE, 10) || 900,
  allowEarlyRefresh:
    process.env.ALLOW_EARLY_AVAILABILITY_REFRESH === '1' || false,
};
