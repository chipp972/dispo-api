// @flow
import { Mockgoose } from 'mockgoose';
import mongoose, { ConnectionOptions, Connection } from 'mongoose';

export const initMockgoose = async (
  uri: string,
  options?: ConnectionOptions
): Promise<Connection> => {
  const mockgoose: Mockgoose = new Mockgoose(mongoose);
  await mockgoose.prepareStorage();
  const mockDb: Connection = await mongoose.createConnection(uri, options);
  return mockDb;
};
