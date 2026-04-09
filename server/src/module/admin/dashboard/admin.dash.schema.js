import { z } from 'zod';

export const schema = {
  result: z.object({
    batch: z
      .string({ message: 'Batch is required' })
      .trim()
      .min(1, 'Batch is required')
      .transform((value) => Number(value))
      .refine((value) => Number.isInteger(value), {
        message: 'Batch must be a valid year',
      }),
    roll_no: z
      .string({ message: 'Roll number is required' })
      .trim()
      .min(1, 'Roll number is required')
      .max(30, 'Roll number cannot exceed 30 characters'),
    semester: z
      .string({ message: 'Semester is required' })
      .trim()
      .transform((value) => Number(value))
      .refine((value) => Number.isInteger(value) && value >= 1 && value <= 8, {
        message: 'Semester must be between 1 and 8',
      }),
  }),
};
