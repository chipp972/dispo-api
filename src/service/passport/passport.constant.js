// @flow

export const passportRoutes = {
  admin: {
    sendCode: {
      path: '/admin/start',
      method: 'POST'
    },
    authenticate: {
      path: '/admin/authenticate',
      method: 'POST'
    },
    logout: {
      path: '/admin/logout',
      method: 'POST'
    }
  }
};
