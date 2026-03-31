import pLimit from 'p-limit';

import { pool } from '../../../infra/database/db.js';
import { ApiError } from '../../../utils/api.error.js';
import { withTransaction } from '../../../utils/transaction.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { repository } from './upload.repository.js';

export const service = {
  async processProfileUpload(studentsObj) {
    const limit = pLimit(50);

    const students = Object.values(studentsObj);

    const tasks = students.map((student) =>
      limit(() => repository.createStudentsProfile(pool, student))
    );

    const results = await Promise.allSettled(tasks);

    return this._catchStudentError(results, students);
  },

  async uploadSubjects(students) {
    const success = [];
    const failed = [];
    const { subjects } = students[0];

    if (subjects.length < 10) {
      throw new ApiError(ERROR_CONFIG.SUBJECTS_LESS_THAN_10);
    }

    const promises = subjects.map((subject) =>
      repository.insertIntoSubjects(pool, subject)
    );
    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      const subject = subjects[index];

      if (result.status === 'fulfilled') {
        success.push(subject.name);
      } else {
        failed.push({
          name: subject.name,
          error: result.reason?.message || 'Unknown error',
        });
      }
    });
    return { success, failed };
  },

  async uploadResults(studentsObj) {
    const limit = pLimit(10);
    const students = Object.values(studentsObj);

    const tasks = students.map((student) =>
      limit(() =>
        withTransaction(pool, async (client) => {
          const studentId = await repository.getStudentsId(client, {
            roll_no: student.roll_no,
            batch: student.batch,
          });
          if (!studentId) {
            throw new ApiError(ERROR_CONFIG.STUDENT_NOT_FOUND);
          }

          const attemptId = await repository.insertIntoAttempts(client, {
            student_id: studentId,
            semester: student.semester,
            exam_type: student.exam_type,
            view_type: student.view_type,
            attempt_no: student.attempt_no,
            exam_session: student.exam_session,
            exam_year: student.exam_year,
            result_date: student.result_date,
          });

          await repository.insertIntoOverallResults(client, attemptId, {
            spi: student.spi,
            max_marks: student.max_marks,
            obt_marks: student.obt_marks,
            status: student.status,
          });

          const subjectRows = await repository.getSubjectsCode(
            client,
            student.subjects
          );

          const subjectIdByCode = new Map(
            subjectRows.map((subject) => [subject.code, subject.id])
          );

          for (const subject of student.subjects) {
            const subjectId = subjectIdByCode.get(subject.code);

            if (!subjectId) {
              throw new Error(`Subject not found for code ${subject.code}`);
            }

            await repository.insertIntoSubjectResults(
              client,
              attemptId,
              subjectId,
              subject
            );
          }
          return student.roll_no;
        })
      )
    );
    const results = await Promise.allSettled(tasks);

    return this._catchStudentError(results, students);
  },

  async _catchStudentError(results, students) {
    const success = [];
    const failed = [];

    results.forEach((result, index) => {
      const student = students[index];

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
