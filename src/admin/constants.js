// @flow
/**
 * Keys inside the database
 */
export const keys = {
  admin: {
    user: 'admin:user',
    config: 'admin:config'
  },
  userByEmail: 'userByEmail',
  companyByName: 'companyByName'
};

export const channels = {
  admin: 'admin',
  user: 'user',
  company: 'company'
};

export const actions = {
  admin: {
    getConfig: 'getConfig',
    setConfig: 'setConfig',
    update: 'update'
  },
  user: {
    getById: 'getById',
    set: 'set',
    update: 'udpate'
  },
  company: {
    getAll: 'getAll',
    getByLocation: 'getByLocation',
    set: 'set',
    update: 'update'
  }
};
