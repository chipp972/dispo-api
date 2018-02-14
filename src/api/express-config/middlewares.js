// @flow
import helmet from 'helmet';
import formData from 'express-form-data';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import { getRegistrySingleton } from 'singleton-module-registry';

/**
 * add basic middlewares to express app:
 * - helmet
 * - body parser (json, formData)
 * - logger
 * - cors
 *
 * @param {ModuleRegistry} registry
 * @return {void}
 */
export const applyMiddlewares = (): void => {
  const registry = getRegistrySingleton();
  const { env, app } = registry.getModules(['env', 'app']);
  const isProd = env.nodeEnv === 'production';

  /* config and logger init */
  const logmode = isProd ? 'combined' : 'short';

  // security
  app.use(helmet());

  // logs
  if (!isProd) app.use(morgan('dev'));
  app.use(morgan(logmode));

  // multi-part form data
  app.use(formData.parse({ autoFiles: true }));
  app.use(formData.format());
  app.use(formData.stream());
  app.use(formData.union());

  // json body
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // cors
  const corsOptions: CorsOptions = {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 204,
  };
  app.options('*', cors(corsOptions));
  app.use(cors(corsOptions));
};
