// @flow
import { Request, Response, NextFunction, Router } from 'express';
import type {
  CrudOperation,
  CrudOptions,
  Middleware,
  CrudAfterMiddleware,
  ExpressCrudGenerator
} from './crud';

export const errorHandlerWrapper = (middleware: Middleware) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await middleware(req, res, next);
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
  before = (options: CrudOptions) => Promise.resolve(),
  after = (obj: any) => Promise.resolve(obj)
}: {
  operation: CrudOperation,
  status: number,
  before: CrudOperation,
  after: CrudAfterMiddleware
}) =>
  errorHandlerWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      const options: CrudOptions = {
        id: req.params.id || '',
        data: req.body,
        user: req.user || { _id: '' }
      };
      await before(options);
      const result = await operation(options);
      const modifiedResult = await after(result, req);
      res.data = modifiedResult !== undefined ? modifiedResult : result;
      res.status(res.statusCode || status);
      next();
    }
  );

/**
 * Create all routes CRUD operations
 * @param {CrudOperations} operations
 * @return {Router}
 */
export const generateCrudRoutes: ExpressCrudGenerator = ({
  operations,
  responseFormatter,
  before = {},
  after = {}
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

  router.route('/').post(
    generateRoute({
      operation: operations.create,
      status: 201,
      before: before.create,
      after: after.create
    })
  );

  router
    .route('/:id')
    .get(
      generateRoute({
        operation: operations.getById,
        status: 200,
        before: before.getById,
        after: after.getById
      })
    )
    .put(
      generateRoute({
        operation: operations.update,
        status: 200,
        before: before.update,
        after: after.update
      })
    )
    .patch(
      generateRoute({
        operation: operations.update,
        status: 200,
        before: before.update,
        after: after.update
      })
    )
    .delete(
      generateRoute({
        operation: operations.delete,
        status: 200,
        before: before.delete,
        after: after.delete
      })
    );

  router.use('*', formatResponse);

  return router;
};
