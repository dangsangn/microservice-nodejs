import { z } from 'zod';
import { ProductGender } from './product';
import {
  BrandIdMustBeValidUUIDError,
  CategoryIdMustBeValidUUIDError,
  NameMustBeAtLeast2CharactersLongError,
  PriceMustBeGreaterThan0Error,
  QuantityMustBe0OrGreaterError,
  SalePriceMustBe0OrGreaterError,
} from './error';

export const CreateProductSchema = z.object({
  name: z.string().min(2, NameMustBeAtLeast2CharactersLongError),
  price: z.number().positive(PriceMustBeGreaterThan0Error),
  salePrice: z.number().nonnegative(SalePriceMustBe0OrGreaterError).optional(),
  color: z.string().optional(),
  quantity: z.number().nonnegative(QuantityMustBe0OrGreaterError),
  brandId: z.string().uuid(BrandIdMustBeValidUUIDError),
  categoryId: z.string().uuid(CategoryIdMustBeValidUUIDError),
  content: z.string().optional(),
  images: z.string().optional(),
  description: z.string().optional(),
  gender: z.nativeEnum(ProductGender).optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
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
  gender: z.nativeEnum(ProductGender),
});

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

export const ConditionProductSchema = z.object({
  fromPrice: z.number().positive(PriceMustBeGreaterThan0Error),
  toPrice: z.number().positive(PriceMustBeGreaterThan0Error),
  brandId: z.string().uuid(BrandIdMustBeValidUUIDError).optional(),
  categoryId: z.string().uuid(CategoryIdMustBeValidUUIDError).optional(),
  gender: z.nativeEnum(ProductGender).optional(),
});

export type ConditionProductDto = z.infer<typeof ConditionProductSchema>;
