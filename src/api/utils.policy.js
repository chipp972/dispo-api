// @flow
import { Request, Response, NextFunction, Router } from 'express';
import type { CrudPolicies } from './utils.mongo';

export const checkPolicy = () => async (req, res, next) => {
  try {
    const { user } = req;
  } catch (err) {
    return next(err);
  }
};
