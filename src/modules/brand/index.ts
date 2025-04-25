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
  router.post('', httpService.createBrand.bind(httpService));
  router.patch('/:id', httpService.updateBrand.bind(httpService));
  router.delete('/:id', httpService.deleteBrand.bind(httpService));
  router.get('/:id', httpService.getDetailBrand.bind(httpService));
  router.get('', httpService.listBrand.bind(httpService));

  return router;
};
