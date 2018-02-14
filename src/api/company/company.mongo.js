// @flow
/* eslint no-invalid-this: 0 */
import { Document, Model, Schema, Connection } from 'mongoose';
import eventPlugin from 'mongoose-plugin-events';
import {
  ForbiddenEarlyRefreshError,
  InvalidAddressError,
  InvalidCompanyTypeError,
  InvalidOwnerError,
} from './company.error';

export type CompanyData = {
  owner: string,
  name: string,
  type: string,
  siret?: string,
  imageUrl?: string,
  imageCloudId?: string,
  address: string,
  phoneNumber?: string,
};

export interface Company extends CompanyData, Document {
  _id: string;
  geoAddress: { latitude: number, longitude: number };
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type Options = {
  mongooseConnection: Connection,
  UserModel: Model,
  CompanyTypeModel: Model,
  allowEarlyRefresh: boolean,
  getGeocode: (address: string) => { latitude: number, longitude: number },
  deleteImage: ({ publicId: string }) => Promise<any>,
};

export const getCompanyModel = ({
  mongooseConnection,
  UserModel,
  CompanyTypeModel,
  allowEarlyRefresh = false,
  getGeocode,
  deleteImage,
}: Options): Model<Company> => {
  const CompanySchema = new Schema(
    {
      owner: { type: Schema.Types.ObjectId, ref: 'User' },
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
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
        required: false,
      },
      address: { type: String, required: true, trim: true },
      geoAddress: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
      phoneNumber: String,
      available: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  CompanySchema.plugin(eventPlugin, {});

  const preSaveChecks = async function(next) {
    try {
      const company: Company = this || {};
      this.__isNew = this.isNew;
      if (company.__earlyRefresh && !allowEarlyRefresh) {
        throw new ForbiddenEarlyRefreshError();
      }
      // update geocode location
      try {
        const geoLocation = await getGeocode(company.address);
        company.geoAddress = geoLocation;
      } catch (err) {
        throw new InvalidAddressError();
      }
      // check owner
      const user = await UserModel.findById(company.owner);
      if (!user) throw new InvalidOwnerError();
      // check company type
      const companytype = await CompanyTypeModel.findById(company.type);
      if (!companytype) throw new InvalidCompanyTypeError();
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

  CompanySchema.post('save', async function(err, doc, next) {
    if (this.__isNew && this.imageCloudId) {
      await deleteImage({ publicId: this.imageCloudId });
    }
    next(err);
  });

  const CompanyModel = mongooseConnection.model('Company', CompanySchema);

  return CompanyModel;
};
