// @flow
export type AdminData = {
  email: string,
};

export interface Admin extends AdminData {
  _id: string,
  code: string,
  createAt: Date,
  expireAt?: Date
};

