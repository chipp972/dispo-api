// @flow
import { hash, compare } from 'bcrypt';
import env from '../../config/env';
import type { User } from './user';

/**
 * hash the password
 * @param {string} plainTextPassword
 * @return {string} hash password
 */
export const hashPassword = async (
  plainTextPassword: string
): Promise<string> => {
  if (!plainTextPassword) {
    throw new Error('password is required');
  }
  return hash(plainTextPassword, env.auth.saltRounds);
};

/**
 * check if the candidate password given is valid
 * @param {User} user
 * @param {string} candidatePassword
 * @return {boolean}
 */
export const isValidPassword = async (
  user: User,
  candidatePassword: string
): Promise<boolean> => {
  if (!user.password || !candidatePassword) return false;
  return compare(candidatePassword, user.password);
};
