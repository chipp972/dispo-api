// @flow
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

export function fetchBasic(fetchFunction: FetchFunction, baseUrl: string) {
  return async ({ method, path, data, headers }: FetchOptions): Promise<*> =>
    new Promise((resolve, reject) => {
      return fetchFunction(`${baseUrl}${path}`, {
        method,
        headers: {
          "Accept": 'application/json',
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(data)
      })
        .then((res) => res.json())
        .then((res) => (res.success ? resolve(res.data) : reject(res)))
        .catch((err) => reject(err));
    });
}

export const fetchWithToken = (
  fetchFunction: FetchFunction,
  baseUrl: string,
  token: string
) => async ({ data, headers, method, path }: FetchOptions): Promise<*> => {
  try {
    const fetchAPI = fetchBasic(fetchFunction, baseUrl);
    const rawResponse = await fetchAPI({
      method,
      path,
      data,
      headers: { ...headers, authorization: token }
    });
    const res = await rawResponse.json();
    if (!res.success) throw new Error(res.message);
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
};
