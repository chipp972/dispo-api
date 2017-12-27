// @flow
import { Request, Response, NextFunction, Router } from 'express';
import type {
  CrudOperation,
  CrudOperations,
  CrudOptions,
  Middleware,
  RouteHooks
} from './crud';

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
  status,
  before = () => undefined,
  after = () => undefined
}: {
  operation: CrudOperation,
  status: number,
  before: Middleware,
  after: Middleware
}) =>
  errorHandlerWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const options: CrudOptions = {
        id: req.params.id || '',
        data: req.body
      };
      errorHandlerWrapper(before)(req, res, next);
      res.data = await operation(options);
      res.status(status);
      errorHandlerWrapper(after)(req, res, next);
      next();
    }
  );

/**
 * Create all routes CRUD operations
 * @param {CrudOperations} operations
 * @return {Router}
 */
export const generateCrudRoutes = ({
  operations,
  responseFormatter,
  before = {},
  after = {}
}: {
  operations: CrudOperations,
  responseFormatter?: Middleware,
  before: RouteHooks | Object,
  after: RouteHooks | Object
}): Router => {
  const router = Router();
  const formatResponse = responseFormatter || defaultResponseFormatter;

  router.route('/').get(
    generateRoute({
      operation: operations.getAll,
      status: 200,
      before: before.getAll,
      after: after.getAll
    })
  );

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

  router.use('*', formatResponse);

  return router;
};
