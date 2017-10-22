// @flow

export default {
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
  defaultAdminLogin: process.env.DEFAULT_ADMIN_LOGIN || 'admin',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'password123'
};
