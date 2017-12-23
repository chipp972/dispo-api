// @flow
import { Model } from 'mongoose';
import type { ReqUser, CrudOperations, MongooseCrudGenerator } from './mongodb';

export const isUserAuthorized = (obj: any, user: ReqUser): boolean =>
  user.role === 'admin' || obj.owner === user._id;

/**
 * generate mongoose operations
 * @param {Model} model
 * @return {CrudOperations}
 */
export const generateCrudOperations: MongooseCrudGenerator<*, *> = <
  ModelT,
  DataT
>(
  model: Model
): CrudOperations<ModelT, DataT> => ({
  getAll: async (): Promise<ModelT[]> => {
    try {
      const objList = await model.find({});
      return objList;
    } catch (err) {
      throw err;
    }
  },
  getById: async ({ id }): Promise<ModelT> => {
    try {
      const obj = await model.findById(id);
      return obj;
    } catch (err) {
      throw err;
    }
  },
  create: async ({ data }): Promise<ModelT> => {
    try {
      const obj = await model.create(data);
      return obj;
    } catch (err) {
      throw err;
    }
  },
  edit: async ({ id, data, user }): Promise<ModelT> => {
    try {
      const obj = await model.findById(id);
      if (!isUserAuthorized(obj, user)) {
        throw new Error('unauthorized operation');
      }
      await obj.update({ $set: data });
      const newObj = await model.findById(id);
      return newObj;
    } catch (err) {
      throw err;
    }
  },
  remove: async ({ id, user }): Promise<ModelT> => {
    try {
      const obj = await model.findById(id);
      if (!isUserAuthorized(obj, user)) {
        throw new Error('unauthorized operation');
      }
      await obj.remove();
      return obj;
    } catch (err) {
      throw err;
    }
  }
});
