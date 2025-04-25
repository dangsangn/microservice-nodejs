import { Sequelize } from 'sequelize';
import { init, modelName } from './infras/repository/dto';
import { MySQLCategoryRepository } from './infras/repository';
import { CategoryUseCase } from './usecase';
import { CategoryHttpService } from './infras/transport';
import { Router } from 'express';

export const setupCategoryHexagonal = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MySQLCategoryRepository(sequelize, modelName);
  const useCase = new CategoryUseCase(repository);
  const httpService = new CategoryHttpService(useCase);

  const router = Router();
  router.post('', httpService.createCategory.bind(httpService));
  router.patch('/:id', httpService.updateCategory.bind(httpService));
  router.delete('/:id', httpService.deleteCategory.bind(httpService));
  router.get('/:id', httpService.getDetailCategory.bind(httpService));
  router.get('', httpService.listCategory.bind(httpService));

  return router;
};
