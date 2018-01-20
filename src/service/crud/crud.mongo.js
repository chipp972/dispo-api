// @flow
import { Model } from 'mongoose';
import type { CrudOperations, MongooseCrudGenerator } from './crud.type';

export const toRawObject = (obj: any) => (obj.toObject ? obj.toObject() : obj);

export const toRawObjectList = (arr: any[]) => arr.map(toRawObject);

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
    return toRawObjectList(objList);
  },
  getById: async ({ id }): Promise<*> => {
    const obj = await model.findById(id);
    return toRawObject(obj);
  },
  create: async ({ data }): Promise<*> => {
    const obj = await model.create(data);
    return toRawObject(obj);
  },
  update: async ({ id, data, user }): Promise<*> => {
    const obj = await model.findById(id);
    delete data._id;
    delete data.__v;
    const newObj = Object.assign(obj, data);
    await newObj.save();
    return toRawObject(newObj);
  },
  delete: async ({ id, user }): Promise<*> => {
    const obj = await model.findById(id);
    await obj.remove();
    return toRawObject(obj);
  }
});
