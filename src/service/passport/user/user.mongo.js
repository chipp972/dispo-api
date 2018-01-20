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
      if (user.__isNewPassword) {
        const hash = await hashPassword(user.password);
        user.password = hash;
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };

  UserSchema.path('password').set(function(newPassword) {
    if (newPassword) {
      this.__isNewPassword = true;
    }
    return newPassword || '';
  });

  UserSchema.pre('save', preSaveChecks);
  UserSchema.pre('update', preSaveChecks);

  return dbConnection.model('User', UserSchema);
};
