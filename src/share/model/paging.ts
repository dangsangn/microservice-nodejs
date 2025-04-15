import { z } from 'zod';

export const PagingDTOSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).default(100),
  total: z.coerce.number().int().min(0).default(0).optional(),
});

export type PagingDTO = z.infer<typeof PagingDTOSchema>;
