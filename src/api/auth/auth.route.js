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

moment.locale('fr');

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
        const limitDate = moment().add(env.auth.admin.validDuration, 'seconds');
        await AdminUserModel.remove({ email });
        await sendPasswordlessAuthMail(
          code,
          limitDate.tz('Europe/Paris').format('LT')
        )(email);
        const admin = await AdminUserModel.create({
          email,
          code,
          expireAt: limitDate
        });
        return formatResponse(res, 200, { email: admin.email });
      } catch (err) {
        // catch invalid mail recipient or format errors
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
        const token = jwt.sign(admin, env.auth.secretOrKey);
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
      console.log(req.user);
      next();
    }
  );

  return router;
}
