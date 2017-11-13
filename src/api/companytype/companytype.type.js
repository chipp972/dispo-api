// @flow
import { Document } from 'mongoose';

export interface CompanyTypeData {
  name: string,
}

export interface CompanyType extends CompanyTypeData, Document {
  _id: string,
}
