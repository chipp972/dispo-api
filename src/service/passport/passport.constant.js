// @flow

export const passportRoutes = {
  admin: {
    sendCode: {
      path: '/auth/admin/start',
      method: 'POST'
    },
    authenticate: {
      path: '/auth/admin/authenticate',
      method: 'POST'
    },
    logout: {
      path: '/auth/admin/logout',
      method: 'POST'
    }
  },
  user: {
    register: {
      path: '/auth/user/register',
      method: 'POST'
    },
    login: {
      path: '/auth/user/login',
      method: 'POST'
    },
    logout: {
      path: '/auth/user/logout',
      method: 'POST'
    },
    facebook: {
      path: '/auth/user/facebook/login',
      callback: '/auth/user/facebook/callback',
      method: 'POST'
    },
    google: {
      path: '/auth/user/google/login',
      callback: '/auth/user/google/callback',
      method: 'POST'
    }
  },
  failure: {
    path: '/auth/failure',
    method: 'GET'
  }
};
