export const repository = {
  async createStudentsProfile(client, data) {
    await client.query(
      `INSERT INTO students
            (name, email, roll_no, enroll_id, abc_id, batch, branch)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        data.name,
        data.email,
        data.roll_no,
        data.enroll_id,
        data.abc_id,
        data.batch,
        data.branch,
      ]
    );
  },
};
