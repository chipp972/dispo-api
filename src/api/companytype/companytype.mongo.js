// @flow
import { Document, Schema, Model, Connection } from 'mongoose';
import eventPlugin from 'mongoose-plugin-events';

export interface CompanyTypeData {
  name: string;
}
export interface CompanyType extends CompanyTypeData, Document {
  _id: string;
}

export const getCompanyTypeModel = (
  mongooseConnection: Connection
): Model<CompanyType> => {
  const CompanyTypeSchema = new Schema({
    name: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
  });
  CompanyTypeSchema.plugin(eventPlugin, {});

  return mongooseConnection.model('CompanyType', CompanyTypeSchema);
};
