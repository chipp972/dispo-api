import express from 'express'
import {getServerConfig} from './config'
import {getLogger} from './lib/logger'
import {initDatabase} from './model'
import {generateRoutes} from './route'
import helmet from 'helmet'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import passport from 'passport'
import {configurePassport} from './auth'

/**
 * Initialize the application with the database
 * @return {Promise<any>} The express app initialized
 */
export const initAppAndDatabase = async function (): Promise<any> {
  try {
    /* config and logger init */
    const mode = process.env.NODE_ENV || 'development'
    const logmode = mode === 'production' ? 'combined' : 'short'

    const config = await getServerConfig(mode)
    const logger = getLogger(config.logfile)

    try {
      // database and app init
      const app = express()
      const database = await initDatabase()

      /* express middlewares */

      // security
      app.use(helmet())

      // authentication
      app.use(passport.initialize())
      configurePassport(database, passport)

      // logs
      if (mode === 'development') { app.use(morgan('dev')) }
      app.use(morgan(logmode, { 'stream': logger['morganStream'] }))

      // requests
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))

      /* routes */
      app.use(generateRoutes(database, logger))

      /* handlers */
      // database disconnection and SIGINT handlers
      database.connection.once('disconnected', () => {
        logger.info('server is down')
        process.exit(0)
      })
      process.once('SIGINT', () => {
        logger.info('Server is down')
        database.connection.close(() => {
          process.exit(0)
        })
      })

      // request error handler
      app.use((err, req, res, next) => {
        let stack: string
        mode === 'development' ? stack = err.stack : stack = ''

        return res.status(err['status'] || 500).json({
          message: err.message,
          stack: stack,
          success: false
        })
      })

      return {
        app: app,
        database: database,
        logger: logger
      }
    } catch (err) {
      logger.error(err)
      throw err
    }

  } catch (err) {
    console.log(err)
    throw err
  }
}
