// @flow
import { fetchWithToken } from './index';
import type { FetchOptions, FetchFunction } from './index';
import type { Company, CompanyData } from '../src/api/company/company.type';
import type { User, UserData } from '../src/api/user/user.type';
import type {
  CompanyType,
  CompanyTypeData
} from '../src/api/companytype/companytype.type';

export type CrudOperations<T1, T2> = {
  getAll: () => Promise<T2[]>,
  get: (id: string) => Promise<T2>,
  create: (data: T1) => Promise<T2>,
  edit: (id: string, field: any) => Promise<T2>,
  remove: (id: string) => Promise<T2>
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

export type DataAPI = {
  company: CrudOperations<CompanyData, Company>,
  user: CrudOperations<UserData, User>,
  companyType: CrudOperations<CompanyTypeData, CompanyType>
};

export const dataAPI = (
  fetchFunction: FetchFunction,
  url: string,
  token: string
): DataAPI => {
  const getAPIData = fetchWithToken(fetchFunction, url, token);
  return {
    company: generateCrudOperations(getAPIData, '/company'),
    user: generateCrudOperations(getAPIData, '/user'),
    companyType: generateCrudOperations(getAPIData, '/companytype')
  };
};
