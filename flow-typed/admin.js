// @flow
export type AdminUser = {
  login: string,
  password: string,
  lastConnectionDate: Date
}

export type Config = {
  sessionExpirationDelay: number,
  switchToUnavailableDelay: number
}
