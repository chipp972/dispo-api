// @flow
import { Logger, LoggerInstance, transports } from 'winston';
import { join } from 'path';
import winstonDailyRotateFile from 'winston-daily-rotate-file';
import env from './env';

export default function createLogger(file: string): LoggerInstance {
  const filepath = join(`${__dirname}/../${env.log.folder}/${file}.log`);
  const logger = new Logger({
    exitOnError: false,
    transports: [
      new transports.Console({
        colorize: false,
        handleExceptions: true,
        json: false,
        level: 'info'
      })
    ]
  });

  // second logger for all logs on files daily rotated
  logger.add(winstonDailyRotateFile, {
    colorize: false,
    filename: filepath,
    handleExceptions: true,
    json: false,
    level: 'silly',
    maxFiles: 10,
    maxsize: 100000000,
    prepend: true,
    prettyPrint: true,
    timestamp(): string {
      return new Date().toTimeString();
    }
  });

  // stream to pipe with morgan
  logger.morganStream = {
    write: (message): void => {
      logger.log('info', 'app', message);
    }
  };

  return logger;
}
