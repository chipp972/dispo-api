// @flow
import { Schema, Model, Connection } from 'mongoose';
import type { User } from './user.type';

export const UserSchema = new Schema({
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
  telephone: String,
  address: String
});

export const getUserModel = (dbConnection: Connection): Model<User> =>
  dbConnection.model('User', UserSchema);
