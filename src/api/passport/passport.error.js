// @flow
import { CustomError, customErrorFactory } from 'customizable-error';

export class AuthenticationError extends CustomError {
  constructor() {
    super({
      message: 'Authentication is needed',
      status: 401,
      code: 'AUTHENTICATION_ERROR',
    });
  }
}

export const createNewAuthenticationError = () =>
  customErrorFactory({
    name: 'AuthenticationError',
    message: 'Authentication error',
    status: 401,
    code: 'AUTHENTICATION_ERROR',
  });

export class AuthenticationFailedError extends CustomError {
  constructor() {
    super({
      message: 'Authentication failed',
      status: 401,
      code: 'AUTHENTICATION_FAILED',
    });
  }
}
export const createNewAuthenticationFailedError = () =>
  customErrorFactory({
    name: 'AuthenticationFailedError',
    message: 'Authentication failed',
    status: 401,
    code: 'AUTHENTICATION_FAILED',
  });

export class BadRequestError extends CustomError {
  constructor() {
    super({ message: 'Bad request', status: 400 });
  }
}

export class OperationNotPermittedError extends CustomError {
  constructor() {
    super({ message: 'Operation not permitted', status: 403 });
  }
}

export class UnauthorizedAccessError extends CustomError {
  constructor() {
    super({ message: 'Unauthorized access', status: 403 });
  }
}
