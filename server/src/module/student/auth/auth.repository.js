export const repository = {
  async findStudentByEmail(client, email) {
    const result = await client.query(
      `SELECT id, email FROM students WHERE email = $1`,
      [email]
    );

    return result.rows[0];
  },

  async createRefreshToken(client, data) {
    await client.query(
      `INSERT INTO refresh_tokens
      (student_id, token_hash,expires_at)
      VALUES ($1, $2, $3)`,
      [data.studentId, data.tokenHash, data.expiresAt]
    );
  },
};
