// @flow
import { Response } from 'express';
import type {
  Company as Comp,
  CompanyData as CompData
} from '../src/api/company/company.js.flow';
import type {
  User as U,
  UserData as UData
} from '../src/api/user/user.js.flow';
import type {
  CompanyType as CompType,
  CompanyTypeData as CompTypeData
} from '../src/api/companytype/companytype.js.flow';
import type {
  AuthResponse,
  PasswordLessStartResponse
} from '../src/service/passport/admin/admin';

export type FetchFunction = Function;

export type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  data?: any,
  headers?: { [key: string]: string }
};

export interface FetchWithTokenOptions extends FetchOptions {
  token: string;
}

export type AuthRes = AuthResponse;
export type PasswordLessStartRes = PasswordLessStartResponse;

export type AuthAPI = {
  admin: {
    sendCode: ({ email: string }) => Promise<PasswordLessStartRes>,
    authenticate: ({ email: string, code: string }) => Promise<AuthResponse>
  },
  user: {
    facebookAuth: any,
    googleAuth: any,
    classicAuth: any
  }
};

export type Company = Comp;
export type CompanyData = CompData;
export type User = U;
export type UserData = UData;
export type CompanyType = CompType;
export type CompanyTypeData = CompTypeData;

export type CrudOperations<T1, T2> = {
  getAll: () => Promise<T2[]>,
  get: (id: string) => Promise<T2>,
  create: (data: T1) => Promise<T2>,
  edit: (id: string, field: any) => Promise<T2>,
  remove: (id: string) => Promise<T2>
};

export type DataAPI = {
  company: CrudOperations<CompanyData, Company>,
  user: CrudOperations<UserData, User>,
  companyType: CrudOperations<CompanyTypeData, CompanyType>
};

const generateCrudOperations = function<T1, T2>(
  getAPIData: (options: FetchOptions) => Promise<*>,
  basePath: string
): CrudOperations<T1, T2> {
  return {
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
  };
};

export function fetchBasic(fetchFunction: FetchFunction, baseUrl: string) {
  return async ({ method, path, data, headers }: FetchOptions): Promise<*> =>
    new Promise((resolve, reject) => {
      return fetchFunction(`${baseUrl}${path}`, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      })
        .then((res: Response) => res.json())
        .then(
          (res: Response) => (res.success ? resolve(res.data) : reject(res))
        )
        .catch((err: Error) => reject(err));
    });
}

export const fetchWithToken = (
  fetchFunction: FetchFunction,
  baseUrl: string,
  token: string
) => async ({ data, headers, method, path }: FetchOptions): Promise<*> =>
  new Promise((resolve, reject) => {
    const fetchAPI = fetchBasic(fetchFunction, baseUrl);
    fetchAPI({
      method,
      path,
      data,
      headers: { ...headers, authorization: token }
    })
      .then((res: Response) => resolve(res))
      .catch((err: Error) => reject(err));
  });

export const authAPI = (fetchFunction: FetchFunction, url: string): AuthAPI => {
  const getAPIData = fetchBasic(fetchFunction, url);
  return {
    admin: {
      sendCode: (data: { email: string }): Promise<PasswordLessStartRes> =>
        getAPIData({
          method: 'POST',
          path: '/auth/admin/start',
          data
        }),
      authenticate: (data: {
        email: string,
        code: string
      }): Promise<AuthResponse> =>
        getAPIData({
          method: 'POST',
          path: '/auth/admin/authenticate',
          data
        })
    },
    user: {
      facebookAuth: undefined,
      googleAuth: undefined,
      classicAuth: undefined
    }
  };
};

export const dataAPI = (fetchFunction: FetchFunction, url: string) => (
  token: string
): DataAPI => {
  const getAPIData = fetchWithToken(fetchFunction, url, token);
  return {
    company: generateCrudOperations(getAPIData, '/api/company'),
    user: generateCrudOperations(getAPIData, '/api/user'),
    companyType: generateCrudOperations(getAPIData, '/api/companytype')
  };
};
