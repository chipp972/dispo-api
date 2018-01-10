// @flow
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendPasswordlessAuthMail } from '../../../service/mail/smtp';
import env from '../../../config/env';
import { generate } from 'shortid';
import moment from 'moment-timezone';
import { passportRoutes } from '../passport.constant';
import { handleUnauthorized } from '../../express/route.helper';
import type { Model } from 'mongoose';
import type { AuthResponse, PasswordLessStartResponse } from './admin';

moment.locale('fr');

export function initAdminAuthRoutes(AdminUserModel: Model) {
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
        const data: PasswordLessStartResponse = { email: admin.email };
        return res.status(200).json({
          success: true,
          data
        });
      } catch (err) {
        // catch invalid mail recipient or format errors
        next(err);
      }
    }
  );

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
        if (!admin) {
          res.status(403);
          return next(new Error('unauthorized access'));
        }
        const token = jwt.sign(admin.toJSON(), env.auth.secretOrKey, {
          expiresIn: env.auth.admin.sessionExpiration
        });
        const data: AuthResponse = {
          tokenId: admin._id,
          token,
          expireAt: expireAt.unix()
        };
        return res.status(200).json({
          success: true,
          data
        });
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
        return res.status(200).json({ success: true });
      } catch (err) {
        next(err);
      }
    });

  return router;
}
