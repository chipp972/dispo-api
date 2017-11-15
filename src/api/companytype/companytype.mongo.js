// @flow
import { Schema, Model, Connection } from 'mongoose';
import type { CompanyType } from './companytype.type';

export const getCompanyTypeModel = (dbConnection: Connection): Model<CompanyType> => {
  const CompanyTypeSchema = new Schema({
    name: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true
    }
  });
  return dbConnection.model('CompanyType', CompanyTypeSchema);
};
