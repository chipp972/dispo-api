// @flow
import { Document } from 'mongoose';
import type { ScheduleWeek } from '../schedule/schedule.type';

export interface CompanyData {
  owner: string;
  name: string;
  type: string;
  siret?: string;
  imageUrl?: string;
  address: string;
  phoneNumber?: string;
  schedule?: ScheduleWeek;
}

export interface Company extends CompanyData, Document {
  _id: string;
  geoAddress: { lat: number, lng: number };
}
