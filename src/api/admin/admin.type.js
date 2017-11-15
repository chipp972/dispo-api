// @flow
export type AdminUser = {
  email: string,
  password: string,
  lastConnectionDate: Date
};

export type AdminConfig = {
  switchToUnavailableDelay: number
};
