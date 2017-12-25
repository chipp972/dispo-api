// @flow
import { Logger, LoggerInstance, transports } from 'winston';
import env from './env';

const LOGGER: LoggerInstance = new Logger({
  exitOnError: true,
  transports: [
    new transports.Console({
      colorize: env.nodeEnv === 'development',
      handleExceptions: true,
      json: false,
      level: 'info'
    })
  ]
});

export default LOGGER;
