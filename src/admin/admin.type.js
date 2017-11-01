// @flow
export type AdminUser = {
  login: string,
  password: string,
  lastConnectionDate: Date
};

export type AdminConfig = {
  sessionExpirationDelay: number,
  switchToUnavailableDelay: number
};

export function checkAdminConfig(config: any): AdminConfig {
  if (
    typeof config.sessionExpirationDelay === 'number' &&
    typeof config.switchToUnavailableDelay === 'number'
  ) {
    return (config: AdminConfig);
  }
  throw new Error(`Type error at checkAdminConfig: ${config}`);
}

export function checkAdminUser(user: any): AdminUser {
  if (
    typeof user.login === 'string' &&
    typeof user.password === 'string' &&
    user.lastConnectionDate instanceof Date
  ) {
    return (user: AdminUser);
  }
  throw new Error(`Type error at checkAdminUser: ${user.login}`);
}
