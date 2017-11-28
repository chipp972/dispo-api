// @flow

// to authenticate requests
export const setToken = (token: string) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');

// to refresh token
export const setTokenId = (tokenId: string) =>
  localStorage.setItem('tokenId', tokenId);
export const getTokenId = () => localStorage.getItem('tokenId');

export const setExpireAt = (expireAt: string) =>
  localStorage.setItem('expireAt', expireAt);
export const getExpireAt = () => localStorage.getItem('expireAt') || '';
