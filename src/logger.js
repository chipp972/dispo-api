// @flow
import { Logger, LoggerInstance, transports } from 'winston';
import env from './config/env';

const logger: LoggerInstance = new Logger({
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

export default function getLogger(): LoggerInstance {
  return logger;
}
