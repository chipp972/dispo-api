// @flow
import { Schema, Model, Connection } from 'mongoose';
import type { CompanyPopularity } from './companypopularity';

export const getCompanyPopularityModel = (
  dbConnection: Connection,
  CompanyModel: Model,
  UserModel: Model
): Model => {
  const CompanyPopularitySchema = new Schema({
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: Number
  });

  // a user can rate a company only once
  CompanyPopularitySchema.index({ companyId: 1, userId: 1 }, { unique: true });

  const preSaveChecks = async function(next) {
    try {
      const companyPopularity: CompanyPopularity = this || {};
      // check user id
      const user = await UserModel.findById(companyPopularity.userId);
      if (!user) return next(new Error('invalid user'));
      // check company id
      const company = await CompanyModel.findById(companyPopularity.companyId);
      if (!company) return next(new Error('invalid company'));
      return next();
    } catch (err) {
      return next(err);
    }
  };

  CompanyPopularitySchema.pre('save', preSaveChecks);
  CompanyPopularitySchema.pre('update', preSaveChecks);

  return dbConnection.model('CompanyPopularity', CompanyPopularitySchema);
};
