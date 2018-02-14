// @flow
import { CustomError } from 'customizable-error';

export class InvalidPasswordError extends CustomError {
  constructor() {
    super({ message: 'Login or Password is invalid', status: 401 });
  }
}
