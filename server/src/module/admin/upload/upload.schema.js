import { z } from 'zod';

const subjectSchema = z.object({
  code: z.string(),
  name: z.string(),
  max_ese: z.number().nullable(),
  obt_ese: z.number().nullable(),
  max_ct: z.number().nullable(),
  obt_ct: z.number().nullable(),
  max_ta: z.number().nullable(),
  obt_ta: z.number().nullable(),
  max_total: z.number(),
  obt_total: z.number(),
  status: z.enum(['Pass', 'Pass By Grace', 'Fail']),
});

const studentResultSchema = z.object({
  roll_no: z.string(),
  name: z.string(),
  email: z.string().email(),
  enroll_id: z.string(),
  abc_id: z.string(),
  batch: z.number(),
  branch: z.string(),
  semester: z.number().min(1).max(8),
  exam_session: z.string(),
  exam_year: z.number(),
  exam_type: z.enum(['Regular', 'Backlog']),
  attempt_no: z.number(),
  review_type: z.string().nullable(),
  spi: z.number().nullable(),
  overall_max: z.number(),
  overall_obt: z.number(),
  overall_status: z.string(),
  subjects: z.array(subjectSchema),
});

export const schema = z.array(studentResultSchema);
