import { IRepository } from '@/share/interface';
import { ErrDataNotFound } from '@/share/model/base-error';
import { ModelStatus } from '@/share/model/base-model';
import { PagingDTO } from '@/share/model/paging';
import { v7 } from 'uuid';
import { IProductUseCase } from '../interface';
import {
  ConditionProductDto,
  CreateProductDto,
  CreateProductSchema,
  UpdateProductDto,
  UpdateProductSchema,
} from '../model/dto';
import { NameMustBeAtLeast2CharactersLongError } from '../model/error';
import { Product, ProductGender } from '../model/product';

export class ProductUseCase implements IProductUseCase {
  constructor(private readonly repository: IRepository<Product, ConditionProductDto, UpdateProductDto>) {}

  async create(data: CreateProductDto): Promise<string> {
    const { data: parsedData, error } = CreateProductSchema.safeParse(data);

    if (error) {
      // TODO: handle error
      const issues = error.issues;
      for (const issue of issues) {
        if (issue.path[0] === 'name') {
          throw NameMustBeAtLeast2CharactersLongError;
        }
      }

      throw error;
    }

    const newId = v7();
    const category: Product = {
      id: newId,
      status: ModelStatus.ACTIVE,
      gender: ProductGender.UNISEX,
      salePrice: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...parsedData,
    };
    await this.repository.insert(category);
    return newId;
  }

  async update(id: string, data: UpdateProductDto): Promise<boolean> {
    const { data: parsedData, error } = UpdateProductSchema.safeParse(data);

    if (error) {
      // TODO: handle error
      const issues = error.issues;
      for (const issue of issues) {
        if (issue.path[0] === 'name') {
          throw NameMustBeAtLeast2CharactersLongError;
        }
      }

      throw error;
    }

    return await this.repository.update(id, parsedData);
  }

  async delete(id: string): Promise<boolean> {
    const product = await this.repository.get(id);
    if (!product || product.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return await this.repository.delete(id, false);
  }

  async get(id: string): Promise<Product> {
    const category = await this.repository.get(id);
    if (!category || category.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    return category;
  }

  async list(condition: ConditionProductDto, paging: PagingDTO): Promise<Product[]> {
    const data = await this.repository.list(condition, paging);
    return data;
  }
}
