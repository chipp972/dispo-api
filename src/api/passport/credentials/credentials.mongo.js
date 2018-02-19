// @flow
/* eslint no-invalid-this: 0 */
import { Document, Schema, Model, Connection } from 'mongoose';
import { hashPassword, isValidPassword } from './credentials.helper';
import { createNewInvalidOldPasswordError } from './credentials.error';

export type Credentials = {
  email: string,
  password: string,
  oldPassword?: string,
  role: string,
};

type Options = {
  mongooseConnection: Connection,
  saltRounds: number,
};

export const getCredentialsModel = ({
  mongooseConnection,
  saltRounds,
}: Options): Model<Credentials> => {
  const CredentialsSchema = new Schema({
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    oldPassword: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  });

  const preSaveChecks = async function(next) {
    try {
      const credentials: Document = this || {};
      if (!credentials.isNew) {
        const isValid = await isValidPassword(
          credentials.originalHash,
          credentials.oldPassword
        );
        if (!isValid) {
          return next(createNewInvalidOldPasswordError());
        }
      }
      if (credentials.isNew || credentials.isModified('password')) {
        const hash = await hashPassword(credentials.password, saltRounds);
        credentials.password = hash;
      }
      delete credentials.oldPassword;
      return next();
    } catch (err) {
      return next(err);
    }
  };

  CredentialsSchema.path('password').set(function(newPassword: string) {
    this.originalHash = this.password;
    return newPassword;
  });

  CredentialsSchema.pre('save', preSaveChecks);
  CredentialsSchema.pre('update', preSaveChecks);

  return mongooseConnection.model('Credentials', CredentialsSchema);
};
