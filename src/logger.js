// @flow
import { Logger, LoggerInstance, transports } from 'winston'
import { join } from 'path'
import { mkdir } from 'fs-nextra'

export async function getLogger (file: string): LoggerInstance {
  let filepath = join(__dirname, `../../log/${file}`)
  await mkdir(filename)

  let logger = new Logger({
    exitOnError: false,
    transports: [
      new transports.Console({
        colorize: true,
        handleExceptions: true,
        json: false,
        level: 'error'
      })
    ]
  })

  // second logger for all logs on files daily rotated
  logger.add(require('winston-daily-rotate-file'), {
    colorize: false,
    filename: filepath,
    handleExceptions: true,
    json: false,
    level: 'silly',
    maxFiles: 10,
    maxsize: 100000000,
    prepend: true,
    prettyPrint: true,
    timestamp: function (): string { return (new Date()).toTimeString() }
  })

  // stream to pipe with morgan
  logger['morganStream'] = {
    write: (message): void => {
      logger.info(message)
    }
  }

  return logger
}
