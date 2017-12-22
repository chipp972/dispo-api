// @flow
import { Model, Schema, Connection } from 'mongoose';
import { mapUtil } from '../../service/google/map.utils';
import { WeekSchema } from '../schedule/schedule.mongo';
import type { Company } from './company';
import type { CompanyType } from '../companytype/companytype';
import type { User } from '../user/user';

export const getCompanyModel = (
  dbConnection: Connection,
  UserModel: Model<User>,
  CompanyTypeModel: Model<CompanyType>
): Model<Company> => {
  const GeocodeSchema = new Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  });

  const CompanySchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    imageUrl: String,
    type: { type: Schema.Types.ObjectId, ref: 'CompanyType' },
    siret: {
      type: String,
      unique: true,
      trim: true,
      maxlength: 14,
      minlength: 14,
      required: false
    },
    address: { type: String, required: true, trim: true },
    geoAddress: GeocodeSchema,
    phoneNumber: String,
    schedule: WeekSchema
  });

  // eslint-disable-next-line
  const preSaveChecks = async function(next) {
    try {
      const company: Company = this || {};
      // update geocode location
      const geoLocation = await mapUtil.getGeocode(company.address);
      company.geoAddress = geoLocation;
      // check owner
      const user = await UserModel.findById(company.owner);
      if (!user) return next(new Error('owner id is invalid'));
      // check company type
      const companytype = await CompanyTypeModel.findById(company.type);
      if (!companytype) return next(new Error('type id is invalid'));
      return next();
    } catch (err) {
      return next(err);
    }
  };

  CompanySchema.pre('save', preSaveChecks);
  CompanySchema.pre('update', preSaveChecks);

  return dbConnection.model('Company', CompanySchema);
};
