// @flow
import { Request, Response, NextFunction, Router } from 'express';
import type { CrudOperation, CrudOperations } from './utils.mongo';

/**
 * format a successful response
 */
export const formatResponse = (res: Response, status: number, data: any) =>
  res
    .status(status)
    .contentType('application/json')
    .json({ success: true, data });

/**
 * generate a typical CRUD route
 */
export const generateRoute = (
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
    .get(generateRoute(operations.getById, 200))
    .put(generateRoute(operations.edit, 200))
    .patch(generateRoute(operations.edit, 200))
    .delete(generateRoute(operations.remove, 200));

  return router;
};