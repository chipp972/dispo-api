// @flow
import { Router, Request, Response, NextFunction } from 'express';
import EventEmitter from 'events';
import { initAdminAuthRoutes } from './admin/admin_auth.route.js';
import { initUserAuthRoutes } from './user/user_auth.route.js';
import { userCrudRoutes } from './user/user.route.js';
import { passportRoutes } from './passport.constant';
import type { Model } from 'mongoose';

type AuthRoutesOptions = {
  UserModel: Model,
  AdminUserModel: Model,
  apiEvents: EventEmitter
};
export function initAuthRoutes({
  UserModel,
  AdminUserModel,
  apiEvents
}: AuthRoutesOptions): Router {
  const router = Router();

  router.use('/', initAdminAuthRoutes(AdminUserModel));
  router.use('/', initUserAuthRoutes({ UserModel }));
  router.use('/api', userCrudRoutes({ UserModel, apiEvents }));

  // authentication failure route
  router.get(
    passportRoutes.failure.path,
    (req: Request, res: Response, next: NextFunction) => {
      res.status(401);
      const err = new Error('Not authenticated');
      next(err);
    }
  );

  return router;
}
