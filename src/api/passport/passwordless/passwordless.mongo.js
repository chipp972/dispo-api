// @flow
import { Schema, Model, Connection } from 'mongoose';

export type PasswordLessData = {
  email: string,
  code: string,
  role?: string,
};

export interface PasswordLessCredentials extends PasswordLessData {
  _id: string;
  expireAt?: Date;
  createAt: Date;
  updatedAt: Date;
}

export const getPasswordLessCredentialsModel = (
  mongooseConnection: Connection
): Model => {
  const PasswordLessCredentialsSchema: Schema = new Schema(
    {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
      },
      code: {
        type: String,
        trim: true,
        required: true,
      },
      role: { type: String, enum: ['user', 'admin'], default: 'admin' },
      expireAt: { type: Date, default: undefined },
    },
    { timestamps: true }
  );

  return mongooseConnection.model(
    'PasswordLessCredentials',
    PasswordLessCredentialsSchema
  );
};
