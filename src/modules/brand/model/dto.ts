import { ModelStatus } from '@/share/model/base-model';
import { z } from 'zod';

export const BrandCreateDTOSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  tagLine: z.string().optional(),
});
export type BrandCreateDTO = z.infer<typeof BrandCreateDTOSchema>;

export const BrandUpdateDTOSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  tagLine: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});
export type BrandUpdateDTO = z.infer<typeof BrandUpdateDTOSchema>;

export type BrandConditionDTO = {};
