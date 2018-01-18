// @flow
import { Request, Response, NextFunction, Router } from 'express';
import type {
  CrudOperation,
  CrudOptions,
  CrudAfterMiddleware,
  CrudBeforeMiddleware,
  ExpressCrudGenerator
} from './crud';

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
  before = (options: CrudOptions) =>
    Promise.resolve({ success: true, error: new Error() }),
  after = (result: any, req: Request) => Promise.resolve(result)
}: {
  operation: CrudOperation,
  status: number,
  before: CrudBeforeMiddleware,
  after: CrudAfterMiddleware
}) =>
  async function(req: Request, res: Response, next: NextFunction) {
    try {
      const options: CrudOptions = {
        id: req.params.id || (req.body && req.body._id) || '',
        data: req.body || {},
        user: req.user || { _id: '' },
        files: req.files || {}
      };
      const { error, success } = await before(options);
      if (!success && error) return next(error);
      const result = await operation(options);
      const modifiedResult = await after(result, req);
      res.data = modifiedResult !== undefined ? modifiedResult : result;
      res.status(res.statusCode || status);
      return next();
    } catch (err) {
      return next(err);
    }
  };

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
