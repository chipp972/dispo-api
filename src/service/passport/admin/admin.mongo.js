// @flow
import { Schema, Model, Connection } from 'mongoose';

export const getAdminModel = (dbConnection: Connection): Model => {
  const AdminUserSchema: Schema = new Schema({
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true
    },
    code: {
      type: String,
      trim: true,
      required: true
    },
    role: { type: String, default: 'admin' },
    createdAt: { type: Date, default: Date.now() },
    expireAt: { type: Date, default: undefined }
  });
  return dbConnection.model('AdminUser', AdminUserSchema);
};
