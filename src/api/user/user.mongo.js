// @flow
import { Document, Schema, Model, Connection } from 'mongoose';
import eventPlugin from 'mongoose-plugin-events';

export type UserData = {
  email: string,
  lastName?: string,
  firstName?: string,
  birthDate?: Date,
  phoneNumber?: string,
  address?: string,
};

export interface User extends UserData, Document {
  _id: string;
}

export const getUserModel = (mongooseConnection: Connection): Model<User> => {
  const UserSchema = new Schema({
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    lastName: String,
    firstName: String,
    birthDate: Date,
    phoneNumber: String,
    address: String,
  });
  UserSchema.plugin(eventPlugin, {});

  return mongooseConnection.model('User', UserSchema);
};
