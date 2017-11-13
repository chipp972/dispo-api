// @flow
import { Model, Schema, Connection } from 'mongoose';
import type { Company } from './company.type';

export const HourMinuteSchema = new Schema({
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

export const DaySchema = new Schema({
  start: HourMinuteSchema,
  end: HourMinuteSchema
});

export const WeekSchema = new Schema({
  monday: DaySchema,
  tuesday: DaySchema,
  wednesday: DaySchema,
  thursday: DaySchema,
  friday: DaySchema,
  saturday: DaySchema,
  sunday: DaySchema
});

export const CompanySchema = new Schema({
  // owner: { type: Schema.Types.ObjectId, ref: 'User' },
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
  phoneNumber: String,
  schedule: WeekSchema
});

export const getCompanyModel = (dbConnection: Connection): Model<Company> =>
  dbConnection.model('Company', CompanySchema);

/**
 * Operations
 */
