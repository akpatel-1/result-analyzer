import z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(50, 'Email cannot exceed 50 characters')
    .email('Invalid email format'),
  password: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: 'Password cannot be empty or spaces only.',
    })
    .refine((value) => !value.startsWith(' ') && !value.endsWith(' '), {
      message: 'Password cannot start or end with a space.',
    })
    .min(12, 'Password must be at least 12 characters long.')
    .max(128, 'Password cannot exceed 128 characters.'),
});
