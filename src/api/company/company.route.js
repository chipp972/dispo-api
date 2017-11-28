// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import type { Company, CompanyData } from './company.type';
import { generateCrudRoutes } from '../utils.route';
import { generateCrudOperations } from '../utils.mongo';
import type { CrudOperations } from '../utils.mongo';

/**
 * init express route for company
 * @param {Model} CompanyModel
 * @return {Router}
 */
export function initCompanyRoutes(CompanyModel: Model<Company>): Router {
  const router = Router();

  const operations: CrudOperations<CompanyData,
    Company> = generateCrudOperations(CompanyModel);
  const routes = generateCrudRoutes(operations);

  router.use('/company', routes);

  return router;
}
