// @flow
import { Schema, Model, Connection } from 'mongoose';
import type { AdminUser, AdminConfig } from './admin.type';

export const getAdminUserModel = (dbConnection: Connection): Model<AdminUser> => {
  const AdminUserSchema = new Schema({
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
    lastConnectionDate: Date
  });
  return dbConnection.model('AdminUser', AdminUserSchema);
};

export const getAdminConfigModel = (dbConnection: Connection): Model<AdminConfig> => {
  const AdminConfigSchema = new Schema({
    switchToUnavailableDelay: { type: Number, required: true, min: -1 }
  });
  return dbConnection.model('AdminConfig', AdminConfigSchema);
};
