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
    .min(12, 'Password must be at least 12 characters'),
});
