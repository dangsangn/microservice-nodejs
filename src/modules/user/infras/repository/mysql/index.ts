import { User, UserConditionDTO, UserUpdateDTO } from '@/modules/user/model';
import {
  BaseRepositoryCommandSequelize,
  BaseRepositoryQuerySequelize,
  BaseRepositorySequelize,
} from '@/share/repository/repo-sequelize';
import { Sequelize } from 'sequelize';

export class MySQLUserRepository extends BaseRepositorySequelize<User, UserConditionDTO, UserUpdateDTO> {
  constructor(
    readonly sequelize: Sequelize,
    readonly modelName: string,
  ) {
    super(new MYSQLUserQueryRepository(sequelize, modelName), new MYSQLUserCommandRepository(sequelize, modelName));
  }
}

export class MYSQLUserCommandRepository extends BaseRepositoryCommandSequelize<User, UserUpdateDTO> {
  constructor(
    readonly sequelize: Sequelize,
    readonly modelName: string,
  ) {
    super(sequelize, modelName);
  }
}

export class MYSQLUserQueryRepository extends BaseRepositoryQuerySequelize<User, UserConditionDTO> {
  constructor(
    readonly sequelize: Sequelize,
    readonly modelName: string,
  ) {
    super(sequelize, modelName);
  }
}
