// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import { generateCrudRoutes } from '../../service/express/utils.route';
import { generateCrudOperations } from '../../service/mongodb/utils.mongo';
import type { User } from './user';

export function initUserRoutes(UserModel: Model<User>): Router {
  const router = Router();

  const operations = generateCrudOperations(UserModel);
  const routes = generateCrudRoutes(operations);

  router.use('/user', routes);

  return router;
}
