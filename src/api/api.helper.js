import env from '../config/env';
import { OperationNotPermittedError } from '../config/custom.errors';

/**
 * before crud middleware to check if the request comes from
 * an admin or an authorized user
 *
 * @param {{ id: string, data: any, user: any }} options
 * @throws { OperationNotPermittedError } if unauthorized user
 */
export const checkPermission = async ({ id, data, user }) => {
  if (
    env.auth.isAuthenticationActivated &&
    user.role !== 'admin' &&
    user._id != id &&
    data.owner != user._id
  ) {
    throw new OperationNotPermittedError();
  }
};
