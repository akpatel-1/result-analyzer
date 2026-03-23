import { pool } from '../../../infra/database/db.js';
import { repository } from './upload.repository.js';

let failed = [];
export const service = {
  async processProfileUpload(students) {
    const failed = [];
    for (const key in students) {
      const student = students[key];

      try {
        await repository.createStudentsProfile(pool, student);
      } catch (err) {
        failed.push({ roll_no: student.roll_no, error: err.message });
      }
    }
    return failed;
  },
};
