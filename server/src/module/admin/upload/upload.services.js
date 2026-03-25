import { pool } from '../../../infra/database/db.js';
import { repository } from './upload.repository.js';

export const service = {
  async processProfileUpload(students) {
    const BATCH_SIZE = 50;
    const success = [];
    const failed = [];

    const studentArray = Object.values(students);

    for (let i = 0; i < studentArray.length; i += BATCH_SIZE) {
      const batch = studentArray.slice(i, i + BATCH_SIZE);

      const batchPromises = batch.map((student) =>
        repository.createStudentsProfile(pool, student)
      );

      const results = await Promise.allSettled(batchPromises);

      results.forEach((result, index) => {
        const student = batch[index];

        if (result.status === 'fulfilled') {
          success.push(student.roll_no);
        } else {
          failed.push({
            roll_no: student.roll_no,
            error: result.reason?.message || 'Unknown error',
          });
        }
      });
    }
    return { success, failed };
  },

  async uploadSubjectInfo(students) {
    const success = [];
    const failed = [];

    const subjectList = students[0].subjects;

    const promises = subjectList.map((subject) =>
      repository.insertSubjectsInfo(pool, subject)
    );

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      const originalSubject = subjectList[index];

      if (result.status === 'fulfilled') {
        success.push(originalSubject.name);
      } else {
        failed.push({
          name: originalSubject.name,
          error: result.reason?.message || 'Unknown error',
        });
      }
    });
    return { success, failed };
  },
};
