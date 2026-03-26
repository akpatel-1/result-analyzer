export const repository = {
  async createStudentsProfile(client, student) {
    await client.query(
      `INSERT INTO students
      (name, roll_no, email, abc_id, enroll_id, batch, branch)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        student.name,
        student.roll_no,
        student.email,
        student.abc_id,
        student.enroll_id,
        student.batch,
        student.branch,
      ]
    );
  },

  async insertSubjectsInfo(client, subject) {
    await client.query(
      `INSERT INTO subjects_info
      (code, name, max_ese, max_ct, max_ta, max_total)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        subject.code,
        subject.name,
        subject.max_ese,
        subject.max_ct,
        subject.max_ta,
        subject.max_total,
      ]
    );
  },

  async getStudentIdFromAbcId(client, id) {
    const result = await client.query(
      `SELECT id FROM students WHERE abc_id = $1`,
      [id]
    );
    return result.rows[0]?.id;
  },

  async insertAttempts(client, data) {
    const result = await client.query(
      `INSERT INTO attempts
      (student_id, semester, exam_type, attempt_no, exam_session, exam_year)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING id`,
      [
        data.student_id,
        data.semester,
        data.exam_type,
        data.attempt_no,
        data.exam_session,
        data.exam_year,
      ]
    );
    return result.rows[0]?.id;
  },

  async insertOverallResult(client, attemptId, student) {
    await client.query(
      `
      INSERT INTO overall_result
      (attempt_id, spi, max_marks, obt_marks, overall_status)
      VALUES($1, $2, $3, $4, $5)`,
      [
        attemptId,
        student.spi,
        student.max_total_marks,
        student.obt_total_marks,
        student.overall_status,
      ]
    );
  },

  async getSubjectInfoId(client, subjects) {
    const codes = subjects.map((s) => s.code);

    const result = await client.query(
      `SELECT id, code FROM subjects_info
     WHERE code = ANY($1)`,
      [codes]
    );
    return result.rows;
  },

  async insertSubjectResult(client, subject, attemptId, subjectId) {
    await client.query(
      `
      INSERT INTO subject_result
      (attempt_id, subject_id, obt_ese, obt_ct, obt_ta, obt_total, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        attemptId,
        subjectId,
        subject.obt_ese,
        subject.obt_ct,
        subject.obt_ta,
        subject.obt_total,
        subject.status,
      ]
    );
  },
};
