import { Sequelize } from 'sequelize';
import { MySQLBrandRepository } from './infras/repository/sequelize';
import { CreateBrandCmdHandler } from './usecase/create-brand';
import { UpdateBrandCmdHandler } from './usecase/update-brand';
import { DeleteBrandCmdHandler } from './usecase/delete-brand';
import { GetDetailBrandQueryHandler } from './usecase/get-detail-brand';
import { GetListBrandQueryHandler } from './usecase/get-list-brand';
import { init } from './infras/repository/sequelize/dto';
import { BrandHttpService } from './infras/transport';
import { Router } from 'express';

export const setupBrandHexagonal = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MySQLBrandRepository(sequelize);
  const createBrandUseCase = new CreateBrandCmdHandler(repository);
  const updateBrandUseCase = new UpdateBrandCmdHandler(repository);
  const deleteBrandUseCase = new DeleteBrandCmdHandler(repository);
  const getDetailBrandUseCase = new GetDetailBrandQueryHandler(repository);
  const listBrandUseCase = new GetListBrandQueryHandler(repository);

  const httpService = new BrandHttpService(
    createBrandUseCase,
    updateBrandUseCase,
    deleteBrandUseCase,
    getDetailBrandUseCase,
    listBrandUseCase,
  );

  const router = Router();
  router.post('/brands', httpService.createBrand.bind(httpService));
  router.patch('/brands/:id', httpService.updateBrand.bind(httpService));
  router.delete('/brands/:id', httpService.deleteBrand.bind(httpService));
  router.get('/brands/:id', httpService.getDetailBrand.bind(httpService));
  router.get('/brands', httpService.listBrand.bind(httpService));

  return router;
};
