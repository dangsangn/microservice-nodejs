import { Op, Sequelize } from 'sequelize';
import { IRepository } from '@/share/interface';
import { PagingDTO } from '@/share/model/paging';
import { ModelStatus } from '@/share/model/base-model';

export abstract class BaseRepositorySequelize<Entity, Condition, UpdateDTO>
  implements IRepository<Entity, Condition, UpdateDTO>
{
  constructor(
    readonly queryRepository: BaseRepositoryQuerySequelize<Entity, Condition>,
    readonly commandRepository: BaseRepositoryCommandSequelize<Entity, UpdateDTO>,
  ) {}

  get(id: string): Promise<Entity | null> {
    return this.queryRepository.get(id);
  }

  findByCondition(condition: Condition): Promise<Entity | null> {
    return this.queryRepository.findByCondition(condition);
  }

  list(condition: Condition, paging: PagingDTO): Promise<Entity[]> {
    return this.queryRepository.list(condition, paging);
  }

  insert(entity: Entity): Promise<boolean> {
    return this.commandRepository.insert(entity);
  }

  update(id: string, updateDTO: UpdateDTO): Promise<boolean> {
    return this.commandRepository.update(id, updateDTO);
  }

  delete(id: string, isHardDelete: boolean = false): Promise<boolean> {
    return this.commandRepository.delete(id, isHardDelete);
  }
}

export abstract class BaseRepositoryQuerySequelize<Entity, Condition> {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string,
  ) {}
  async get(id: string): Promise<Entity | null> {
    const model = this.sequelize.models[this.modelName];
    if (!model) {
      throw new Error(`Model ${this.modelName} not found`);
    }
    const data = await model.findByPk(id);
    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });
    const { create_at, update_at, ...entityData } = persistenceData;
    return { ...entityData, createdAt: create_at, updatedAt: update_at } as Entity;
  }

  async findByCondition(condition: Condition): Promise<Entity | null> {
    const model = this.sequelize.models[this.modelName];
    if (!model) {
      throw new Error(`Model ${this.modelName} not found`);
    }

    const data = await model.findOne({ where: condition as any });
    if (!data) {
      return null;
    }

    const persistenceData = data.get({ plain: true });
    const { create_at, update_at, ...entityData } = persistenceData;
    return { ...entityData, createdAt: create_at, updatedAt: update_at } as Entity;
  }

  async list(condition: Condition, paging: PagingDTO): Promise<Entity[]> {
    const model = this.sequelize.models[this.modelName];
    if (!model) {
      throw new Error(`Model ${this.modelName} not found`);
    }

    const { limit, page } = paging;

    const condSQL = { ...condition, status: { [Op.ne]: ModelStatus.DELETED } };

    const total = await this.sequelize.models[this.modelName].count({ where: condSQL });

    const rows = await this.sequelize.models[this.modelName].findAll({
      where: condSQL,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });
    paging.total = total;

    const data = rows.map((row) => {
      const persistenceData = row.get({ plain: true });
      const { create_at, update_at, ...entityData } = persistenceData;
      return { ...entityData, createdAt: create_at, updatedAt: update_at } as Entity;
    });

    return data;
  }
}

export abstract class BaseRepositoryCommandSequelize<CreateDTO, UpdateDTO> {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string,
  ) {}
  async insert(entity: CreateDTO): Promise<boolean> {
    const model = this.sequelize.models[this.modelName];
    if (!model) {
      throw new Error(`Model ${this.modelName} not found`);
    }

    await this.sequelize.models[this.modelName].create(entity as any);
    return true;
  }

  async update(id: string, updateDTO: UpdateDTO): Promise<boolean> {
    const model = this.sequelize.models[this.modelName];
    if (!model) {
      throw new Error(`Model ${this.modelName} not found`);
    }
    await this.sequelize.models[this.modelName].update(updateDTO as any, { where: { id } });
    return true;
  }

  async delete(id: string, isHardDelete: boolean = false): Promise<boolean> {
    const model = this.sequelize.models[this.modelName];
    if (!model) {
      throw new Error(`Model ${this.modelName} not found`);
    }
    if (isHardDelete) {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    } else {
      await this.sequelize.models[this.modelName].update({ status: ModelStatus.DELETED }, { where: { id } });
    }
    return true;
  }
}
