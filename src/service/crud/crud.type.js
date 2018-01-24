// @flow
import { Model } from 'mongoose';
import { Router, Request, Response, NextFunction } from 'express';
import EventEmitter from 'events';

export type CrudOptions = {
  id: string,
  data: any,
  user?: any,
  files?: { [filename: string]: { path: string } }
};

export type Middleware = (Request, Response, NextFunction) => any;

export type PreResult = {
  success: boolean,
  error?: Error
};

export type CrudOperation = CrudOptions => Promise<any>;

export type CrudOperations = {
  getAll: CrudOptions => Promise<any[]>,
  getById: CrudOptions => Promise<any>,
  create: CrudOptions => Promise<any>,
  update: CrudOptions => Promise<any>,
  delete: CrudOptions => Promise<any>
};

export type CrudAfterMiddleware = (result: *, req: Request) => Promise<*>;

export type CrudBeforeMiddleware = CrudOptions => Promise<PreResult>;

export type CrudAfterObject = {
  all?: CrudAfterMiddleware,
  getAll?: CrudAfterMiddleware,
  getById?: CrudAfterMiddleware,
  create?: CrudAfterMiddleware,
  update?: CrudAfterMiddleware,
  delete?: CrudAfterMiddleware
};

export type CrudBeforeObject = {
  all?: CrudAfterMiddleware,
  getAll?: CrudBeforeMiddleware,
  getById?: CrudBeforeMiddleware,
  create?: CrudBeforeMiddleware,
  update?: CrudBeforeMiddleware,
  delete?: CrudBeforeMiddleware
};

export type EventObject = {
  created?: string,
  updated?: string,
  deleted?: string
};

export type RouteGeneratorOptions = {
  operation: CrudOperation,
  status: number,
  before?: CrudBeforeMiddleware,
  after?: CrudAfterMiddleware,
  beforeAll?: CrudBeforeMiddleware,
  afterAll?: CrudAfterMiddleware,
  event?: string,
  emitter?: EventEmitter
};

export type MongooseCrudGenerator = (model: Model) => CrudOperations;

export type CrudGenOptions = {
  path?: string,
  model: Model,
  responseFormatter?: Middleware,
  before?: CrudBeforeObject,
  after?: CrudAfterObject,
  emitter?: EventEmitter,
  events?: EventObject
};

export type ExpressCrudGenerator = ({
  operations: CrudOperations,
  responseFormatter?: Middleware,
  before?: CrudBeforeObject,
  after?: CrudAfterObject,
  emitter?: EventEmitter,
  events?: EventObject
}) => Router;
