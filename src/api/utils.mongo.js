// @flow
import { Model, Schema } from 'mongoose';

export type CrudOperation = (id: number, data?: any) => Promise<any>;

export type CrudOperations<ModelT, DataT> = {
  getAll: () => Promise<ModelT[]>,
  getById: (id: Schema.Types.ObjectId) => Promise<ModelT>,
  create: (data: DataT) => Promise<ModelT>,
  edit: (id: Schema.Types.ObjectId, obj: any) => Promise<ModelT>,
  remove: (id: Schema.Types.ObjectId) => Promise<ModelT>
};

/**
 * generate mongoose operations
 */
type MongooseCrudGenerator<T, T2> = (model: Model<T>) => CrudOperations<T, T2>;

export const generateCrudOperations: MongooseCrudGenerator<*, *> = <ModelT, DataT>(
  model
): CrudOperations<ModelT, DataT> => ({
  getAll: async (): Promise<ModelT[]> => {
    try {
      const objList = await model.find({});
      return objList;
    } catch (err) {
      throw err;
    }
  },
  getById: async (id: string): Promise<ModelT> => {
    try {
      const obj = await model.findById(id);
      return obj;
    } catch (err) {
      throw err;
    }
  },
  create: async (data: DataT): Promise<ModelT> => {
    try {
      const obj = await model.create(data);
      return obj;
    } catch (err) {
      throw err;
    }
  },
  edit: async (id: string, data: ModelT): Promise<ModelT> => {
    try {
      const obj = await model.findByIdAndUpdate(id, data);
      return obj;
    } catch (err) {
      throw err;
    }
  },
  remove: async (id: string): Promise<ModelT> => {
    try {
      const obj = await model.findByIdAndRemove(id);
      return obj;
    } catch (err) {
      throw err;
    }
  }
});
