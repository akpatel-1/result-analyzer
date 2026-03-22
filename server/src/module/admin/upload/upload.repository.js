export const repository = {
  async createStudentsProfile(client, students) {
    if (students.length === 0) return { insertedRollNos: [], rowCount: 0 };

    const values = [];
    const placeholders = students.map((s, i) => {
      const base = i * 7;
      values.push(
        s.name,
        s.email,
        s.roll_no,
        s.enroll_id,
        s.abc_id,
        s.batch,
        s.branch
      );
      return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`;
    });

    const result = await client.query(
      `INSERT INTO students (name, email, roll_no, enroll_id, abc_id, batch, branch)
       VALUES ${placeholders.join(', ')}
       ON CONFLICT DO NOTHING
       RETURNING roll_no`,
      values
    );

    return {
      insertedRollNos: result.rows.map((r) => r.roll_no),
      rowCount: result.rowCount,
    };
  },
};
