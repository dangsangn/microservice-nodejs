import { BaseHttpService } from '@/share/transport';
import { Request, Response } from 'express';
import { IProductBrandQueryRepository, IProductCategoryQueryRepository } from '../../interface';
import { ConditionProductDto, CreateProductDto, UpdateProductDto } from '../../model/dto';
import { BrandProduct, CategoryProduct, Product } from '../../model/product';
import { ProductUseCase } from '../../usecase';
import { ErrDataNotFound } from '@/share/model/base-error';
import { IRepository } from '@/share/interface';

export class ProductHttpService extends BaseHttpService<CreateProductDto, UpdateProductDto, ConditionProductDto, Product> {
  constructor(
    useCase: ProductUseCase,
    readonly productBrandRepository: IProductBrandQueryRepository,
    readonly productCategoryRepository: IProductCategoryQueryRepository,
    readonly repository: IRepository<Product, ConditionProductDto, UpdateProductDto>,
  ) {
    super(useCase);
  }

  async getDetailApi(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product: Product & { brand?: BrandProduct; category?: CategoryProduct } = await this.useCase.get(id);

      if (!product) {
        throw ErrDataNotFound;
      }

      const productBrand = await this.productBrandRepository.get(product!.brandId!);
      if (productBrand) {
        product!.brand = productBrand;
      }

      const productCategory = await this.productCategoryRepository.get(product!.categoryId!);
      if (productCategory) {
        product!.category = productCategory;
      }

      res.status(200).json({ data: product });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getProductByIdsApi(req: Request, res: Response) {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        throw new Error('ids must be an array');
      }
      const products = await this.repository.listByIds(ids);
      res.status(200).json({ data: products });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
