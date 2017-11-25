// @flow
import type {
  Company,
  CompanyData
} from '../../../src/api/company/company.type';
import type {
  CompanyType,
  CompanyTypeData
} from '../../../src/api/companytype/companytype.type';
import type { User, UserData } from '../../../src/api/user/user.type';
import type { CrudOperations, AdminLogin } from './api.type';
import { getAPIData, fetchAuth0 } from './fetch';

export const generateCrudOperations = <T1, T2>(
  basePath: string
): CrudOperations<T1, T2> => ({
  getAll: (): Promise<T2[]> =>
    getAPIData({
      path: basePath,
      method: 'GET'
    }),
  get: (id: string): Promise<T2> =>
    getAPIData({
      path: `${basePath}/${id}`,
      method: 'GET'
    }),
  create: (data: T1): Promise<T2> =>
    getAPIData({
      path: basePath,
      method: 'POST',
      data
    }),
  edit: (id: string, fields: any): Promise<T2> =>
    getAPIData({
      path: `${basePath}/${id}`,
      method: 'PATCH',
      data: fields
    }),
  remove: (id: string): Promise<T2> =>
    getAPIData({
      path: `${basePath}/${id}`,
      method: 'DELETE'
    })
});

// export const configOperations = generateCrudOperations('/config');

export const companyOperations: CrudOperations<CompanyData,
  Company> = generateCrudOperations('/company');

export const userOperations: CrudOperations<UserData,
  User> = generateCrudOperations('/user');

export const companyTypeOperations: CrudOperations<CompanyTypeData,
  CompanyType> = generateCrudOperations('/companytype');

export const adminLogin: AdminLogin = {
  sendCode: (email) =>
    fetchAuth0({
      path: '/passwordless/start',
      method: 'POST',
      data: {
        connection: 'email',
        send: 'code',
        email
      }
    }),
  verifyCode: (email, verificationCode) =>
    fetchAuth0({
      path: '/passwordless/verify',
      method: 'POST',
      data: {
        connection: 'email',
        // grant_type: 'password',
        email,
        verification_code: verificationCode
      }
    }),
  authenticate: (username, password) =>
    fetchAuth0({
      path: '/oauth/ro',
      method: 'POST',
      data: {
        connection: 'email',
        grant_type: 'jwt-bearer',
        username,
        password
      }
    })
};
