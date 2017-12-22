// @flow
import mongoose, { ConnectionOptions, Connection } from 'mongoose';
import { Mockgoose } from 'mockgoose';
import { LoggerInstance } from 'winston';
import env from '../../config/env';

export default async function initMongoose(
  logger: LoggerInstance
): Promise<Connection> {
  (mongoose: any).Promise = global.Promise;

  const options: ConnectionOptions = {
    useMongoClient: true,
    autoIndex: env.nodeEnv === 'development',
    promiseLibrary: global.Promise,
    poolSize: env.database.mongoPoolSize,
    autoReconnect: env.nodeEnv === 'production'
  };

  return new Promise((resolve, reject) => {
    // try to create a connection object
    mongoose
      .createConnection(env.database.mongodbUri, options)
      .then(db => resolve(db))
      .catch((err: Error) => {
        if (env.nodeEnv === 'production') {
          reject(new Error(`mongoose connection ${err.message}`));
        }
        // Use mockgoose to mock the data store
        const mockgoose: Mockgoose = new Mockgoose(mongoose);
        mockgoose.prepareStorage().then(() => {
          logger.log('Using Mockgoose');
          mongoose
            .createConnection(env.database.mongodbUri, options)
            .then(db => resolve(db))
            .catch((err2: Error) =>
              reject(new Error(`mockgoose connection ${err2.message}`))
            );
        });
      });
  });
}
