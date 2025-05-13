import { ModelStatus } from '@/share/model/base-model';
import { z } from 'zod';
import {
  BrandIdMustBeValidUUIDError,
  CategoryIdMustBeValidUUIDError,
  NameMustBeAtLeast2CharactersLongError,
  PriceMustBeGreaterThan0Error,
  QuantityMustBe0OrGreaterError,
  SaleCountMustBe0OrGreaterError,
  SalePriceMustBe0OrGreaterError,
} from './error';

export enum ProductGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNISEX = 'UNISEX',
}

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, NameMustBeAtLeast2CharactersLongError),
  price: z.number().positive(PriceMustBeGreaterThan0Error),
  salePrice: z.number().nonnegative(SalePriceMustBe0OrGreaterError),
  color: z.string().optional(),
  quantity: z.number().nonnegative(QuantityMustBe0OrGreaterError),
  brandId: z.string().uuid(BrandIdMustBeValidUUIDError).optional(),
  categoryId: z.string().uuid(CategoryIdMustBeValidUUIDError).optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  images: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  saleCount: z.number().nonnegative(SaleCountMustBe0OrGreaterError).optional(),
  status: z.nativeEnum(ModelStatus),
  gender: z.nativeEnum(ProductGender),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof productSchema>;

export const BrandProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, NameMustBeAtLeast2CharactersLongError),
});

export type BrandProduct = z.infer<typeof BrandProductSchema>;

export const CategoryProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, NameMustBeAtLeast2CharactersLongError),
});

export type CategoryProduct = z.infer<typeof CategoryProductSchema>;
