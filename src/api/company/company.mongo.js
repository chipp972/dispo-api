// @flow
import { emitEvents } from '../api.helper';
import { Model, Schema, Connection } from 'mongoose';
import { mapUtil } from '../../service/google/map.utils';
import { InvalidAddressError, InvalidCompanyTypeError } from './company.error';
import EventEmitter from 'events';
import type { Company } from './company';

export const getCompanyModel = (
  dbConnection: Connection,
  UserModel: Model,
  CompanyTypeModel: Model,
  allowEarlyRefresh: boolean = false,
  emitter: EventEmitter,
  events: CrudEvents
): Model => {
  const GeocodeSchema = new Schema(
    {
      latitude: { type: Number },
      longitude: { type: Number }
    },
    { _id: false }
  );

  const CompanySchema = new Schema(
    {
      owner: { type: Schema.Types.ObjectId, ref: 'User' },
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      },
      imageCloudId: String,
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
      available: { type: Boolean, default: false }
    },
    { timestamps: true }
  );

  const preSaveChecks = async function(next) {
    try {
      const company: Company = this || {};
      if (company.__earlyRefresh && !allowEarlyRefresh) {
        return next(new Error('cannot refresh availability now'));
      }
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

  CompanySchema.path('available').set(function(newAvailableValue) {
    if (newAvailableValue && this.available) {
      this.__earlyRefresh = true;
    }
    return newAvailableValue || false;
  });

  CompanySchema.pre('save', preSaveChecks);
  CompanySchema.pre('update', preSaveChecks);

  emitEvents({
    schema: CompanySchema,
    emitter,
    events
  });

  CompanySchema.post('save', async function(err, doc, next) {
    // TODO: reformat errors
    console.log(doc, 'whwhwhhwh');
    console.log(err.message, '********************');
    console.log('company.mongo');
    if (/type/.test(err.message)) {
      return next(new InvalidCompanyTypeError());
    } else if (/geometry/.test(err.message)) {
      return next(new InvalidAddressError());
    }
    return next(err);
  });

  return dbConnection.model('Company', CompanySchema);
};
