// @flow
import { Router, Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import { sendPasswordlessAuthMail } from '../../config/mail/smtp';
import passport from 'passport';
import { formatResponse } from '../utils.route';
import env from '../../config/env';
import { generate } from 'shortid';
import moment from 'moment';

export function initAuthRoutes(
  UserModel: Model,
  AdminUserModel: Model
): Router {
  const router = Router();

  router.post(
    '/admin/auth/start',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.body;
        const code: string = generate();
        await AdminUserModel.remove({ email });
        await sendPasswordlessAuthMail(code)(email);
        const admin = await AdminUserModel.create({
          email,
          code,
          expireAt: moment().add(env.auth.admin.validDuration, 'seconds')
        });
        return formatResponse(res, 200, { email: admin.email });
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/admin/auth/authenticate',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, code } = req.body;
        const admin = await AdminUserModel.findOneAndUpdate(
          { email, code },
          {
            $set: {
              expireAt: moment().add(
                env.auth.admin.sessionExpiration,
                'seconds'
              )
            }
          }
        );
        if (!admin) {
          return formatResponse(res, 403, { message: 'unauthorized' });
        }
        const token = jwt.sign(
          { ...admin, role: 'admin' },
          env.auth.secretOrKey,
        );
        return formatResponse(res, 200, { tokenId: admin._id, token });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get('/auth/failure', (req, res, next) => {
    return formatResponse(
      res,
      401,
      {
        message: 'Failed to authenticate'
      },
      false
    );
  });

  router.use(
    passport.authenticate('jwt', {
      session: false,
      failureRedirect: '/auth/failure'
    }),
    (req: Request, res: Response, next: NextFunction) => {
      console.log();
      next();
    }
  );

  return router;
}
