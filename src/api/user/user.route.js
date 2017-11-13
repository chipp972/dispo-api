// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import type { User } from './user.type';
import { generateCrudRoutes } from '../utils.route';
import { generateCrudOperations } from '../utils.mongo';

export function initUserRoutes(UserModel: Model<User>): Router {
  const router = Router();

  const operations = generateCrudOperations(UserModel);
  const routes = generateCrudRoutes(operations);

  router.use('/user', routes);
  return router;
}
