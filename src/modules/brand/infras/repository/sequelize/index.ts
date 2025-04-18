import { Brand } from '@/modules/brand/model/brand';
import { BrandConditionDTO, BrandUpdateDTO } from '@/modules/brand/model/dto';
import { BaseRepositorySequelize } from '@/share/repository/repo-sequelize';
import { Sequelize } from 'sequelize';
import { modelName } from './dto';

export class MySQLBrandRepository extends BaseRepositorySequelize<Brand, BrandConditionDTO, BrandUpdateDTO> {
  constructor(sequelize: Sequelize) {
    super(sequelize, modelName);
  }
}
