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

export const createNewInvalidPasswordError = (
  createNewCustomError: (any) => Error
): Error =>
  new createNewCustomError({
    name: 'InvalidPasswordError',
    message: 'oldPassword field is invalid',
    status: 400,
    code: 'INVALID_PASSWORD_ERROR',
  });

export const updateCredentials = (operations: {
  update: any,
  [op: string]: any,
}) => async (data: {
  email: string,
  password: string,
  oldPassword: string,
}) => {
  try {
    await operations.update(data);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
