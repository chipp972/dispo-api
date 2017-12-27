// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import { generateCrudRoutes } from '../../service/express/utils.route';
import { generateCrudOperations } from '../../service/mongodb/utils.mongo';

export function initCompanyTypeRoutes(CompanyTypeModel: Model): Router {
  const router = Router();

  const operations = generateCrudOperations(CompanyTypeModel);
  const routes = generateCrudRoutes(operations);

  router.use('/companytype', routes);
  return router;
}
