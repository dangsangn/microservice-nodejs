import { PagingDTO } from '@/share/model/paging';
import { ICategoryRepository, ICategoryUseCase } from '../interface';
import { Category } from '../model';
import {
  CategoryUpdateDTO,
  CategoryConditionDTO,
  CategoryCreateDTO,
  CategoryCreateSchema,
  CategoryUpdateSchema,
} from '../model/dto';
import { ErrCategoryNameTooShort } from '../model/errors';
import { v7 } from 'uuid';
import { ModelStatus } from '@/share/model/base-model';
import { ErrDataNotFound } from '@/share/model/base-error';

export class CategoryUseCase implements ICategoryUseCase {
  constructor(private readonly repository: ICategoryRepository) {}

  async createCategory(data: CategoryCreateDTO): Promise<string> {
    const { data: parsedData, error } = CategoryCreateSchema.safeParse(data);

    if (error) {
      // TODO: handle error
      const issues = error.issues;
      for (const issue of issues) {
        if (issue.path[0] === 'name') {
          throw ErrCategoryNameTooShort;
        }
      }

      throw error;
    }

    const newId = v7();
    const category: Category = {
      id: newId,
      position: 0,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      children: [],
      ...parsedData,
    };
    await this.repository.insert(category);
    return newId;
  }

  async updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean> {
    const { data: parsedData, error } = CategoryUpdateSchema.safeParse(data);

    if (error) {
      // TODO: handle error
      const issues = error.issues;
      for (const issue of issues) {
        if (issue.path[0] === 'name') {
          throw ErrCategoryNameTooShort;
        }
      }

      throw error;
    }

    return await this.repository.update(id, parsedData);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const category = await this.repository.get(id);
    if (!category || category.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return await this.repository.delete(id, false);
  }

  async getDetailCategory(id: string): Promise<Category> {
    const category = await this.repository.get(id);
    if (!category || category.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return category;
  }

  async listCategory(condition: CategoryConditionDTO, paging: PagingDTO): Promise<Category[]> {
    const data = await this.repository.list(condition, paging);
    return data;
  }
}
