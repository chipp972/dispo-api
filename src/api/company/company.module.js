// @flow
import { Document } from 'mongoose';
import { companyCrudRoute } from './company.route';
import { getCompanyModel } from './company.mongo';
import { Module, getRegistrySingleton } from 'singleton-module-registry';
import type { Company } from './company.mongo';

export const registerCompanyModule = (): Module => {
  const registry = getRegistrySingleton();
  const {
    env,
    mongodb,
    cloud,
    logger,
    mapUtil,
    user,
    companyType,
  } = registry.getModules([
    'env',
    'mongodb',
    'cloud',
    'logger',
    'mapUtil',
    'user',
    'companyType',
  ]);
  const { isAuthenticationActivated } = env.auth;
  const CompanyModel = getCompanyModel({
    mongooseConnection: mongodb,
    UserModel: user.model,
    CompanyTypeModel: companyType.model,
    allowEarlyRefresh: env.allowEarlyRefresh,
    getGeocode: mapUtil.getGeocode,
    deleteImage: cloud.deleteImage,
  });

  const router = companyCrudRoute({
    CompanyModel,
    isAuthenticationActivated,
    switchToUnavailableDelay: env.switchToUnavailableDelay,
    saveImage: cloud.saveImage,
    deleteImage: cloud.deleteImage,
    LOGGER: logger,
    maxCompanyNumber: env.maxCompanyNumber,
  });

  const module = {
    required: [
      'env',
      'mongodb',
      'cloud',
      'logger',
      'mapUtil',
      'user',
      'companyType',
    ],
    id: 'company',
    event: {
      eventNames: ['created', 'updated', 'removed'],
      emitter: CompanyModel,
    },
    model: CompanyModel,
    router,
  };

  // on user delete also delete all his companies
  registry.on('user:removed', async (user: { _id: string }) => {
    const companies = await CompanyModel.find({ owner: user._id });
    companies.forEach((company: Document) => company.remove());
  });

  // delete cloud image when deleting a company
  CompanyModel.on('removed', async (company: Company) => {
    try {
      const { imageCloudId } = company;
      if (imageCloudId) await cloud.deleteImage({ publicId: imageCloudId });
    } catch (err) {
      logger.error(err);
    }
  });

  // when deleting companyType, also delete companies having this company type
  registry.on('companyType:removed', async (companyType: { _id: string }) => {
    const companies = await CompanyModel.find({ type: companyType._id });
    companies.forEach((company: Document) => company.remove());
  });

  registry.registerModule(module);
  return module;
};
