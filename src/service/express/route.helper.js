// @flow
import { Request, Response, NextFunction } from 'express';

type FormatResponseOptions = {
  res: Response,
  success?: boolean,
  status?: number,
  data?: any
};

export const formatResponse = (options: FormatResponseOptions): void =>
  options.res
    .status(options.status || 200)
    .contentType('application/json')
    .json({
      success: options.success ? options.success : true,
      data: options.data
    });

export const handleUnauthorized = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  formatResponse({
    res,
    success: false,
    status: 403,
    data: { message: 'unauthorized access' }
  });
