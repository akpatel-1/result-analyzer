export const repository = {
  async getStudentProfile(client, id) {
    const result = await client.query(
      `SELECT name, email, roll_no, abc_id, enroll_id, batch, branch
     FROM students
     WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },
  async getStudentBacklogs(client, id) {
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
      [id]
    );

    return result.rows;
  },
  async getStudentSpi(client, id) {
    const result = await client.query(
      `WITH latest_overall_spi AS (
      SELECT DISTINCT ON (s.id, a.semester)
        s.id,
        a.semester,
        ov.spi,
        ov.overall_status
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
    WHERE overall_status NOT IN ('Fail', 'RV-Fail', 'RRV-Fail')
    ORDER BY semester ASC`,
      [id]
    );
    return result.rows;
  },
};
