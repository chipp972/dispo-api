// @flow
import mongoose, { ConnectionOptions, Connection } from 'mongoose';
import { Mockgoose } from 'mockgoose';
import LOGGER from '../../config/logger';
import env from '../../config/env';

export const initMongoose = async (): Promise<Connection> => {
  (mongoose: any).Promise = global.Promise;
  const isProd = env.nodeEnv === 'production';

  mongoose.set('debug', env.debug);

  const options: ConnectionOptions = {
    autoIndex: !isProd,
    promiseLibrary: global.Promise,
    poolSize: env.database.mongoPoolSize,
    autoReconnect: isProd
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
    try {
      // Use mockgoose to mock the data store
      LOGGER.debug('Using Mockgoose');
      const mockgoose: Mockgoose = new Mockgoose(mongoose);
      await mockgoose.prepareStorage();
      const mockDb: Connection = await mongoose.createConnection(
        env.database.mongodbUri,
        options
      );
      return mockDb;
    } catch (error) {
      LOGGER.error(error);
      throw error;
    }
  }
};
