// @flow
import Redis from 'ioredis';
import { LoggerInstance } from 'winston';
import { keys } from './constants';

export async function addUser(redis: Redis.Redis, userData: UserData) {
  const res = await redis.hmset('userByEmail', userData.email, userData);
  return res;
}

export function modifyUser() {

}

export function removeUser() {

}
