import { pool } from '../../../infra/database/db.js';
import { withTransaction } from '../../../utils/transaction.js';
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

  async uploadResults(students) {
    const success = [];
    const failed = [];
    const studentArray = Object.values(students);

    const results = await Promise.allSettled(
      studentArray.map((student) =>
        withTransaction(pool, async (client) => {
          const studentId = await repository.getStudentIdFromRollNo(
            client,
            student.abc_id
          );

          if (!studentId) {
            throw new Error('Student not found for provided abc_id');
          }

          const attemptId = await repository.insertAttempts(client, {
            student_id: studentId,
            semester: student.semester,
            exam_type: student.exam_type,
            attempt_no: student.attempt_no,
            exam_session: student.exam_session,
            exam_year: student.exam_year,
          });

          if (!attemptId) {
            throw new Error('Failed to create attempt record');
          }

          await repository.insertOverallResult(client, student, attemptId);

          const subjectRows = await repository.getSubjectInfoId(
            client,
            student.subjects
          );
          const subjectIdByCode = new Map(
            subjectRows.map((item) => [item.code, item.id])
          );

          for (const subject of student.subjects) {
            const subjectId = subjectIdByCode.get(subject.code);

            if (!subjectId) {
              throw new Error(`Subject not found for code ${subject.code}`);
            }

            await repository.insertSubjectResult(
              client,
              subject,
              attemptId,
              subjectId
            );
          }

          return student.roll_no;
        })
      )
    );

    results.forEach((result, index) => {
      const student = studentArray[index];

      if (result.status === 'fulfilled') {
        success.push(student.roll_no);
      } else {
        failed.push({
          roll_no: student.roll_no,
          error: result.reason?.message || 'Unknown error',
        });
      }
    });

    return { success, failed };
  },
};
