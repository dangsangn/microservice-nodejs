import { Product } from '@/modules/product/model/product';
import {
  BaseRepositoryCommandSequelize,
  BaseRepositoryQuerySequelize,
  BaseRepositorySequelize,
} from '@/share/repository/repo-sequelize';
import { Sequelize } from 'sequelize';
import { modelName } from './dto';
import { ConditionProductDto, UpdateProductDto } from '@/modules/product/model/dto';

export class MySQLProductRepository extends BaseRepositorySequelize<Product, ConditionProductDto, UpdateProductDto> {
  constructor(sequelize: Sequelize) {
    super(
      new MySQLProductQueryRepository(sequelize, modelName),
      new MySQLProductCommandRepository(sequelize, modelName),
    );
  }
}

export class MySQLProductQueryRepository extends BaseRepositoryQuerySequelize<Product, ConditionProductDto> {
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}

export class MySQLProductCommandRepository extends BaseRepositoryCommandSequelize<Product, UpdateProductDto> {
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}
