// @flow
import { Request, Response, NextFunction, Router } from 'express';
import type { CrudOperation, CrudOperations, CrudOptions } from './mongodb';

export type Middleware = (
  req: Request,
  res: Response,
  next?: NextFunction
) => any;

export type RouteHooks = {
  get: Middleware,
  getAll: Middleware,
  create: Middleware,
  edit: Middleware,
  remove: Middleware
};

export const errorHandlerWrapper = (middleware: Middleware) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    middleware(req, res, next);
  } catch (err) {
    next(err);
  }
};

export const defaultResponseFormatter = (req: Request, res: Response): void =>
  res
    .status(res.statusCode || 200)
    .contentType('application/json')
    .json({ success: res.success ? res.success : true, data: res.data });

/**
 * generate a typical CRUD route
 * @param {CrudOperation} operation
 * @param {number} status
 * @return {void}
 */
export const generateRoute = ({
  operation,
  status
}: {
  operation: CrudOperation,
  status: number
}) =>
  errorHandlerWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const options: CrudOptions = {
        id: req.params.id || '',
        data: req.body,
        user: req.user || { _id: '' }
      };
      res.data = await operation(options);
      res.status(status);
      next();
    }
  );

/**
 * Create all routes CRUD operations
 * @param {CrudOperations} operations
 * @return {Router}
 */
export const generateCrudRoutes = <T1, T2>({
  operations,
  responseFormatter,
  beforeAll,
  afterAll,
  before,
  after
}: {
  operations: CrudOperations<T1, T2>,
  responseFormatter?: Middleware,
  beforeAll?: Middleware[],
  afterAll?: Middleware[],
  before?: RouteHooks,
  after?: RouteHooks
}): Router => {
  const router = Router();
  const formatResponse = responseFormatter || defaultResponseFormatter;

  beforeAll.forEach((mw: Middleware) => router.use('/*', mw));

  router
    .route('/')
    .get(before.getAll)
    .get(generateRoute({ operation: operations.getAll, status: 200 }))
    .get(after.getAll);

  router
    .route('/')
    .post(before.create)
    .post(generateRoute({ operation: operations.create, status: 201 }))
    .post(after.create);

  router
    .route('/:id')
    .get(generateRoute({ operation: operations.getById, status: 200 }))
    .put(generateRoute({ operation: operations.edit, status: 200 }))
    .patch(generateRoute({ operation: operations.edit, status: 200 }))
    .delete(generateRoute({ operation: operations.remove, status: 200 }));

  afterAll.forEach((mw: Middleware) => router.use('/*', mw));

  router.use('*', formatResponse);

  return router;
};
