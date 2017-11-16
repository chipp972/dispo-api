// @flow
import { Model, Schema, Connection } from 'mongoose';
import { mapUtil } from '../../config/map/map.utils';
import type { Company } from './company.type';
import type { CompanyType } from '../companytype/companytype.type';
import type { User } from '../user/user.type';

export const getCompanyModel = (
  dbConnection: Connection,
  UserModel: Model<User>,
  CompanyTypeModel: Model<CompanyType>
): Model<Company> => {
  const HourMinuteSchema = new Schema({
    hours: {
      type: Number,
      default: 0,
      max: 23,
      min: 0
    },
    minutes: {
      type: Number,
      default: 0,
      max: 59,
      min: 0
    }
  });

  const DaySchema = new Schema({
    start: HourMinuteSchema,
    end: HourMinuteSchema
  });

  const WeekSchema = new Schema({
    monday: DaySchema,
    tuesday: DaySchema,
    wednesday: DaySchema,
    thursday: DaySchema,
    friday: DaySchema,
    saturday: DaySchema,
    sunday: DaySchema
  });

  const GeocodeSchema = new Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  });

  const CompanySchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    // manager: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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

  // update geocode location
  // eslint-disable-next-line
  CompanySchema.pre('save', true, async function(next, done) {
    try {
      const geoLocation = await mapUtil.getGeocode(this.address);
      this.geoAddress = geoLocation;
      const user = await UserModel.findById(this.owner);
      if (!user) return next(new Error('owner id is invalid'));
      const companytype = await CompanyTypeModel.findById(this.type);
      if (!companytype) return next(new Error('type id is invalid'));
      return done();
    } catch (err) {
      return next(err);
    }
  });

  // eslint-disable-next-line
  CompanySchema.pre('update', true, function(next, done) {
    mapUtil
      .getGeocode(this.address)
      .then((geoLocation) => {
        this.geoAddress = geoLocation;
        return done();
      })
      .catch(err => next(err));
  });

  return dbConnection.model('Company', CompanySchema);
};
