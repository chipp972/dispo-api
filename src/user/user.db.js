// @flow
import Redis from 'ioredis';

/**
 * keys used in the datastore
 */
export const keys = {
  user: 'user',
  emailIndex: 'users:mail',
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
 * get an user by email
 */
export async function getUserByEmail(redis: Redis.Redis, userEmail: string) {
  try {
    const id = await redis.hget(keys.emailIndex, userEmail);
    if (id) {
      const res = await redis.hget(keys.user, id);
      return JSON.parse(res);
    }
    return { success: false };
  } catch (err) {
    throw new Error(`getUserByEmail: ${err}`);
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
 * add an user to the datastore and to the mail index
 */
export async function addUser(
  redis: Redis.Redis,
  userData: UserData
): Promise<string> {
  try {
    // start the transaction
    await redis.multi();
    // get the id
    const idNumber = await redis.incr(keys.id);
    const id = `${keys.idPrefix}:${idNumber}`;
    // add the user
    await redis.hmset(keys.user, id, JSON.stringify({ id, ...userData }));
    // add the email in the index
    await redis.hmset(keys.emailIndex, userData.email, id);
    const transactionEnd = redis.exec();
    return transactionEnd;
  } catch (err) {
    redis.discard();
    throw new Error(`addUser: ${err}`);
  }
}

/**
 * modify an user in the datastore
 */
export async function modifyUser(
  redis: Redis.Redis,
  user: User
): Promise<string> {
  try {
    await redis.multi();
    await redis.hmset(keys.user, user.id, JSON.stringify(user));
    const res = redis.exec();
    return res;
  } catch (err) {
    redis.discard();
    throw new Error(`modifyUser: ${err}`);
  }
}

/**
 * remove an user from the datastore
 */
export async function removeUser(
  redis: Redis.Redis,
  userId: string
): Promise<string> {
  try {
    await redis.multi();
    const userEmail = await getUserById(redis, userId);
    await redis.hdel(keys.user, userId);
    await redis.hdel(keys.emailIndex, userEmail);
    const res = await redis.exec();
    return res;
  } catch (err) {
    redis.discard();
    throw new Error(`removeUser: ${err}`);
  }
}
