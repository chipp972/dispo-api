// @flow
export interface UserData {
  email: string,
  password: string,
  lastName?: string,
  firstName?: string,
  birthDate?: Date,
  telephone?: string,
  address?: string,
}

export interface User extends UserData {
  id: string,
}
