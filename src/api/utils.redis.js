// @flow
import { Redis } from 'ioredis';

/**
 * add a company to redis data store
 */
export async function addToHash(
  redis: Redis.Redis,
  hashKey: string,
  dataKey: string,
  data: string
): Promise<string> {
  try {
    const res = await redis.hmset(hashKey, dataKey, data);
    return res;
  } catch (err) {
    throw err;
  }
}

/**
 * remove a company in the redis data store
 */
export async function removeFromHash(
  redis: Redis.Redis,
  hashKey: string,
  dataKey: string,
): Promise<string> {
  try {
    const res = await redis.hdel(hashKey, dataKey);
    return res;
  } catch (err) {
    throw err;
  }
}
