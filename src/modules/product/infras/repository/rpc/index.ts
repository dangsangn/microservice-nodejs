import { IProductBrandQueryRepository, IProductCategoryQueryRepository } from '@/modules/product/interface';
import {
  BrandProduct,
  BrandProductSchema,
  CategoryProduct,
  CategoryProductSchema,
} from '@/modules/product/model/product';
import axios from 'axios';

export class RPCProductBrandRepository implements IProductBrandQueryRepository {
  constructor(private readonly baseUrl: string) {}

  async get(id: string): Promise<BrandProduct | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/brands/${id}`);
      const data = BrandProductSchema.parse(response.data.data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export class RPCProductCategoryRepository implements IProductCategoryQueryRepository {
  constructor(private readonly baseUrl: string) {}

  async get(id: string): Promise<CategoryProduct | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/v1/categories/${id}`);
      const data = CategoryProductSchema.parse(response.data.data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

// proxy pattern
export class ProductBrandProxyRepository implements IProductBrandQueryRepository {
  constructor(private readonly brandProductRepository: IProductBrandQueryRepository) {}

  private cached: Record<string, BrandProduct> = {};

  async get(id: string): Promise<BrandProduct | null> {
    try {
      if (this.cached[id]) {
        return this.cached[id];
      }

      const brandProduct = await this.brandProductRepository.get(id);
      if (brandProduct) {
        this.cached[id] = brandProduct;
      }
      return brandProduct;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
