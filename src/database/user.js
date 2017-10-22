// @flow
import Redis from 'ioredis';

export async function addUser(redis: Redis.Redis, userData: UserData) {
  const res = await redis.hsmset('userByEmail', userData.email, userData);
  return res;
}

export function modifyUser() {

}

export function removeUser() {

}
