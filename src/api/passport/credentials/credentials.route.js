// @flow
import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { isValidPassword } from './credentials.helper';
import type { Model } from 'mongoose';
import { crud } from 'another-express-crud';
import { mongooseCrudConnector } from 'crud-mongoose-connector';

type Options = {
  secretOrKey: string,
  tokenExpiration: number,
  routes: { register: string, login: string },
  UserModel: Model,
  CredentialsModel: Model,
  userRouterConfig: any,
  formatResponse: (any) => any,
  handleUnauthorized: (req: Request, res: Response, next: NextFunction) => any,
  createNewAuthenticationFailedError: () => Error,
};

export const initCredentialsRoutes = ({
  secretOrKey,
  tokenExpiration,
  UserModel,
  CredentialsModel,
  formatResponse,
  handleUnauthorized,
  createNewAuthenticationFailedError,
  userRouterConfig,
  routes,
}: Options): Router => {
  const router = Router();

  // register route
  router
    .route(routes.register)
    .post(async (req: Request, res: Response, next: NextFunction) => {
      try {
        delete req.body.role; // prevent anybody from gaining admin privileges
        const credentials = await CredentialsModel.create(req.body);
        try {
          const user = await UserModel.create(req.body);
          return formatResponse({
            res,
            data: user,
            status: 201,
          });
        } catch (err) {
          credentials.remove();
          return next(err);
        }
      } catch (err) {
        next(err);
      }
    });

  // login route
  router
    .route(routes.login)
    .post(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const credentials = await CredentialsModel.findOne({ email });
        if (!credentials) return next(createNewAuthenticationFailedError());
        const isValid = await isValidPassword(credentials.password, password);
        if (!isValid) return next(createNewAuthenticationFailedError());
        const token = jwt.sign(credentials.toJSON(), secretOrKey, {
          expiresIn: tokenExpiration,
        });
        const user = await UserModel.findOne({ email });
        const data = {
          tokenId: user._id,
          token,
          expireAt: moment()
            .add(tokenExpiration, 'seconds')
            .unix(),
        };
        return formatResponse({ res, data, status: 200 });
      } catch (err) {
        next(err);
      }
    })
    .post(handleUnauthorized);

  const crudModel = mongooseCrudConnector(CredentialsModel);

  router.use(
    '/api',
    crud({
      ...userRouterConfig,
      hooks: {
        before: {
          create: async ({ data }) => {
            try {
              await crudModel.create({ data });
              return { success: true };
            } catch (error) {
              return { success: false, error };
            }
          },
          update: async ({ id, data }) => {
            try {
              await crudModel.update({ id, data });
              return { success: true };
            } catch (error) {
              return { success: false, error };
            }
          },
        },
      },
    })
  );

  return router;
};
