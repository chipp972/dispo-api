// @flow
import { Document } from 'mongoose';
import { companyPopularityCrudRoute } from './popularity.route';
import { getCompanyPopularityModel } from './popularity.mongo';
import { Module, getRegistrySingleton } from 'singleton-module-registry';

export const registerPopularityModule = (): Module => {
  const registry = getRegistrySingleton();
  const { env, mongodb, company, user } = registry.getModules([
    'env',
    'mongodb',
    'company',
    'user',
  ]);
  const isAuthenticationActivated = env.auth.isAuthenticationActivated;
  const CompanyPopularityModel = getCompanyPopularityModel({
    mongooseConnection: mongodb,
    UserModel: user.model,
    CompanyModel: company.model,
  });

  const router = companyPopularityCrudRoute({
    CompanyPopularityModel,
    isAuthenticationActivated,
  });

  const module = {
    required: ['env', 'mongodb', 'company', 'user'],
    id: 'companyPopularity',
    event: {
      eventNames: ['created', 'updated', 'removed'],
      emitter: CompanyPopularityModel,
    },
    model: CompanyPopularityModel,
    router,
  };

  registry.on('company:removed', async (company: { _id: string }) => {
    const companyPopularities = await CompanyPopularityModel.find({
      companyId: company._id,
    });
    companyPopularities.forEach((companyPopularity: Document) =>
      companyPopularity.remove()
    );
  });

  registry.registerModule(module);
  return module;
};
