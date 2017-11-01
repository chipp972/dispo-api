// @flow
export type AdminUser = {
  login: string,
  password: string,
  lastConnectionDate: Date
}

export type AdminConfig = {
  sessionExpirationDelay: number,
  switchToUnavailableDelay: number
}
