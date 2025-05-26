import { config } from '@/share/component/config';
import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { MySQLProductRepository } from './infras/repository/my-sql';
import { init } from './infras/repository/my-sql/dto';
import {
  ProductBrandProxyRepository,
  RPCProductBrandRepository,
  RPCProductCategoryRepository,
} from './infras/repository/rpc';
import { ProductHttpService } from './infras/transport';
import { ProductUseCase } from './usecase';

export const setupProductHexagonal = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MySQLProductRepository(sequelize);
  const productUseCase = new ProductUseCase(repository);
  const productBrandRepository = new RPCProductBrandRepository(config.rpc.productBrand);
  const productBrandProxyRepository = new ProductBrandProxyRepository(productBrandRepository);
  const productCategoryRepository = new RPCProductCategoryRepository(config.rpc.productCategory);

  const httpService = new ProductHttpService(
    productUseCase,
    productBrandProxyRepository,
    productCategoryRepository,
    repository,
  );

  const router = Router();
  router.post('/products', httpService.createApi.bind(httpService));
  router.patch('/products/:id', httpService.updateApi.bind(httpService));
  router.delete('/products/:id', httpService.deleteApi.bind(httpService));
  router.get('/products/:id', httpService.getDetailApi.bind(httpService));
  router.get('/products', httpService.listApi.bind(httpService));

  //rpc
  router.post('/rpc/products/by-ids', httpService.getProductByIdsApi.bind(httpService));

  return router;
};
