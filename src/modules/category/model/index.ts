import { ModelStatus } from '@/share/model/base-model';
import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  description: z.string().optional(),
  image: z.string().optional(),
  position: z.number().min(0, 'Invalid position').default(0),
  parentId: z.string().uuid().nullable().optional(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Category = z.infer<typeof CategorySchema> & {
  children: Category[];
};
