// @flow
import { Schema } from 'mongoose';

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
