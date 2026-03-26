import pLimit from 'p-limit';
import client from 'pg/lib/native/client';

import { pool } from '../../../infra/database/db.js';
import { ApiError } from '../../../utils/api.error.js';
import { withTransaction } from '../../../utils/transaction.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { repository } from './upload.repository.js';

export const service = {
  async processProfileUpload(students) {
    const success = [];
    const failed = [];
    const limit = pLimit(30);

    const studentArray = Object.values(students);

    const tasks = studentArray.map((student) =>
      limit(() => repository.createStudentsProfile(pool, student))
    );

    const results = await Promise.allSettled(tasks);

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
    const limit = pLimit(10);
    const studentArray = Object.values(students);

    const tasks = studentArray.map((student) =>
      limit(() =>
        withTransaction(pool, async (client) => {
          const studentId = await repository.getStudentIdFromAbcId(
            client,
            student.abc_id
          );
          if (!studentId) {
            throw new ApiError(ERROR_CONFIG.STUDENT_NOT_FOUND);
          }
          const attemptId = await repository.insertAttempts(client, {
            student_id: studentId,
            semester: student.semester,
            exam_type: student.exam_type,
            attempt_no: student.attempt_no,
            exam_session: student.exam_session,
            exam_year: student.exam_year,
          });
          await repository.insertOverallResult(client, attemptId, student);
          const subjectRows = await repository.getSubjectInfoId(
            client,
            student.subjects
          );
          const subjectIdByCode = new Map(
            subjectRows.map((subject) => [subject.code, subject.id])
          );

          for (const subject of student.subjects) {
            const subjectId = subjectIdByCode.get(subject.code);
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
    const results = await Promise.allSettled(tasks);

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
