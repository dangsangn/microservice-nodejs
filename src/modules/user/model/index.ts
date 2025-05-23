import { z } from 'zod';
import {
  ErrBirthdayInvalid,
  ErrEmailInvalid,
  ErrFirstNameAtLeast2Chars,
  ErrGenderInvalid,
  ErrLastNameAtLeast2Chars,
  ErrPasswordAtLeast6Chars,
  ErrRoleInvalid,
} from './error';
import { UserRole } from '@/share/interface';

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
  firstName: z.string().min(2, ErrFirstNameAtLeast2Chars.message),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars.message),
  email: z.string().email(ErrEmailInvalid.message),
  password: z.string().min(6, ErrPasswordAtLeast6Chars.message),
  salt: z.string().min(8),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  birthday: z.date({ invalid_type_error: ErrBirthdayInvalid.message }).nullable().optional(),
  gender: z.nativeEnum(Gender, ErrGenderInvalid),
  role: z.nativeEnum(UserRole, ErrRoleInvalid),
  status: z.nativeEnum(Status).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const userRegisterDTOSchema = userSchema.pick({
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export type UserRegisterDTO = z.infer<typeof userRegisterDTOSchema>;

export const UserLoginDTOSchema = userSchema.pick({
  email: true,
  password: true,
});

export type UserLoginDTO = z.infer<typeof UserLoginDTOSchema>;

export const userUpdateDTOSchema = z.object({
  avatar: z.string().nullable().optional(),
  firstName: z.string().min(2, ErrFirstNameAtLeast2Chars.message).optional(),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars.message).optional(),
  email: z.string().email(ErrEmailInvalid.message).optional(),
  password: z.string().min(6, ErrPasswordAtLeast6Chars.message).optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  birthday: z.date({ invalid_type_error: ErrBirthdayInvalid.message }).nullable().optional(),
  gender: z.nativeEnum(Gender, ErrGenderInvalid).optional(),
  role: z.nativeEnum(UserRole, ErrRoleInvalid).optional(),
  status: z.nativeEnum(Status).optional(),
});

export type UserUpdateDTO = z.infer<typeof userUpdateDTOSchema>;

export const userCondDTOSchema = z.object({
  avatar: z.string().nullable().optional(),
  firstName: z.string().min(2, ErrFirstNameAtLeast2Chars.message).optional(),
  lastName: z.string().min(2, ErrLastNameAtLeast2Chars.message).optional(),
  email: z.string().email(ErrEmailInvalid.message).optional(),
  password: z.string().min(6, ErrPasswordAtLeast6Chars.message).optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  birthday: z.date({ invalid_type_error: ErrBirthdayInvalid.message }).nullable().optional(),
  gender: z.nativeEnum(Gender, ErrGenderInvalid).optional(),
  role: z.nativeEnum(UserRole, ErrRoleInvalid).optional(),
  status: z.nativeEnum(Status).optional(),
});

export type UserConditionDTO = z.infer<typeof userCondDTOSchema>;
