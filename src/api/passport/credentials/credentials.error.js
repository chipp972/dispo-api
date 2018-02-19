// @flow
import { customErrorFactory } from 'customizable-error';

export const createNewInvalidOldPasswordError = () =>
  customErrorFactory({
    name: 'InvalidOldPasswordError',
    code: 'INVALID_OLD_PASSWORD',
    message: 'Old password is invalid',
    status: 400,
  });
