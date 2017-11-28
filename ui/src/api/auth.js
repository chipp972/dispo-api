// @flow
import {getAPIData} from './fetch';
import type {AdminLogin} from './api.type';

export const adminLogin: AdminLogin = {
  sendCode: (email) =>
    getAPIData({
      path: '/admin/auth/start',
      method: 'POST',
      data: { email }
    }),
  authenticate: (email, code) =>
    getAPIData({
      path: '/admin/auth/authenticate',
      method: 'POST',
      data: { email, code }
    })
};
