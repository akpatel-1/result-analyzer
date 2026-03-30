import { z } from 'zod';

export const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .toLowerCase()
    .email('Invalid email format'),

  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password cannot exceed 128 characters'),
});
