import { z } from 'zod';

export const schema = {
  email: z.object({
    email: z
      .string()
      .email()
      .refine((email) => email.endsWith('@ssipmt.com'), {
        message: 'Email must be from @ssipmt.com domain',
      }),
  }),

  otp: z.object({
    email: z.string().email('Invalid email format').trim().toLowerCase(),
    otp: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^[0-9]+$/, 'OTP must only contain numbers'),
  }),
};
