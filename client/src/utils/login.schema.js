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
    .max(128, 'Password cannot exceed 128 characters.'),
});
