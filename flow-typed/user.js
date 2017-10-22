// @flow

export interface UserData {
  email: string,
  password: string,
  adress: ?string,
}

export interface User extends UserData {
  id: string,
}
