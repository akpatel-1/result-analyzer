import { pool } from '../../../infra/database/db.js';

export async function findAdminByEmail(email) {
  const result = await pool.query(
    `SELECT id, email, password_hash
        FROM admins WHERE email = $1
        LIMIT 1`,
    [email]
  );
  return result.rows[0] || null;
}
