// @flow
import test from 'tape';
import express, { Response } from 'express';
import request from 'supertest';
import { mockedModel, mockedStore } from './crud.mock';
import crud from '../crud';

const app = express();

const testCrudRoutes = crud({
  model: mockedModel
});

app.use('/test', testCrudRoutes);

test('getAll operation on crud route', t => {
  request(app)
    .get('/test')
    .then((res: Response) => {
      const { success, data } = res.body;
      t.equal(data, mockedStore);
      t.ok(success);
      t.equal(res.status, 200);
      t.end();
    })
    .catch((err: Error) => t.fail(err));
});

test('getAll operation on crud route', t => {
  request(app)
    .get('/test')
    .then((res: Response) => {
      const { success, data } = res.body;
      t.equal(data, mockedStore);
      t.ok(success);
      t.equal(res.status, 200);
      t.end();
    })
    .catch((err: Error) => t.fail(err));
});
