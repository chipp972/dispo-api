// @flow
import { CustomError } from 'customizable-error';

export class TooMuchCompaniesError extends CustomError {
  constructor() {
    super({
      message: 'User reached max company number',
      status: 400,
      code: 'TOO_MUCH_COMPANIES',
    });
  }
}

export class InvalidCompanyTypeError extends CustomError {
  constructor() {
    super({
      message: 'Invalid company type ID',
      status: 400,
      code: 'INVALID_COMPANY_TYPE',
    });
  }
}

export class InvalidOwnerError extends CustomError {
  constructor() {
    super({
      message: 'Invalid owner ID',
      status: 400,
      code: 'INVALID_OWNER',
    });
  }
}

export class InvalidAddressError extends CustomError {
  constructor() {
    super({
      message: 'Invalid address: Google map coud not find it',
      status: 400,
      code: 'INVALID_ADDRESS',
    });
  }
}

export class ForbiddenEarlyRefreshError extends CustomError {
  constructor() {
    super({
      message: 'Cannot refresh availability yet: Company is still available',
      status: 400,
      code: 'FORBIDDEN_EARLY_REFRESH',
    });
  }
}
