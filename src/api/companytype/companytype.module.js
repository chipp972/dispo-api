// @flow
import { companyTypeCrudRoute } from './companytype.route';
import { getCompanyTypeModel } from './companytype.mongo';
import { Module, getRegistrySingleton } from 'singleton-module-registry';

export const registerCompanyTypeModule = (): Module => {
  const registry = getRegistrySingleton();
  const { env, mongodb } = registry.getModules(['env', 'mongodb']);
  const isAuthenticationActivated = env.auth.isAuthenticationActivated;
  const CompanyTypeModel = getCompanyTypeModel(mongodb);

  const router = companyTypeCrudRoute({
    CompanyTypeModel,
    isAuthenticationActivated,
  });

  const module = {
    required: ['env', 'mongodb'],
    id: 'companyType',
    event: {
      eventNames: ['created', 'updated', 'removed'],
      emitter: CompanyTypeModel,
    },
    model: CompanyTypeModel,
    router,
  };

  registry.registerModule(module);
  return module;
};
