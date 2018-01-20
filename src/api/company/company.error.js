// @flow
import { CustomError } from '../../config/custom.errors';

export class InvalidCompanyTypeError extends CustomError {
  constructor() {
    super({ message: 'Invalid company type id', status: 400 });
  }
}

export class InvalidAddressError extends CustomError {
  constructor() {
    super({ message: 'Invalid address', status: 400 });
  }
}


