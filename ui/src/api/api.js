// @flow
// import type {
//   Company,
//   CompanyData
// } from '../../../src/api/company/company.type';
import env from '../env';

export type FetchOptions<T> = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  data?: T
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
      .then((res) => res.success ? resolve(res.data) : reject(res.data))
      .catch((err) => reject(err));
  });

export const generateCrudOperations = <T1, T2>(basePath: string) => ({
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

export const configOperations = generateCrudOperations('/config');
export const companyOperations = generateCrudOperations('/company');
export const userOperations = generateCrudOperations('/user');
export const companyTypeOperations = generateCrudOperations('/companytype');
