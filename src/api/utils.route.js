// @flow
import { Request, Response, NextFunction, Router } from 'express';
import type { CrudOperation, CrudOperations } from './utils.mongo';

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
    const data = req.body;
    const result = await operation(data);
    return formatResponse(res, status, result);
  } catch (err) {
    return next(err);
  }
};

export const generateRouteWithId = (
  operation: CrudOperation,
  status: number
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await operation(id, data);
    return formatResponse(res, status, result);
  } catch (err) {
    return next(err);
  }
};

/**
 * Create all routes CRUD operations
 * @param {CrudOperations} operations
 * @return {Router}
 */
export const generateCrudRoutes = (operations: CrudOperations<*, *>) => {
  const router = Router();

  // REST API crud route
  router
    .route('/')
    .get(generateRoute(operations.getAll, 200))
    .post(generateRoute(operations.create, 201));
  router
    .route('/:id')
    .get(generateRouteWithId(operations.getById, 200))
    .put(generateRouteWithId(operations.edit, 200))
    .patch(generateRouteWithId(operations.edit, 200))
    .delete(generateRouteWithId(operations.remove, 200));

  return router;
};
