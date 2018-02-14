// @flow
/* eslint no-invalid-this: 0 */
import { Document, Schema, Model, Connection } from 'mongoose';
import eventPlugin from 'mongoose-plugin-events';
import { InvalidUserError, InvalidCompanyError } from './popularity.error';

export type CompanyPopularityData = {
  companyId: string,
  userId: string,
  rating?: number,
};

export interface CompanyPopularity extends CompanyPopularityData, Document {
  _id: string;
}

type Options = {
  mongooseConnection: Connection,
  CompanyModel: Model,
  UserModel: Model,
};

export const getCompanyPopularityModel = ({
  mongooseConnection,
  CompanyModel,
  UserModel,
}: Options): Model => {
  const CompanyPopularitySchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
  });
  CompanyPopularitySchema.plugin(eventPlugin, {});

  // a user can rate a company only once
  CompanyPopularitySchema.index({ companyId: 1, userId: 1 }, { unique: true });

  const preSaveChecks = async function(next) {
    try {
      const { userId, companyId } = this || {};
      // check user id
      const user = await UserModel.findById(userId);
      if (!user) return next(new InvalidUserError(userId));
      // check company id
      const company = await CompanyModel.findById(companyId);
      if (!company) return next(new InvalidCompanyError(companyId));
      return next();
    } catch (err) {
      return next(err);
    }
  };

  CompanyPopularitySchema.pre('save', preSaveChecks);
  CompanyPopularitySchema.pre('update', preSaveChecks);

  return mongooseConnection.model('CompanyPopularity', CompanyPopularitySchema);
};
