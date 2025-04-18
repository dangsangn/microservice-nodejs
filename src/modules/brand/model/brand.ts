import { ModelStatus } from '@/share/model/base-model';
import { z } from 'zod';

export const BrandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  tagLine: z.string().optional(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Brand = z.infer<typeof BrandSchema>;
