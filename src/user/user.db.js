// @flow
import Redis from 'ioredis';

/**
 * keys used in the datastore
 */
export const keys = {
  user: 'user',
  id: 'user:id',
  idPrefix: 'user'
};

/**
 * get an user by id
 */
export async function getUserById(redis: Redis.Redis, userId: string) {
  try {
    const res = await redis.hget(keys.user, userId);
    return JSON.parse(res);
  } catch (err) {
    throw new Error(`getUserById: ${err}`);
  }
}

/**
 * get all users in the datastore
 */
export async function getAllUsers(redis: Redis.Redis): Promise<Array<User>> {
  try {
    const res = await redis.hgetall(keys.user);
    return Object.keys(res).map(userId => JSON.parse(res[userId]));
  } catch (err) {
    throw new Error(`getAllUsers: ${err}`);
  }
}

/**
 * add an user to the datastore
 */
export async function addUser(redis: Redis.Redis, userData: UserData): Promise<string> {
  try {
    const idNumber = await redis.incr(keys.id);
    const id = `${keys.idPrefix}:${idNumber}`;
    const res = await redis.hmset(keys.user, id, JSON.stringify({ id, ...userData }));
    return res;
  } catch (err) {
    throw new Error(`addUser: ${err}`);
  }
}

/**
 * modify an user in the datastore
 */
export async function modifyUser(redis: Redis.Redis, user: User): Promise<string> {
  try {
    const res = await redis.hmset(keys.user, user.id, JSON.stringify(user));
    return res;
  } catch (err) {
    throw err;
  }
}

/**
 * remove an user from the datastore
 */
export async function removeUser(redis: Redis.Redis, userId: string): Promise<string> {
  try {
    const res = await redis.hdel(keys.user, userId);
    return res;
  } catch (err) {
    throw err;
  }
}
