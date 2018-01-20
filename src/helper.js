// @flow
import { unlink } from 'fs';
import { map, dissoc } from 'ramda';

export const filterProperty = (prop: string, obj: any) =>
  Array.isArray(obj) ? map(dissoc(prop), obj) : dissoc(prop, obj);

export const deleteFile = (path: string) =>
  new Promise((resolve, reject) => {
    return unlink(path, (err: Error) => (err ? reject(err) : resolve()));
  });
