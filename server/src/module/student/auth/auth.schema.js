import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .refine((email) => email.endsWith('@ssipmt.com'), {
    message: 'Email must be from @ssipmt.com domain',
  });

export const schema = {
  email: z.object({
    email: emailSchema,
  }),

  otp: z.object({
    email: emailSchema,
    otp: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^[0-9]+$/, 'OTP must only contain numbers'),
  }),
};
