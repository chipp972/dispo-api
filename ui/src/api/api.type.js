// @flow

type PasswordLessStartRes = {
  email: string,
  email_verified: boolean,
  _id: string
};

type TokenRes = {
  tokenId: string,
  token: string,
}

export type AdminLogin = {
  sendCode: (email: string) => Promise<PasswordLessStartRes>,
  authenticate: (username: string, password: string) => Promise<TokenRes>
};

export type CrudOperations<Data, Model> = {
  getAll: () => Promise<Model[]>,
  get: (id: string) => Promise<Model>,
  create: (data: Data) => Promise<Model>,
  edit: (id: string, field: any) => Promise<Model>,
  remove: (id: string) => Promise<Model>
};
