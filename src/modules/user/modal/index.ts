import { z } from 'zod';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNKNOWN = 'unknown',
}

export enum Status {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted',
}

export const userSchema = z.object({
  id: z.string().uuid(),
  avatar: z.string().nullable().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  name: z.string(),
  gender: z.nativeEnum(Gender),
  status: z.nativeEnum(Status),
  createdAt: z.date(),
  updatedAt: z.date(),
});
