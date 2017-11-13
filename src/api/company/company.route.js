// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import type { Company } from './company.type';
import { generateCrudRoutes } from '../utils.route';
import { generateCrudOperations } from '../utils.mongo';

/**
 * init express route for company
 */
export function initCompanyRoutes(CompanyModel: Model<Company>): Router {
  const router = Router();

  const operations = generateCrudOperations(CompanyModel);
  const routes = generateCrudRoutes(operations);

  router.use('/company', routes);

  return router;
}
