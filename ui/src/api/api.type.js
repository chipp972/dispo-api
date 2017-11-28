// @flow
import type {
  AuthResponse,
  PasswordLessStartRes
} from '../../../src/api/auth/auth.type';

export type AdminLogin = {
  sendCode: (email: string) => Promise<PasswordLessStartRes>,
  authenticate: (username: string, password: string) => Promise<AuthResponse>
};

export type CrudOperations<Data, Model> = {
  getAll: () => Promise<Model[]>,
  get: (id: string) => Promise<Model>,
  create: (data: Data) => Promise<Model>,
  edit: (id: string, field: any) => Promise<Model>,
  remove: (id: string) => Promise<Model>
};
