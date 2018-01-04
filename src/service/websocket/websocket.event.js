// @flow

const crudEvents = (modelName: string) => {
  const name = modelName.toUpperCase();
  return {
    created: `CREATE_${name}`,
    updated: `EDIT_${name}`,
    deleted: `REMOVE_${name}`
  };
};

export const EVENTS = {
  USER: crudEvents('user'),
  COMPANY: crudEvents('company'),
  COMPANY_TYPE: crudEvents('companytype'),
  COMPANY_POPULARITY: crudEvents('companypopularity')
};
