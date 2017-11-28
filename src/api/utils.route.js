// @flow
import { Request, Response, NextFunction, Router } from 'express';
import type { CrudOperation, CrudOperations, CrudOptions } from './utils.mongo';

/**
 * format a successful response
 * @param {Response} res
 * @param {status} status
 * @param {*} data
 * @param {boolean} success
 * @return {void}
 */
export const formatResponse = (
  res: Response,
  status: number,
  data: any,
  success?: boolean = true
): void =>
  res
    .status(status)
    .contentType('application/json')
    .json({ success, data });

/**
 * generate a typical CRUD route
 * @param {CrudOperation} operation
 * @param {number} status
 * @return {void}
 */
export const generateRoute = (
  operation: CrudOperation,
  status: number
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options: CrudOptions = {
      id: req.params.id || '',
      data: req.body,
      user: req.user || { _id: '' }
    };
    const result = await operation(options);
    return formatResponse(res, status, result);
  } catch (err) {
    return next(err);
  }
};

/**
 * Create all routes CRUD operations
 * @param {CrudOperations} operations
 * @param {CrudPolicies} policies
 * @return {Router}
 */
export const generateCrudRoutes = <T1, T2>(
  operations: CrudOperations<T1, T2>
) => {
  const router = Router();

  // REST API CRUD route
  router
    .route('/')
    .get(generateRoute(operations.getAll, 200))
    .post(generateRoute(operations.create, 201));
  router
    .route('/:id')
    .get(generateRoute(operations.getById, 200))
    .put(generateRoute(operations.edit, 200))
    .patch(generateRoute(operations.edit, 200))
    .delete(generateRoute(operations.remove, 200));

  return router;
};
