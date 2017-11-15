// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import type { AdminConfig, AdminUser } from './admin.type';
import { generateCrudRoutes } from '../utils.route';
import { generateCrudOperations } from '../utils.mongo';
import { getAdminPolicy } from './admin.policy';

export function initAdminConfigRoutes(AdminUserModel: Model<AdminUser>, AdminConfigModel: Model<AdminConfig>): Router {
  const router = Router();

  const operations = generateCrudOperations(AdminConfigModel);
  const crudRoutes = generateCrudRoutes(operations);

  // router.use('/admin/auth', ...);
  router.use('/admin', getAdminPolicy(AdminConfigModel));
  router.use('/admin', crudRoutes);
  return router;
}

