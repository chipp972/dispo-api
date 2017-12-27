// @flow
import { Model } from 'mongoose';
import type { ReqUser, CrudOperations, MongooseCrudGenerator } from './crud';

export const isUserAuthorized = (obj: any, user: ReqUser): boolean =>
  user.role === 'admin' || obj.owner === user._id;

/**
 * generate mongoose operations
 * @param {Model} model
 * @return {CrudOperations}
 */
export const generateCrudOperations: MongooseCrudGenerator = (
  model: Model
): CrudOperations => ({
  getAll: async (): Promise<any[]> => {
    const objList = await model.find({});
    return objList;
  },
  getById: async ({ id }): Promise<*> => {
    const obj = await model.findById(id);
    return obj;
  },
  create: async ({ data }): Promise<*> => {
    const obj = await model.create(data);
    return obj;
  },
  edit: async ({ id, data }): Promise<*> => {
    const obj = await model.findById(id);
    delete data._id;
    delete data.__v;
    const newObj = Object.assign(obj, data);
    await newObj.save();
    return newObj;
  },
  remove: async ({ id }): Promise<*> => {
    const obj = await model.findById(id);
    await obj.remove();
    return obj;
  }
});
