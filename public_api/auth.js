// @flow
import { fetchBasic } from './index';
import type { FetchFunction } from './index';
import type {
  AuthResponse,
  PasswordLessStartRes
} from '../src/api/auth/auth.type';

export type AuthAPI = {
  admin: {
    sendCode: (data: { email: string }) => Promise<PasswordLessStartRes>,
    authenticate: (data: { email: string, code: string }) => Promise<AuthResponse>
  },
  user: {
    facebookAuth: any,
    googleAuth: any,
    classicAuth: any
  }
};

export const authAPI = (fetchFunction: FetchFunction, url: string): AuthAPI => {
  const getAPIData = fetchBasic(fetchFunction, url);
  return {
    admin: {
      sendCode: (data: { email: string }): Promise<PasswordLessStartRes> =>
        getAPIData({ method: 'POST', path: '/admin/auth/start', data }),
      authenticate: (data: {
        email: string,
        code: string
      }): Promise<AuthResponse> =>
        getAPIData({ method: 'POST', path: '/admin/auth/authenticate', data })
    },
    user: {
      facebookAuth: undefined,
      googleAuth: undefined,
      classicAuth: undefined
    }
  };
};
