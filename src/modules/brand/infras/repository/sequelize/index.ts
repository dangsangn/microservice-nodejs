import { Brand } from '@/modules/brand/model/brand';
import { BrandConditionDTO, BrandUpdateDTO } from '@/modules/brand/model/dto';
import {
  BaseRepositoryCommandSequelize,
  BaseRepositoryQuerySequelize,
  BaseRepositorySequelize,
} from '@/share/repository/repo-sequelize';
import { Sequelize } from 'sequelize';
import { modelName } from './dto';

export class MySQLBrandRepository extends BaseRepositorySequelize<Brand, BrandConditionDTO, BrandUpdateDTO> {
  constructor(sequelize: Sequelize) {
    super(new MySQLBrandQueryRepository(sequelize, modelName), new MySQLBrandCommandRepository(sequelize, modelName));
  }
}

export class MySQLBrandQueryRepository extends BaseRepositoryQuerySequelize<Brand, BrandConditionDTO> {
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}

export class MySQLBrandCommandRepository extends BaseRepositoryCommandSequelize<Brand, BrandUpdateDTO> {
  constructor(sequelize: Sequelize, modelName: string) {
    super(sequelize, modelName);
  }
}
