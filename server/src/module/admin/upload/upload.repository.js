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

  async insertIntoSubjects(client, subject) {
    await client.query(
      `INSERT INTO subjects
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

  async getStudentsId(client, student) {
    const result = await client.query(
      `SELECT id FROM students WHERE roll_no = $1 AND batch = $2`,
      [student.roll_no, student.batch]
    );
    return result.rows[0]?.id;
  },

  async insertIntoAttempts(client, data) {
    const result = await client.query(
      `INSERT INTO attempts
      (student_id, semester, exam_type, attempt_no,review_type, exam_session, exam_year)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`,
      [
        data.student_id,
        data.semester,
        data.exam_type,
        data.attempt_no,
        data.review_type,
        data.exam_session,
        data.exam_year,
      ]
    );
    return result.rows[0]?.id;
  },

  async insertIntoOverallResults(client, attemptId, student) {
    await client.query(
      `
      INSERT INTO overall_results
      (attempt_id, spi, overall_max, overall_obt, overall_status)
      VALUES($1, $2, $3, $4, $5)`,
      [
        attemptId,
        student.spi,
        student.overall_max,
        student.overall_obt,
        student.overall_status,
      ]
    );
  },

  async getSubjectsCode(client, subjects) {
    const codes = subjects.map((s) => s.code);

    const result = await client.query(
      `SELECT id, code, name FROM subjects
     WHERE code = ANY($1)`,
      [codes]
    );
    return result.rows;
  },

  async getSingleSubjectInfoId(client, code) {
    const result = await client.query(
      `SELECT id FROM subjects
     WHERE code = $1`,
      [code]
    );
    return result.rows[0]?.id;
  },

  async insertIntoSubjectResults(client, attemptId, subjectId, subject) {
    await client.query(
      `
      INSERT INTO subject_results
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
