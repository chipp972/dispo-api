// @flow
import { Document } from 'mongoose';

export type HoursMinutes = {
  hours: number,
  minutes: number
}

export type ScheduleDay = {
  start: HoursMinutes,
  end: HoursMinutes
}

export type ScheduleWeek = {
  monday: ScheduleDay,
  tuesday: ScheduleDay,
  wednesday: ScheduleDay,
  thursday: ScheduleDay,
  friday: ScheduleDay,
  saturday: ScheduleDay,
  sunday: ScheduleDay
}

export interface CompanyData {
  // owner: string,
  // managers: string[],
  name: string,
  type: string,
  siret?: string,
  imageUrl?: string,
  address?: string,
  phoneNumber?: string,
  schedule?: ScheduleWeek
}

export interface Company extends CompanyData, Document {
  _id: string
}
