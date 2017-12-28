// @flow
import mongoose, { ConnectionOptions, Connection } from 'mongoose';
import { Mockgoose } from 'mockgoose';
import LOGGER from '../../config/logger';
import env from '../../config/env';

export const initMongoose = async (): Promise<Connection> => {
  (mongoose: any).Promise = global.Promise;
  const isProd = env.nodeEnv === 'production';

  const options: ConnectionOptions = {
    useMongoClient: true,
    autoIndex: !isProd,
    promiseLibrary: global.Promise,
    poolSize: env.database.mongoPoolSize,
    autoReconnect: isProd
  };

  return new Promise((resolve, reject) => {
    // try to create a connection object
    mongoose
      .createConnection(env.database.mongodbUri, options)
      .then((db: Connection) => resolve(db))
      .catch((err: Error) => {
        if (env.nodeEnv === 'production') {
          reject(new Error(`mongoose connection ${err.message}`));
        }
        // Use mockgoose to mock the data store
        const mockgoose: Mockgoose = new Mockgoose(mongoose);
        mockgoose.prepareStorage().then(() => {
          LOGGER.log('Using Mockgoose');
          mongoose
            .createConnection(env.database.mongodbUri, options)
            .then((db: Connection) => resolve(db))
            .catch((err2: Error) =>
              reject(new Error(`mockgoose connection ${err2.message}`))
            );
        });
      });
  });
};
