import { z } from "zod";

const SubjectSchema = z.object({
  code: z.string().min(1, "Subject code is required"),
  name: z.string().min(1, "Subject name is required"),
  max_ese: z.number().int().nullable(),
  obt_ese: z.number().int().nullable(),
  max_ct: z.number().int().nullable(),
  obt_ct: z.number().int().nullable(),
  max_ta: z.number().int().nullable(),
  obt_ta: z.number().int().nullable(),
  max_total: z.number().int(),
  obt_total: z.number().int(),

  // Scraper derives this from letter grade (Pass/Fail)
  status: z
    .enum([
      "Pass",
      "Pass By Grace",
      "Fail",
      "RV-Pass",
      "RV-Pass By Grace",
      "RRV-Pass",
      "RRV-Pass By Grace",
      "RV-Fail",
      "RRV-Fail",
    ])
    .nullable(),
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
    review_type: z.enum(["VALIDATION", "RTRV", "RRV"]),

    // Table: overall_result
    spi: z.number().min(0).max(10, "SPI must be between 0 and 10").nullable(),
    overall_max: z.number().int(),
    overall_obt: z.number().int(),

    overall_status: z.string().min(1),

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
