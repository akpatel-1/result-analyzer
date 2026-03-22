export const repository = {
  async createStudentsProfile(client, students) {
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
    await client.query(
      `INSERT INTO students (name, email, roll_no, enroll_id, abc_id, batch, branch)
       VALUES ${placeholders.join(', ')}`,
      values
    );
  },
};
