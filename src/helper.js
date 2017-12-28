// @flow
import { map, dissoc } from 'ramda';

export const filterProperty = (prop: string, obj: any) =>
  Array.isArray(obj) ? map(dissoc(prop), obj) : dissoc(prop, obj);
