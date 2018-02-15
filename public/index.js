// @flow
import type {
  Company as Comp,
  CompanyData as CompData,
} from '../src/api/company/company.mongo';
import type { User as U, UserData as UData } from '../src/api/user/user.mongo';
import type {
  CompanyType as CompType,
  CompanyTypeData as CompTypeData,
} from '../src/api/companytype/companytype.mongo';
import type {
  CompanyPopularity as CompPop,
  CompanyPopularityData as CompPopData,
} from '../src/api/popularity/popularity.mongo';
import type {
  AuthResponse,
  PasswordLessStartResponse,
} from '../src/api/passport/passwordless/passwordless.route';

export type FetchFunction = Function;

export type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  data?: any,
  headers?: { [key: string]: string },
};

export interface FetchWithTokenOptions extends FetchOptions {
  token: string;
}

export type AuthRes = AuthResponse;
export type PasswordLessStartRes = PasswordLessStartResponse;

export type AuthAPI = {
  admin: {
    sendCode: ({ email: string }) => Promise<PasswordLessStartRes>,
    authenticate: ({ email: string, code: string }) => Promise<AuthResponse>,
    logout: (tokenId: string) => Promise<{ success: boolean }>,
  },
  user: {
    register: (UserData) => Promise<*>,
    login: ({ email: string, password: string }) => Promise<AuthResponse>,
    logout: (userId: string) => Promise<{ success: boolean }>,
    facebook: any,
    google: any,
  },
};

export type Company = Comp;
export type CompanyData = CompData;
export type User = U;
export type UserData = UData;
export type CompanyType = CompType;
export type CompanyTypeData = CompTypeData;
export type CompanyPopularity = CompPop;
export type CompanyPopularityData = CompPopData;

export type CrudOperations<T1, T2> = {
  getAll: () => Promise<T2[]>,
  get: (id: string) => Promise<T2>,
  read: ({ id?: string, filters: any }) => Promise<T2[]>,
  create: (data: T1) => Promise<T2>,
  edit: (id: string, field: *) => Promise<T2>,
  remove: (id: string, data: T2) => Promise<T2>,
};

export type DataAPI = {
  company: CrudOperations<CompanyData, Company>,
  user: CrudOperations<UserData, User>,
  companyType: CrudOperations<CompanyTypeData, CompanyType>,
};

export const toFormData = (obj: any) => {
  const formData: FormData = new FormData();
  Object.keys(obj).forEach((key: string) => formData.append(key, obj[key]));
  return formData;
};

const generateCrudOperations = function<T1, T2>(
  getAPIData: (options: FetchOptions) => Promise<*>,
  basePath: string
): CrudOperations<T1, T2> {
  return {
    getAll: (): Promise<T2[]> =>
      getAPIData({
        path: basePath,
        method: 'GET',
      }),
    get: (id: string): Promise<T2> =>
      getAPIData({
        path: `${basePath}/${id}`,
        method: 'GET',
      }),
    read: ({ id, filters }: { id?: string, filters?: any }): Promise<T2[]> => {
      const path = id
        ? `${basePath}/${id}`
        : filters
          ? `${basePath}?${Object.keys(filters)
              .map((key: string) => `${key}=${filters[key]}`)
              .join('&')}`
          : basePath;
      return getAPIData({
        path,
        method: 'GET',
      });
    },
    create: (data: T1): Promise<T2> =>
      getAPIData({
        path: basePath,
        method: 'POST',
        data,
      }),
    edit: (id: string, fields: *): Promise<T2> =>
      getAPIData({
        path: `${basePath}/${id}`,
        method: 'PATCH',
        data: fields,
      }),
    remove: (id: string, data: *): Promise<T2> =>
      getAPIData({
        path: `${basePath}/${id}`,
        method: 'DELETE',
        data,
      }),
  };
};

export function fetchBasic(
  fetchFunction: FetchFunction,
  baseUrl: string,
  isForm: boolean
) {
  return async ({ method, path, data, headers }: FetchOptions): Promise<*> =>
    new Promise((resolve, reject) => {
      const baseHeaders = isForm
        ? {
            Accept: 'application/json',
          }
        : {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          };
      const body =
        method === 'HEAD' || method === 'GET' || !data
          ? null
          : isForm ? toFormData(data) : JSON.stringify(data);
      return fetchFunction(`${baseUrl}${path}`, {
        method,
        headers: {
          ...baseHeaders,
          ...headers,
        },
        body,
      })
        .then((res: any) => res.json())
        .then((res: any) => (res.success ? resolve(res.data) : reject(res)))
        .catch((err: Error) => reject(err));
    });
}

export const fetchWithToken = (
  fetchFunction: FetchFunction,
  baseUrl: string,
  token: string,
  isForm: boolean = true
) => async ({ data, headers, method, path }: FetchOptions): Promise<*> =>
  new Promise((resolve, reject) => {
    const fetchAPI = fetchBasic(fetchFunction, baseUrl, isForm);
    fetchAPI({
      method,
      path,
      data,
      headers: { ...headers, authorization: token },
    })
      .then((res: any) => resolve(res))
      .catch((err: Error) => reject(err));
  });

export const authAPI = (fetchFunction: FetchFunction, url: string): AuthAPI => {
  const getAPIData = fetchBasic(fetchFunction, url, false);
  return {
    admin: {
      sendCode: (data: { email: string }) =>
        getAPIData({
          method: 'POST',
          path: '/auth/admin/start',
          data,
        }),
      authenticate: (data: { email: string, code: string }) =>
        getAPIData({
          method: 'POST',
          path: '/auth/admin/authenticate',
          data,
        }),
      logout: (tokenId: string) =>
        getAPIData({
          method: 'POST',
          path: '/auth/admin/logout',
          data: { tokenId },
        }),
    },
    user: {
      register: (data: UserData): Promise<any> =>
        getAPIData({
          method: 'POST',
          path: '/auth/user/register',
          data,
        }),
      login: (data: { email: string, password: string }): Promise<any> =>
        getAPIData({
          method: 'POST',
          path: '/auth/user/login',
          data: {
            email: data.email ? data.email.toLowerCase() : '',
            password: data.password,
          },
        }),
      logout: (userId: string): Promise<{ success: boolean }> =>
        getAPIData({
          method: 'POST',
          path: '/auth/user/logout',
          data: { userId },
        }),
      facebook: {
        path: '/auth/user/facebook/login',
        callback: '/auth/user/facebook/callback',
        method: 'POST',
      },
      google: {
        path: '/auth/user/google/login',
        callback: '/auth/user/google/callback',
        method: 'POST',
      },
    },
  };
};

export const dataAPI = (fetchFunction: FetchFunction, url: string) => (
  token: string
): DataAPI => {
  const getAPIData = fetchWithToken(fetchFunction, url, token, true);
  return {
    company: {
      ...generateCrudOperations(getAPIData, '/api/company'),
      refreshDispo: (companyId: string) =>
        getAPIData({
          path: `/api/company/${companyId}`,
          method: 'PATCH',
          data: { available: true },
        }),
    },
    user: generateCrudOperations(getAPIData, '/api/user'),
    companyType: generateCrudOperations(getAPIData, '/api/companytype'),
    companyPopularity: generateCrudOperations(
      getAPIData,
      '/api/companypopularity'
    ),
  };
};
