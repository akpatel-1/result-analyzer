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

  async insertSubjectsInfo(client, data) {
    await client.query(
      `INSERT INTO subjects_info
      (code, name, max_ese, max_ct, max_ta, max_total)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.code,
        data.name,
        data.max_ese,
        data.max_ct,
        data.max_ta,
        data.max_total,
      ]
    );
  },
};
