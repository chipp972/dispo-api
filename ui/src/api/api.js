// @flow
import env from '../env';
import type {
  Company,
  CompanyData
} from '../../../src/api/company/company.type';
import type {
  CompanyType,
  CompanyTypeData
} from '../../../src/api/companytype/companytype.type';
import type { User, UserData } from '../../../src/api/user/user.type';

export type FetchOptions<T> = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  data?: T
};

export type CrudOperations<Data, Model> = {
  getAll: () => Promise<Model[]>,
  get: (id: string) => Promise<Model>,
  create: (data: Data) => Promise<Model>,
  edit: (id: string, field: any) => Promise<Model>,
  remove: (id: string) => Promise<Model>
};

export const fetchAPI = <T1, T2>(options: FetchOptions<T1>): Promise<T2> =>
  new Promise((resolve, reject) => {
    fetch(`${env.api.url}${options.path}`, {
      method: options.method,
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options.data)
    })
      .then((res) => res.json())
      .then((res) => (res.success ? resolve(res.data) : reject(res.data)))
      .catch((err) => reject(err));
  });

export const generateCrudOperations = <T1, T2>(
  basePath: string
): CrudOperations<T1, T2> => ({
  getAll: (): Promise<T2[]> =>
    fetchAPI({
      path: basePath,
      method: 'GET'
    }),
  get: (id: string): Promise<T2> =>
    fetchAPI({
      path: `${basePath}/${id}`,
      method: 'GET'
    }),
  create: (data: T1): Promise<T2> =>
    fetchAPI({
      path: basePath,
      method: 'POST',
      data
    }),
  edit: (id: string, fields: any): Promise<T2> =>
    fetchAPI({
      path: `${basePath}/${id}`,
      method: 'PATCH',
      data: fields
    }),
  remove: (id: string): Promise<T2> =>
    fetchAPI({
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
