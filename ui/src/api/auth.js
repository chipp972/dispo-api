// @flow
// import Auth0LockPasswordless from 'auth0-lock-passwordless';
// import auth0 from 'auth0-js';
// import EventEmitter from 'events';
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

// export class AuthService extends EventEmitter {
//   lock: any;
//   hash: any;
//   token: any;
//   webAuth: any;

//   constructor(clientID: string, domain: string) {
//     super();
//     this.webAuth = new auth0.WebAuth({ clientID, domain });
//     this.lock = new Auth0LockPasswordless(clientID, domain);
//     this.hash = this.lock.parseHash(window.location.hash);
//     if (this.hash && this.hash.error) {
//       this._authorizationError();
//     } else if (this.hash && this.hash.idToken) {
//       this._doAuthentication();
//     }
//   }

//   _doAuthentication(err?: Error, token: any) {
//     if (this.hash) {
//       localStorage.setItem('id_token', this.hash.idToken);
//       this.lock.getProfile(this.hash.idToken, this.setProfile.bind(this));
//     } else {
//       localStorage.setItem('id_token', token.idToken);
//       this.lock.getProfile(token.idToken, this.setProfile.bind(this));
//     }
//   }

//   _authorizationError = () =>
//     alert(
//       'There was an error: ' +
//         this.hash.error +
//         '\n' +
//         this.hash.error_description
//     );

//   loginMagiclink = () => this.lock.magiclink();

//   passwordlessStart = (email: string, cb: (err?: Error, res: any) => any) =>
//     this.webAuth.passwordlessStart(
//       {
//         connection: 'email',
//         send: 'code',
//         email
//       },
//       cb
//     );

//   passwordlessVerify = (email: string, verficationCode: string, cb: any) =>
//     this.webAuth.passwordlessVerify(
//       {
//         connection: 'email',
//         email,
//         verficationCode
//       },
//       cb
//     );

//   loginEmailCode = () =>
//     this.lock.emailcode({ autoclose: true }, this._doAuthentication.bind(this));

//   loginSMSCode = () =>
//     this.lock.sms({ autoclose: false }, this._doAuthentication.bind(this));

//   loggedIn() {
//     const token = this.getToken();
//     console.log(token); // TODO: check if token is expired
//     return !!token;
//   }
//   setProfile(err: Error, profile: any) {
//     localStorage.setItem('profile', JSON.stringify(profile));
//     this.emit('profile_updated', profile);
//   }
//   getProfile() {
//     const profile = localStorage.getItem('profile');
//     return profile ? JSON.parse(profile) : {};
//   }
//   setToken(idToken: string) {
//     localStorage.setItem('id_token', idToken);
//   }
//   getToken() {
//     return localStorage.getItem('id_token');
//   }
//   logout() {
//     localStorage.removeItem('id_token');
//     localStorage.removeItem('profile');
//   }
// }
