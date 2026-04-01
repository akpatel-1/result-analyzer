import { z } from "zod";

const resultDateSchema = z
  .string()
  .trim()
  .transform((value, ctx) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const normalized = value.replace(/\s+/g, " ");
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid result_date format",
      });
      return z.NEVER;
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

const overallStatusSchema = z.enum([
  "Pass",
  "Pass By Grace",
  "RV-Pass",
  "RV-Pass By Grace",
  "RRV-PASS",
  "RRV-Pass By Grace",
  "RV-PASS",
  "RV-PASS BY GRACE",
  "RRV-PASS BY GRACE",
  "Fail",
  "RV-Fail",
  "RRV-Fail",
]);

const SubjectSchema = z.object({
  code: z.string().min(1, "Subject code is required"),
  name: z.string().min(1, "Subject name is required"),
  max_ese: z.number().int().nullable(),
  obt_ese: z.number().int().nullable(),
  max_ct: z.number().int().nullable(),
  obt_ct: z.number().int().nullable(),
  max_ta: z.number().int(),
  obt_ta: z.number().int(),
  max_total: z.number().int(),
  obt_total: z.number().int(),

  // Scraper derives this from letter grade (Pass/Fail)
  status: z.enum(["Pass", "Fail"]),
});

// 2. Full Result Schema (Maps to `students`, `attempts`, and `overall_result`)
export const ResultSchema = z
  .object({
    // Table: students
    roll_no: z.string().min(1, "Roll number is required"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    enroll_id: z.string(),
    abc_id: z.string(),
    batch: z.number().int().positive("Batch must be a valid year"),
    branch: z.string().min(1, "Branch is required"),

    // Table: attempts
    semester: z
      .number()
      .int()
      .min(1)
      .max(8, "Semester must be between 1 and 8"),
    exam_type: z.enum(["Regular", "Backlog"]),
    attempt_no: z
      .number()
      .int()
      .min(1)
      .max(3, "Attempt number must be between 1 and 3"),
    exam_session: z.enum(["Apr-May", "Nov-Dec"]),
    exam_year: z.number().int().positive(),

    // Table: subject_review
    view_type: z.enum(["VALUATION", "RTRV", "RRV"]),

    // Table: overall_result
    spi: z.number().min(0).max(10, "SPI must be between 0 and 10").nullable(),
    max_marks: z.number().int(),
    obt_marks: z.number().int(),

    status: overallStatusSchema,

    result_date: resultDateSchema,
    subjects: z.array(SubjectSchema).min(1, "At least one subject is required"),
  })
  .refine(
    (data) => {
      return data.exam_type !== "Regular" || data.attempt_no === 1;
    },
    {
      message: "If exam_type is 'Regular', attempt_no MUST be 1",
      path: ["attempt_no"],
    },
  );
