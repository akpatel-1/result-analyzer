export const repository = {
  async getRecentResult(client, id) {
    const result = await client.query(
      `SELECT DISTINCT ON (a.student_id)
  a.semester,
  a.exam_type,
  a.attempt_no,
  a.view_type,
  ov.max_marks,
  ov.obt_marks,
  ov.status,
  ov.spi,
  json_agg(
    json_build_object(
      'subject', sub.name,
      'max_ese', sub.max_ese,
      'obt_ese', sr.obt_ese,
      'max_ct', sub.max_ct,
      'obt_ct', sr.obt_ct,
      'max_ta', sub.max_ta,
      'obt_ta', sr.obt_ta,
      'max_total', sub.max_total,
      'obt_total', sr.obt_total,
      'status', sr.status
    )
  ) AS subject_results
FROM students s
JOIN attempts a ON s.id = a.student_id
JOIN overall_results ov ON a.id = ov.attempt_id
JOIN subject_results sr ON a.id = sr.attempt_id
JOIN subjects sub ON sr.subject_id = sub.id
WHERE s.id = $1
GROUP BY a.student_id, a.semester, a.exam_type, a.attempt_no, a.view_type,
         ov.max_marks, ov.obt_marks, ov.status, ov.spi, a.result_date
ORDER BY a.student_id, a.result_date DESC;

`,
      [id]
    );

    return result.rows[0];
  },
};
