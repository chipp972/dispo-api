import env from '../config/env';
import { OperationNotPermittedError } from '../config/custom.errors';

/**
 * before crud middleware to check if the request comes from
 * an admin or an authorized user
 *
 * @param {{ id: string, data: any, user: any }} options
 * @return {{ success: boolean, error: Error }}
 */
export const checkPermission = ({ id, data, user }) => {
  try {
    if (env.auth.isAuthenticationActivated) {
      if (user._id === '') {
        // not authenticated
        return { success: false, error: new OperationNotPermittedError() };
      }
      if (user.role === 'admin' || user._id == id || data.owner == user._id) {
        // if user is admin or owns the ressource
        return { success: true };
      }
      return { success: false, error: new OperationNotPermittedError() };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
