// @flow

export type AuthResponse = {
  tokenId: string,
  token: string,
  expireAt: string
}

export type PasswordLessStartResponse = {
  email: string,
};
