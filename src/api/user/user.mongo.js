// @flow
import { Schema, Model, Connection } from 'mongoose';
import type { User } from './user.type';

export const getUserModel = (dbConnection: Connection): Model<User> => {
  const UserSchema = new Schema({
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      trim: true,
      required: true
    },
    lastName: String,
    firstName: String,
    birthDate: Date,
    phoneNumber: String,
    address: String
  });

  return dbConnection.model('User', UserSchema);
};
