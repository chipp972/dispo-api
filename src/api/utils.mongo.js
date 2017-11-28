// @flow
import { Model } from 'mongoose';

export type ReqUser = { _id: string, role?: string };

export type CrudOptions = {
  id?: string,
  data?: any,
  user?: ReqUser
};

export type CrudOperation = CrudOptions => Promise<any>;

export type CrudOperations<ModelT, DataT> = {
  getAll: () => Promise<ModelT[]>,
  getById: ({ id: string }) => Promise<ModelT>,
  create: ({ data: DataT }) => Promise<ModelT>,
  edit: ({ id: string, data: any, user: ReqUser }) => Promise<ModelT>,
  remove: ({ id: string, user: ReqUser }) => Promise<ModelT>
};

type MongooseCrudGenerator<T, T2> = (model: Model<T>) => CrudOperations<T, T2>;

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
      await model.updateOne(
        { _id: id },
        { $set: { data } },
        {
          runSettersOnQuery: true
        }
      );
      return obj;
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
      await model.remove({ _id: id });
      return obj;
    } catch (err) {
      throw err;
    }
  }
});
