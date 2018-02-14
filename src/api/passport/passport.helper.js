// @flow
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedAccessError } from './passport.error';

type FormatResponseOptions = {
  res: Response,
  success?: boolean,
  status?: number,
  data?: any,
};

export const formatResponse = (options: FormatResponseOptions): void =>
  options.res
    .status(options.status || 200)
    .contentType('application/json')
    .json({
      success: options.success ? options.success : true,
      data: options.data,
    });

export const handleUnauthorized = (
  req: Request,
  res: Response,
  next: NextFunction
) => next(new UnauthorizedAccessError());

export const errorHandlerWrapper = (
  middleware: (Request, Response, NextFunction) => any
) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await middleware(req, res, next);
  } catch (err) {
    next(err);
  }
};
