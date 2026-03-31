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

  async markRefreshTokenAsRevoked(client, tokenHash) {
    const result = await client.query(
      `UPDATE refresh_tokens 
       SET revoked_at = NOW() 
       WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > NOW() 
       RETURNING student_id`,
      [tokenHash]
    );
    return result.rows[0]?.student_id;
  },

  async findStudentById(client, id) {
    const result = await client.query(
      `SELECT id, email FROM students WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  },
  async getMe(client, id) {
    const result = await client.query(
      `SELECT s.name, a.semester
      FROM students s
      join attempts a on s.id = a.student_id
      WHERE s.id = $1
      ORDER BY a.semester DESC
      LIMIT 1`,
      [id]
    );
    return result.rows[0];
  },
  async revokeRefreshToken(client, studentId) {
    const result = await client.query(
      `UPDATE refresh_tokens
      SET revoked_at = NOW()
      WHERE student_id = $1`,
      [studentId]
    );
  },
};
