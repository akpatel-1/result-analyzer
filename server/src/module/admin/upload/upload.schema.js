import { z } from 'zod';

const resultDateSchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const normalized = value.replace(/\s+/g, ' ');
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid date format',
      });
      return z.NEVER;
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  });

const subjectInfoSchema = z.object({
  code: z.string(),
  name: z.string(),
  max_ese: z.number().int().nullable(),
  max_ct: z.number().int().nullable(),
  max_ta: z.number().int().nullable(),
  max_total: z.number().int(),
});

const subjectResultSchema = subjectInfoSchema.extend({
  obt_ese: z.number().int().nullable(),
  obt_ct: z.number().int().nullable(),
  obt_ta: z.number().int().nullable(),
  obt_total: z.number().int(),
  status: z.enum(['Pass', 'Fail']),
});

const studentProfileSchema = z.object({
  roll_no: z.string(),
  name: z.string(),
  email: z.string().email(),
  enroll_id: z.string(),
  abc_id: z.string(),
  batch: z.number().int(),
  branch: z.string(),
});

const studentResultSchema = studentProfileSchema
  .extend({
    semester: z.number().min(1).max(8),
    exam_session: z.enum(['Apr-May', 'Nov-Dec']),
    exam_year: z.number().int(),
    exam_type: z.enum(['Regular', 'Backlog']),
    attempt_no: z.number().int().min(1).max(3),
    view_type: z.enum(['VALUATION', 'RTRV', 'RRV']),
    result_date: resultDateSchema,
    spi: z.number().nullable(),
    max_marks: z.number().int(),
    obt_marks: z.number().int(),
    status: z.enum([
      'Pass',
      'Pass By Grace',
      'RV-Pass',
      'RV-Pass By Grace',
      'RRV-PASS',
      'RRV-Pass By Grace',
      'Fail',
      'RV-Fail',
      'RRV-Fail',
      'RV-PASS',
      'RV-PASS BY GRACE',
      'RRV-PASS BY GRACE',
    ]),
    subjects: z.array(subjectResultSchema).min(1),
  })
  .refine((data) => data.exam_type !== 'Regular' || data.attempt_no === 1, {
    message: 'Regular exam type must have attempt_no = 1',
    path: ['attempt_no'],
  });

export const profileUploadSchema = z.array(studentProfileSchema).min(1);

export const subjectUploadSchema = z
  .array(
    z.object({
      subjects: z.array(subjectInfoSchema).min(1),
    })
  )
  .min(1);

export const resultUploadSchema = z.array(studentResultSchema).min(1);
