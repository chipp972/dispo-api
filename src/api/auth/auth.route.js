// @flow
import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { formatResponse } from '../../service/express/utils.route';
import { initAdminAuthRoutes } from './admin_auth.route.js';
import type { Model } from 'mongoose';

export function initAuthRoutes(
  UserModel: Model,
  AdminUserModel: Model
): Router {
  const router = Router();

  router.use('/', initAdminAuthRoutes(UserModel, AdminUserModel));

  // failure route
  router.get('/auth/failure', (req, res, next) =>
    formatResponse(
      res,
      401,
      {
        message: 'Failed to authenticate'
      },
      false
    )
  );

  // passport validation on all other routes
  router.use(
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/auth/failure'
    }),
    (req: Request, res: Response, next: NextFunction) => {
      console.log(req.user);
      next();
    }
  );

  return router;
}
