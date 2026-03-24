import { pool } from '../../../infra/database/db.js';
import { repository } from './upload.repository.js';

export const service = {
  async processProfileUpload(students) {
    const promises = Object.values(students).map((student) =>
      repository.createStudentsProfile(pool, student)
    );

    console.log('promise: ', promises);

    const results = await Promise.allSettled(promises);

    console.log('results: ', results);

    const success = [];
    const failed = [];

    Object.values(students).forEach((student, index) => {
      const result = results[index];
      console.log('result: ', result);

      if (result.status === 'fulfilled') {
        success.push(student.roll_no);
      } else {
        failed.push({
          roll_no: student.roll_no,
          error: result.reason.message,
        });
      }
    });

    return { success, failed };
  },
};
