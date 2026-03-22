import { z } from 'zod';

const subjectSchema = z.object({
  code: z.string(),
  name: z.string(),
  max_ese: z.number().nullable(),
  obt_ese: z.number().nullable(),
  max_ct: z.number().nullable(),
  obt_ct: z.number().nullable(),
  max_ta: z.number(),
  obt_ta: z.number(),
  max_total: z.number(),
  obt_total: z.number(),
  status: z.string(),
});

const studentResultSchema = z.object({
  roll_no: z.string(),
  name: z.string(),
  email: z.string().email(),
  enroll_id: z.string(),
  abc_id: z.string(),
  batch: z.number(),
  branch: z.string(),
  semester: z.number(),
  exam_session: z.string(),
  exam_year: z.number(),
  exam_type: z.string(),
  attempt_no: z.number(),
  review_type: z.string().nullable(),
  spi: z.number().nullable(),
  max_total_marks: z.number(),
  obt_total_marks: z.number(),
  status: z.string(),
  subjects: z.array(subjectSchema), 
});

export const schema = z.array(studentResultSchema);
