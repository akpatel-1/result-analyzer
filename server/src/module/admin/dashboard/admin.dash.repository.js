export const repository = {
  async getStudentResultFromRollNo(client, data) {
    const result = await client.query(
      `
    WITH latest_attempt AS (
      SELECT
        a.id AS attempt_id,
        a.student_id,
        a.semester,
        a.exam_type,
        a.view_type,
        a.attempt_no,
        a.exam_session,
        a.exam_year,
        a.result_date
      FROM attempts a
      JOIN students s ON s.id = a.student_id
      WHERE s.batch = $1
        AND s.roll_no = $2
        AND a.semester = $3     
      ORDER BY a.result_date DESC
      LIMIT 1
    ),

    latest_subject_results AS (
      SELECT DISTINCT ON (sr.subject_id)
        sr.subject_id,
        sr.obt_ese,
        sr.obt_ct,
        sr.obt_ta,
        sr.obt_total,
        sr.status
      FROM subject_results sr
      JOIN attempts a ON sr.attempt_id = a.id
      JOIN latest_attempt la ON a.semester = la.semester
      WHERE a.student_id = la.student_id
      ORDER BY sr.subject_id, a.result_date DESC 
    )

    SELECT
      s.name,
      la.semester,
      la.exam_type,
      la.attempt_no,
      la.view_type,
      la.exam_session,
      la.exam_year,
      la.result_date,
      ov.max_marks,
      ov.obt_marks,
      ov.status,
      ov.spi,
      json_agg(
        json_build_object(
          'subject',   sub.name,
          'max_ese',   sub.max_ese,
          'obt_ese',   lsr.obt_ese,
          'max_ct',    sub.max_ct,
          'obt_ct',    lsr.obt_ct,
          'max_ta',    sub.max_ta,
          'obt_ta',    lsr.obt_ta,
          'max_total', sub.max_total,
          'obt_total', lsr.obt_total,
          'status',    lsr.status
        )
      ) AS subject_results
    FROM latest_attempt la
    JOIN overall_results ov ON ov.attempt_id = la.attempt_id
    JOIN latest_subject_results lsr ON true
    JOIN subjects sub ON lsr.subject_id = sub.id
    JOIN students s ON s.id = la.student_id
    GROUP BY
      s.name, la.semester, la.exam_type, la.attempt_no, la.view_type,
      la.exam_session, la.exam_year, la.result_date,
      ov.max_marks, ov.obt_marks, ov.status, ov.spi
    `,
      [data.batch, data.roll_no, data.semester]
    );

    return result.rows[0];
  },

  async getStudentProfile(client, data) {
    const result = await client.query(
      `SELECT id, name, email, roll_no, abc_id, enroll_id, batch, branch
     FROM students
     WHERE batch = $1 AND roll_no = $2`,
      [data.batch, data.roll_no]
    );
    return result.rows[0];
  },

  async getStudentBacklogs(client, data) {
    const studentResult = await client.query(
      'SELECT id FROM students WHERE batch = $1 AND roll_no = $2',
      [data.batch, data.roll_no]
    );
    const student = studentResult.rows[0];
    if (!student) return [];

    const result = await client.query(
      `WITH latest_subjects_attempt AS (
      SELECT DISTINCT ON (s.id, sr.subject_id)
        s.id,
        sr.subject_id,
        a.semester,
        sr.status,
        sub.name AS subject_name
      FROM students s
      JOIN attempts a ON s.id = a.student_id
      JOIN subject_results sr ON a.id = sr.attempt_id
      JOIN subjects sub ON sr.subject_id = sub.id
      WHERE s.id = $1
      ORDER BY
        s.id,
        sr.subject_id,
        CASE a.exam_type
          WHEN 'Backlog' THEN 2
          WHEN 'Regular' THEN 1
        END DESC,
        a.attempt_no DESC,
        CASE a.view_type
          WHEN 'RRV' THEN 3
          WHEN 'RTRV' THEN 2
          WHEN 'VALUATION' THEN 1
        END DESC
    )
    SELECT 
      semester,
      subject_name
    FROM latest_subjects_attempt
    WHERE status = 'Fail'`,
      [student.id]
    );

    return result.rows;
  },

  async getStudentSpi(client, data) {
    const studentResult = await client.query(
      'SELECT id FROM students WHERE batch = $1 AND roll_no = $2',
      [data.batch, data.roll_no]
    );
    const student = studentResult.rows[0];
    if (!student) return [];

    const result = await client.query(
      `WITH latest_overall_spi AS (
      SELECT DISTINCT ON (s.id, a.semester)
        s.id,
        a.semester,
        ov.spi,
        ov.status
      FROM students s
      JOIN attempts a ON s.id = a.student_id
      JOIN overall_results ov ON a.id = ov.attempt_id
      WHERE s.id = $1
      ORDER BY
        s.id,
        a.semester,
        CASE a.exam_type 
          WHEN 'Backlog' THEN 2
          WHEN 'Regular' THEN 1
        END DESC,
        a.attempt_no DESC,
        CASE a.view_type
          WHEN 'RRV' THEN 3
          WHEN 'RTRV' THEN 2
          WHEN 'VALUATION' THEN 1
        END DESC
    )
    SELECT 
      semester,
      spi
    FROM latest_overall_spi
    WHERE status NOT IN ('Fail', 'RV-Fail', 'RRV-Fail')
    ORDER BY semester ASC`,
      [student.id]
    );
    return result.rows;
  },
};
