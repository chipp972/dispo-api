// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import { generateCrudRoutes } from '../../service/express/utils.route';
import { generateCrudOperations } from '../../service/mongodb/utils.mongo';
import { getAdminPolicy } from './admin.policy';

export function initAdminRoutes(AdminModel: Model): Router {
  const router = Router();

  const operations = generateCrudOperations(AdminModel);
  const crudRoutes = generateCrudRoutes(operations);

  router.use('/admin', getAdminPolicy(AdminModel));
  router.use('/admin', crudRoutes);

  return router;
}
