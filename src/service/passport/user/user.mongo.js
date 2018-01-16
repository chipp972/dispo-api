// @flow
import { Schema, Model, Connection } from 'mongoose';
import { hashPassword } from './user.helper';
import type { User } from './user';

export const getUserModel = (dbConnection: Connection): Model => {
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

  const preSaveChecks = async function(next) {
    try {
      const user: User = this || {};
      console.log(user, 'user');
      // FIXME: only hash password if it is the first time
      // on update, hash user.newPassword and put it in password if it's not empty
      if (user.password) {
        const hash = await hashPassword(user.password);
        user.password = hash;
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };

  UserSchema.pre('save', preSaveChecks);
  UserSchema.pre('update', preSaveChecks);

  return dbConnection.model('User', UserSchema);
};
