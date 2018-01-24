// @flow
import { emitEvents } from '../../../api/api.helper';
import { Schema, Model, Connection } from 'mongoose';
import { hashPassword } from './user.helper';
import EventEmitter from 'events';
import type { User } from './user';

export const getUserModel = (
  dbConnection: Connection,
  emitter: EventEmitter,
  events: CrudEvents
): Model => {
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

  UserSchema.set('toObject', {
    transform: function(doc, ret, options) {
      delete ret.password;
      return ret;
    }
  });

  const preSaveChecks = async function(next) {
    try {
      const user: User = this || {};
      if (user.isModified('password')) {
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

  emitEvents({
    schema: UserSchema,
    emitter,
    events
  });

  return dbConnection.model('User', UserSchema);
};
