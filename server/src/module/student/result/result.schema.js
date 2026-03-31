import { z } from 'zod';

const ALLOWED_STATUS = [1, 2, 3, 4, 5, 6, 7, 8];

export const resultSchema = z.object({
  sem: z
    .string({ message: 'Semester is required' })
    .trim()
    .transform((val) => Number(val))
    .refine((val) => ALLOWED_STATUS.includes(val), {
      message: `Invalid semester. Must be one of: ${ALLOWED_STATUS.join(', ')}`,
    }),
});
