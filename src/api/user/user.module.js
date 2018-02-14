// @flow
import { UserCrudConfig } from './user.route';
import { getUserModel } from './user.mongo';
import { Module, getRegistrySingleton } from 'singleton-module-registry';
import { crud } from 'another-express-crud';

export const registerUserModule = (): Module => {
  const registry = getRegistrySingleton();
  const { env, mongodb } = registry.getModules(['env', 'mongodb']);
  const isAuthenticationActivated = env.auth.isAuthenticationActivated;

  const UserModel = getUserModel(mongodb);

  const routerConfig = UserCrudConfig({
    UserModel,
    isAuthenticationActivated,
  });
  const router = crud(routerConfig);

  const module = {
    required: ['env', 'mongodb'],
    id: 'user',
    event: {
      eventNames: ['created', 'updated', 'removed'],
      emitter: UserModel,
    },
    model: UserModel,
    router,
    routerConfig,
  };

  registry.registerModule(module);
  return module;
};
