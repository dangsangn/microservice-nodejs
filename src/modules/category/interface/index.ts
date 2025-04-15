import { PagingDTO } from '@/share/model/paging';
import { Category } from '../model';
import { CategoryConditionDTO, CategoryCreateDTO, CategoryUpdateDTO } from '../model/dto';

export interface IQueryRepository {
  get(id: string): Promise<Category | null>;
  list(condition: CategoryConditionDTO, paging: PagingDTO): Promise<Category[]>;
}

export interface ICommandRepository {
  insert(data: CategoryCreateDTO): Promise<boolean>;
  update(id: string, data: CategoryUpdateDTO): Promise<boolean>;
  delete(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface ICategoryRepository extends IQueryRepository, ICommandRepository {}

export interface ICategoryUseCase {
  createCategory(category: CategoryCreateDTO): Promise<string>;
  updateCategory(id: string, category: CategoryUpdateDTO): Promise<boolean>;
  deleteCategory(id: string, isHardDelete: boolean): Promise<boolean>;
  getDetailCategory(id: string): Promise<Category>;
  listCategory(condition: CategoryConditionDTO, paging: PagingDTO): Promise<Category[]>;
}
