// @flow
import { Router, Request, Response, NextFunction } from 'express';
import { initAdminAuthRoutes } from './admin/admin_auth.route.js';
import type { Model } from 'mongoose';

export function initAuthRoutes(
  UserModel: Model,
  AdminUserModel: Model
): Router {
  const router = Router();

  router.use('/', initAdminAuthRoutes(UserModel, AdminUserModel));

  // authentication failure route
  router.get('/failure', (req: Request, res: Response, next: NextFunction) => {
    res.status(401);
    const err = new Error('Not authenticated');
    next(err);
  });

  return router;
}
