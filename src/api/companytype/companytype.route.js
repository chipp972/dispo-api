// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import { generateCrudRoutes } from '../../service/express/utils.route';
import { generateCrudOperations } from '../../service/mongodb/utils.mongo';
import type { CompanyType } from './companytype';

export function initCompanyTypeRoutes(
  CompanyTypeModel: Model<CompanyType>
): Router {
  const router = Router();

  const operations = generateCrudOperations(CompanyTypeModel);
  const routes = generateCrudRoutes(operations);

  router.use('/companytype', routes);
  return router;
}
