// @flow
import { emitEvents } from '../api.helper';
import { Schema, Model, Connection } from 'mongoose';
import EventEmitter from 'events';
import type { CompanyType } from './companytype';

export const getCompanyTypeModel = (
  dbConnection: Connection,
  emitter: EventEmitter,
  events: CrudEvents
): Model<CompanyType> => {
  const CompanyTypeSchema = new Schema({
    name: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true
    }
  });

  emitEvents({
    schema: CompanyTypeSchema,
    emitter,
    events
  });

  return dbConnection.model('CompanyType', CompanyTypeSchema);
};
