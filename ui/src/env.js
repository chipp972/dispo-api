// @flow
export default {
  api: {
    url: process.env.REACT_APP_API_URL || '/',
    websocketUrl: process.env.REACT_APP_WS_URL || '/'
  },
  auth0: {
    url: process.env.REACT_APP_AUTH0_URL || '/',
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || '',
    domain: process.env.REACT_APP_AUTH0_DOMAIN || ''
  }
};
