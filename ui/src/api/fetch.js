// @flow
import env from '../env';

export type GetAPIDataOptions<T> = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  data?: T,
  responpseType?: 'json'
};

export function fetchBasic<T1>(baseUrl: string) {
  return (
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    data?: T1,
    responpseType: 'json' = 'json'
  ) =>
    fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Accept": 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
}

export const fetchAuth0 = async (options: GetAPIDataOptions<*>) => {
  try {
    const fetcher = fetchBasic(env.auth0.url);
    const data: any = { ...options.data, client_id: env.auth0.clientId };
    const res = await fetcher(
      options.method,
      options.path,
      data,
      options.responpseType
    );
    return await res.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const fetchAPI = fetchBasic(env.api.url);

export async function getAPIData<T1, T2>(
  options: GetAPIDataOptions<T1>
): Promise<T2> {
  try {
    const rawResponse = await fetchAPI(
      options.method,
      options.path,
      options.data,
      options.responpseType
    );
    const res = await rawResponse.json();
    if (!res.success) throw new Error(res.message);
    return res.data;
  } catch (err) {
    throw new Error(err);
  }
}
