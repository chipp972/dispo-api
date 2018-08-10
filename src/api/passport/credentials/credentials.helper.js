// @flow
import { hash, compare } from 'bcrypt';

/**
 * hash the password
 * @param {string} plainTextPassword
 * @param {number} saltRounds
 * @return {string} hash password
 */
export const hashPassword = async (
  plainTextPassword: string,
  saltRounds: number
): Promise<string> => {
  if (!plainTextPassword) throw new Error('password is required');
  return hash(plainTextPassword, saltRounds);
};

/**
 * check if the candidate password given is valid
 * @param {string} hash
 * @param {string} candidatePassword
 * @return {boolean}
 */
export const isValidPassword = async (
  hash: string,
  candidatePassword: string
): Promise<boolean> => {
  if (!hash || !candidatePassword) return false;
  return compare(candidatePassword, hash);
};
