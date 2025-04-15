import { IRepository } from '@/share/interface';
import { Op, Sequelize } from 'sequelize';
import { Category } from '../../model';
import { ICategoryRepository } from '../../interface';
import { PagingDTO } from '@/share/model/paging';
import { CategoryConditionDTO, CategoryCreateDTO, CategoryUpdateDTO } from '../../model/dto';
import { ModelStatus } from '@/share/model/base-model';

export class MySQLCategoryRepository implements ICategoryRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string,
  ) {}

  async get(id: string): Promise<Category | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) {
      return null;
    }
    const { create_at, update_at, ...rest } = data.get({ plain: true });

    return { ...rest, createdAt: create_at, updatedAt: update_at, children: [] } as Category;
  }

  async list(condition: CategoryConditionDTO, paging: PagingDTO): Promise<Category[]> {
    const { page, limit } = paging;
    const conditionSQL = { ...condition, status: { [Op.ne]: ModelStatus.DELETED } };
    const count = await this.sequelize.models[this.modelName].count({ where: conditionSQL });
    paging.total = count;

    const rows = await this.sequelize.models[this.modelName].findAll({
      where: conditionSQL,
      offset: (page - 1) * limit,
      limit,
      order: [['id', 'DESC']],
    });

    return rows.map((row) => {
      const { create_at, update_at, ...rest } = row.get({ plain: true });
      return { ...rest, createdAt: create_at, updatedAt: update_at, children: [] } as Category;
    });
  }

  async insert(data: CategoryCreateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data);
    return true;
  }

  async update(id: string, data: CategoryUpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data, { where: { id } });
    return true;
  }

  async delete(id: string, isHardDelete: boolean): Promise<boolean> {
    if (isHardDelete) {
      await this.sequelize.models[this.modelName].destroy({ where: { id } });
    } else {
      await this.sequelize.models[this.modelName].update({ status: ModelStatus.DELETED }, { where: { id } });
    }
    return true;
  }
}
