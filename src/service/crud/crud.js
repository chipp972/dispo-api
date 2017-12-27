// @flow
import { Model } from 'mongoose';
import { generateCrudOperations } from './crud.mongo';
import { generateCrudRoutes } from './crud.route';

export type CrudGenOptions = {
  model: Model
};

const crud = (options: CrudGenOptions) => {
  const operations = generateCrudOperations(options.model);
  const routes = generateCrudRoutes({ operation: operations });
  return routes;
};

export default crud;
