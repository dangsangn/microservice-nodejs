import { IUseCase } from '@/share/interface';
import { ConditionProductDto, CreateProductDto, UpdateProductDto } from '../model/dto';
import { BrandProduct, CategoryProduct, Product } from '../model/product';

export interface IProductUseCase extends IUseCase<CreateProductDto, UpdateProductDto, ConditionProductDto, Product> {}

export interface IProductBrandQueryRepository {
  get(id: string): Promise<BrandProduct | null>;
}

export interface IProductCategoryQueryRepository {
  get(id: string): Promise<CategoryProduct | null>;
}
