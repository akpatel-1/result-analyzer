export const repository = {
  async findStudentByEmail(client, email) {
    const result = await client.query(
      `SELECT id, email FROM students WHERE email = $1`,
      [email]
    );

    return result.rows[0];
  },
};
