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
};
