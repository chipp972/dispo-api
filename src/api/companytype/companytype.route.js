// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import type { CompanyType } from './companytype.type';
import { generateCrudRoutes } from '../utils.route';
import { generateCrudOperations } from '../utils.mongo';

export function initCompanyTypeRoutes(CompanyTypeModel: Model<CompanyType>): Router {
  const router = Router();

  const operations = generateCrudOperations(CompanyTypeModel);
  const routes = generateCrudRoutes(operations);

  router.use('/companytype', routes);
  return router;
}
