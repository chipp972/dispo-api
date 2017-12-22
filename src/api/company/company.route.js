// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import { generateCrudRoutes } from '../../service/express/utils.route';
import { generateCrudOperations } from '../../service/mongodb/utils.mongo';
import type { CrudOperations } from '../../service/mongodb/mongodb';
import type { Company, CompanyData } from './company';

/**
 * init express route for company
 * @param {Model} CompanyModel
 * @return {Router}
 */
export function initCompanyRoutes(CompanyModel: Model<Company>): Router {
  const router = Router();

  const operations: CrudOperations<
    CompanyData,
    Company
  > = generateCrudOperations(CompanyModel);
  const routes = generateCrudRoutes(operations);

  router.use('/company', routes);

  return router;
}
