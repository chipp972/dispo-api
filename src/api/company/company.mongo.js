// @flow
import { Model, Schema, Connection } from 'mongoose';
import { mapUtil } from '../../service/google/map.utils';
import type { Company } from './company';

export const getCompanyModel = (
  dbConnection: Connection,
  UserModel: Model,
  CompanyTypeModel: Model
): Model => {
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
    lastUpdate: Date // use this field to determine if company is available
  });

  const preSaveChecks = async function(next) {
    try {
      const company: Company = this || {};
      company.lastUpdate = new Date();
      // update geocode location
      const geoLocation = await mapUtil.getGeocode(company.address);
      company.geoAddress = geoLocation;
      // check owner
      const user = await UserModel.findById(company.owner);
      if (!user) return next(new Error('invalid company owner'));
      // check company type
      const companytype = await CompanyTypeModel.findById(company.type);
      if (!companytype) return next(new Error('invalid company type'));
      return next();
    } catch (err) {
      return next(err);
    }
  };

  CompanySchema.pre('save', preSaveChecks);
  CompanySchema.pre('update', preSaveChecks);

  return dbConnection.model('Company', CompanySchema);
};
