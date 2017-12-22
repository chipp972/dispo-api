// @flow
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendPasswordlessAuthMail } from '../../service/mail/smtp';
import { formatResponse } from '../../service/express/utils.route';
import env from '../../config/env';
import { generate } from 'shortid';
import moment from 'moment-timezone';
import type { Model } from 'mongoose';
import type { AuthResponse, PasswordLessStartRes } from './auth';

moment.locale('fr');

export function initAdminAuthRoutes(UserModel: Model, AdminUserModel: Model) {
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
        return formatResponse(
          res,
          200,
          ({ email: admin.email }: PasswordLessStartRes)
        );
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
        const expireAt = moment().add(
          env.auth.admin.sessionExpiration,
          'seconds'
        );

        const admin = await AdminUserModel.findOneAndUpdate(
          { email, code },
          { $set: { expireAt } }
        );
        if (!admin) {
          return formatResponse(res, 403, { message: 'unauthorized' });
        }
        const token = jwt.sign(admin.toJSON(), env.auth.secretOrKey);
        return formatResponse(
          res,
          200,
          ({
            tokenId: admin._id,
            token,
            expireAt: expireAt.format()
          }: AuthResponse)
        );
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
