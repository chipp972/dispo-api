// @flow

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
