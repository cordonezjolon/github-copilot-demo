import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  age: z
    .number()
    .int('Age must be an integer')
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Age must be realistic'),
  isActive: z.boolean().optional().default(true),
});

export const UpdateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .optional(),
  age: z
    .number()
    .int('Age must be an integer')
    .min(18, 'Must be at least 18 years old')
    .max(120, 'Age must be realistic')
    .optional(),
  isActive: z.boolean().optional(),
});

export const UserIdSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
});

export const UserQuerySchema = z.object({
  limit: z.string().transform(Number).optional(),
  offset: z.string().transform(Number).optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export type UserIdDto = z.infer<typeof UserIdSchema>;
export type UserQueryDto = z.infer<typeof UserQuerySchema>;
