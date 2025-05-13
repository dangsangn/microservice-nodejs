import { UserRole } from '@/share/interface';
import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { MySQLUserRepository } from './infras/repository/mysql';
import { init, modelName } from './infras/repository/mysql/dto';
import { UserHTTPService } from './infras/transport';
import { UserUseCase } from './usecase';
import { ServiceContext } from '@/share/interface/service-context';

export const setupUserHexagon = (sequelize: Sequelize, sctx: ServiceContext) => {
  init(sequelize);

  const repository = new MySQLUserRepository(sequelize, modelName);
  const useCase = new UserUseCase(repository);
  const httpService = new UserHTTPService(useCase);

  const router = Router();
  const mdlFactory = sctx.mdlFactory;
  const adminChecker = mdlFactory.allowRoles([UserRole.ADMIN]);

  router.post('/register', httpService.registerAPI.bind(httpService));
  router.post('/authenticate', httpService.loginAPI.bind(httpService));
  router.get('/profile', httpService.profileAPI.bind(httpService));

  router.post('/users', mdlFactory.auth, adminChecker, httpService.createApi.bind(httpService));
  router.get('/users/:id', httpService.getDetailApi.bind(httpService));
  router.get('/users', httpService.listApi.bind(httpService));
  router.patch('/users/:id', mdlFactory.auth, adminChecker, httpService.updateApi.bind(httpService));
  router.delete('/users/:id', mdlFactory.auth, adminChecker, httpService.deleteApi.bind(httpService));

  // RPC API (use internally)
  router.post('/rpc/introspect', httpService.introspectAPI.bind(httpService));
  return router;
};
