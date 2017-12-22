// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import type { AdminUser } from './admin';

export function getAdminPolicy(
  AdminUserModel: Model<AdminUser>,
): Router {
  const router = Router();

  return router;
}
