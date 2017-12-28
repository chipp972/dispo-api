// @flow
import { Router } from 'express';
import { generateCrudOperations } from './crud.mongo';
import { generateCrudRoutes } from './crud.route';
import type { CrudGenOptions } from './crud';

export const crud = ({
  model,
  responseFormatter,
  before,
  after,
  path
}: CrudGenOptions) => {
  const router = Router();
  const operations = generateCrudOperations(model);
  router.use(
    path,
    generateCrudRoutes({
      operations,
      responseFormatter,
      before,
      after
    })
  );
  return router;
};
