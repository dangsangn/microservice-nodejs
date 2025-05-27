import { config } from '@/share/component/config';
import { ServiceContext } from '@/share/interface/service-context';
import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { OrderCommandRepository } from './infras/repository/mysql';
import { CartQueryRepository } from './infras/repository/rpc';
import { OrderUseCase } from './usecase';
import { init } from './infras/repository/mysql/dto';
import { OrderHttpService } from './infras/transport';

export function setupOrderHexagon(sequelize: Sequelize, sctx: ServiceContext): Router {
  init(sequelize);

  const orderCommandRepository = new OrderCommandRepository(sequelize);
  const cartQueryRepository = new CartQueryRepository(config.rpc.cart);
  // const orderQueryRepository = new OrderQueryRepository(sequelize);

  const orderUseCase = new OrderUseCase(orderCommandRepository, cartQueryRepository);
  const orderHTTPService = new OrderHttpService(orderUseCase);

  return orderHTTPService.getRoute(sctx);
}
