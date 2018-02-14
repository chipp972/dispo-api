// @flow
import mongoose, { ConnectionOptions, Connection } from 'mongoose';
import LOGGER from '../../config/logger';
import { env } from '../../config/env';
import { initMockgoose } from './mockgoose';

export const initMongoose = async (): Promise<Connection> => {
  (mongoose: any).Promise = global.Promise;
  const isProd = env.nodeEnv === 'production';

  mongoose.set('debug', env.debug);

  const options: ConnectionOptions = {
    autoIndex: !isProd,
    promiseLibrary: global.Promise,
    poolSize: env.database.mongoPoolSize,
    autoReconnect: isProd,
  };

  try {
    const db: Connection = await mongoose.createConnection(
      env.database.mongodbUri,
      options
    );
    return db;
  } catch (err) {
    if (env.nodeEnv === 'production') {
      LOGGER.error(err, 'mongoose connexion');
      throw err;
    }
    // Use mockgoose to mock the data store
    try {
      LOGGER.debug('Using Mockgoose');
      const mockedDb = await initMockgoose(env.database.mongodbUri, options);
      return mockedDb;
    } catch (err) {
      LOGGER.error(err);
    }
  }
};
