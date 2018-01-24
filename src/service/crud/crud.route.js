// @flow
import { Request, Response, NextFunction, Router } from 'express';
import type {
  CrudOptions,
  ExpressCrudGenerator,
  RouteGeneratorOptions
} from './crud.type';

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
  beforeAll = (options: CrudOptions) =>
    Promise.resolve({ success: true, error: new Error() }),
  before = (options: CrudOptions) =>
    Promise.resolve({ success: true, error: new Error() }),
  after = (result: any, req: Request) => Promise.resolve(result),
  afterAll = (result: any, req: Request) => Promise.resolve(result),
  event,
  emitter
}: RouteGeneratorOptions) =>
  async function(req: Request, res: Response, next: NextFunction) {
    try {
      const options: CrudOptions = {
        id: req.params.id || (req.body && req.body._id) || '',
        data: req.body || {},
        user: req.user || { _id: '' },
        files: req.files || {}
      };
      const beforeAllRes = await beforeAll(options);
      if (!beforeAllRes.success && beforeAllRes.error) {
        return next(beforeAllRes.error);
      }
      const { error, success } = await before(options);
      if (!success && error) return next(error);
      const result = await operation(options);
      const modifiedResult1 = await after(result, req);
      const tmpResult =
        modifiedResult1 !== undefined ? modifiedResult1 : result;
      const modifiedResult2 = await afterAll(tmpResult, req);
      res.data = modifiedResult2 !== undefined ? modifiedResult2 : tmpResult;
      res.status(res.statusCode || status);
      if (emitter && event) emitter.emit(event, res.data);
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
  after = {},
  emitter,
  events = {}
}): Router => {
  const router = Router();
  const formatResponse = responseFormatter || defaultResponseFormatter;

  router.route('/').get(
    generateRoute({
      operation: operations.getAll,
      status: 200,
      before: before.getAll,
      after: after.getAll,
      beforeAll: before.all,
      afterAll: after.all
    })
  );

  router.route('/').post(
    generateRoute({
      operation: operations.create,
      status: 201,
      before: before.create,
      after: after.create,
      beforeAll: before.all,
      afterAll: after.all,
      event: events.created,
      emitter
    })
  );

  router
    .route('/:id')
    .get(
      generateRoute({
        operation: operations.getById,
        status: 200,
        before: before.getById,
        after: after.getById,
        beforeAll: before.all,
        afterAll: after.all
      })
    )
    .put(
      generateRoute({
        operation: operations.update,
        status: 200,
        before: before.update,
        after: after.update,
        beforeAll: before.all,
        afterAll: after.all,
        event: events.updated,
        emitter
      })
    )
    .patch(
      generateRoute({
        operation: operations.update,
        status: 200,
        before: before.update,
        after: after.update,
        beforeAll: before.all,
        afterAll: after.all,
        event: events.updated,
        emitter
      })
    )
    .delete(
      generateRoute({
        operation: operations.delete,
        status: 200,
        before: before.delete,
        after: after.delete,
        beforeAll: before.all,
        afterAll: after.all,
        event: events.deleted,
        emitter
      })
    );

  router.use('*', formatResponse);

  return router;
};
