// @flow
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendPasswordlessAuthMail } from '../../../service/mail/smtp';
import { formatResponse } from '../../../service/express/utils.route';
import env from '../../../config/env';
import { generate } from 'shortid';
import moment from 'moment-timezone';
import { passportRoutes } from '../passport.constant';
import type { Model } from 'mongoose';
import type { AuthResponse, PasswordLessStartResponse } from './admin';

moment.locale('fr');

export function initAdminAuthRoutes(UserModel: Model, AdminUserModel: Model) {
  const router = Router();
  router.post(
    passportRoutes.admin.sendCode.path,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.body;
        const code: string = generate();
        const limitDate = moment().add(env.auth.admin.validDuration, 'seconds');
        await AdminUserModel.remove({ email }); // clear all admin sessions
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
          ({ email: admin.email }: PasswordLessStartResponse)
        );
      } catch (err) {
        // catch invalid mail recipient or format errors
        next(err);
      }
    }
  );

  const handleUnauthorized = (req: Request, res: Response) =>
    formatResponse(res, 403, { message: 'unauthorized access' });

  router
    .route(passportRoutes.admin.authenticate.path)
    .post(async (req: Request, res: Response, next: NextFunction) => {
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
        if (!admin) return next();
        const token = jwt.sign(admin.toJSON(), env.auth.secretOrKey);
        return formatResponse(
          res,
          200,
          ({
            tokenId: admin._id,
            token,
            expireAt: expireAt.unix()
          }: AuthResponse)
        );
      } catch (err) {
        next(err);
      }
    })
    .post(handleUnauthorized);

  router
    .route(passportRoutes.admin.logout.path)
    .post(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { tokenId } = req.body;
        await AdminUserModel.findByIdAndRemove(tokenId);
        return formatResponse(res, 200, {});
      } catch (err) {
        next(err);
      }
    });

  return router;
}
