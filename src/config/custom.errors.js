// @flow

class CustomError extends Error {
  // status: number
  constructor(options: { message: string, status?: number }) {
    super(options.message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(options.message).stack;
    }
    this.status = options.status || 401;
  }
}

export class BadRequestError extends CustomError {
  constructor() {
    super({ message: 'Bad request', status: 400 });
  }
}

export class InvalidPasswordError extends CustomError {
  constructor() {
    super({ message: 'Invalid password', status: 400 });
  }
}

export class AuthenticationError extends CustomError {
  constructor() {
    super({ message: 'Authentication is needed', status: 401 });
  }
}

export class AuthenticationFailedError extends CustomError {
  constructor() {
    super({ message: 'Authentication failed', status: 401 });
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

export class NotFoundError extends CustomError {
  constructor() {
    super({ message: 'Not found', status: 404 });
  }
}
