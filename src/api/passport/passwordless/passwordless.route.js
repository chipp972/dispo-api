// @flow
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendPasswordlessAuthMail } from './passwordless.helper';
import { generate } from 'shortid';
import moment from 'moment-timezone';
import type { Model } from 'mongoose';

export type AuthResponse = {
  tokenId: string,
  token: string,
  expireAt: string,
};

export type PasswordLessStartResponse = {
  email: string,
};

type Options = {
  PasswordLessCredentialsModel: Model,
  sendMail: (
    subject: string,
    html: string
  ) => (to: string | string[]) => Promise<any>,
  validDuration: number,
  tokenExpiration: number,
  secretOrKey: string,
  handleUnauthorized: (Request, Response, NextFunction) => any,
  routes: { sendCode: string, authenticate: string, logout: string },
};

export function initPasswordLessRoutes({
  PasswordLessCredentialsModel,
  sendMail,
  validDuration,
  tokenExpiration,
  secretOrKey,
  handleUnauthorized,
  routes,
}: Options) {
  moment.locale('fr');
  const router = Router();
  router
    .route(routes.sendCode)
    .post(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.body;
        const code: string = generate();
        const limitDate = moment().add(validDuration, 'seconds');
        // create temporary session
        await PasswordLessCredentialsModel.create({
          email,
          code,
          expireAt: limitDate,
        });
        // send mail
        await sendPasswordlessAuthMail({
          code,
          limitDate: limitDate.tz('Europe/Paris').format('LT'),
          recipient: email,
          sendMail,
        });
        const data: PasswordLessStartResponse = { email };
        return res.status(200).json({
          success: true,
          data,
        });
      } catch (err) {
        next(err); // catch invalid mail recipient or format errors
      }
    });

  router
    .route(routes.authenticate)
    .post(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, code } = req.body;
        const expireAt = moment().add(tokenExpiration, 'seconds');

        const session = await PasswordLessCredentialsModel.findOneAndUpdate(
          { email, code },
          { $set: { expireAt } }
        );
        if (!session) return handleUnauthorized(req, res, next);
        const token = jwt.sign(session.toJSON(), secretOrKey, {
          expiresIn: tokenExpiration,
        });
        const data: AuthResponse = {
          tokenId: session._id,
          token,
          expireAt: expireAt.unix(),
        };
        return res.status(200).json({
          success: true,
          data,
        });
      } catch (err) {
        next(err);
      }
    })
    .post(handleUnauthorized);

  router
    .route(routes.logout)
    .post(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { tokenId } = req.body;
        await PasswordLessCredentialsModel.findByIdAndRemove(tokenId);
        return res.status(200).json({ success: true });
      } catch (err) {
        next(err);
      }
    });

  return router;
}
