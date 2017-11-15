// @flow
import { Router } from 'express';
import { Model } from 'mongoose';
import type { AdminConfig, AdminUser } from './admin.type';

export function getAdminPolicy(AdminUserModel: Model<AdminUser>, AdminConfigModel: Model<AdminConfig>): Router {
  const router = Router();


  return router;
}
