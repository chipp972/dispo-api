// @flow
import { Router } from 'express';
import { generateCrudOperations } from './crud.mongo';
import { generateCrudRoutes } from './crud.route';
import type { CrudGenOptions } from './crud.type';

export const crud = ({
  path = '/',
  model,
  responseFormatter,
  before,
  after,
  emitter,
  events
}: CrudGenOptions): Router => {
  const router = Router();
  const operations = generateCrudOperations(model);
  router.use(
    path,
    generateCrudRoutes({
      operations,
      responseFormatter,
      before,
      after,
      emitter,
      events
    })
  );
  return router;
};
