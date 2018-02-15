// @flow
import { customErrorFactory } from 'customizable-error';

export const createNewAuthenticationError = () =>
  customErrorFactory({
    name: 'AuthenticationError',
    message: 'Authentication error',
    status: 401,
    code: 'AUTHENTICATION_ERROR',
  });

export const createNewAuthenticationFailedError = () =>
  customErrorFactory({
    name: 'AuthenticationFailedError',
    message: 'Authentication failed',
    status: 401,
    code: 'AUTHENTICATION_FAILED',
  });

export const createNewUnauthorizedAccessError = () =>
  customErrorFactory({
    name: 'UnauthorizedAccessError',
    message: 'Unauthorized access',
    status: 403,
    code: 'UNAUTHORIZED_ACCESS',
  });
