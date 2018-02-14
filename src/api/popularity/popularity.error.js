// @flow
import { CustomError } from 'customizable-error';

export class InvalidUserError extends CustomError {
  constructor(id: string) {
    super({
      message: `Invalid user ${id}`,
      status: 400,
      code: 'POPULARITY_INVALID_USER',
    });
  }
}

export class InvalidCompanyError extends CustomError {
  constructor(id: string) {
    super({
      message: `Invalid company ${id}`,
      status: 400,
      code: 'POPULARITY_INVALID_COMPANY',
    });
  }
}
