import { pool } from '../../../infra/database/db.js';
import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { repository } from './admin.dash.repository.js';

export const service = {
  async fetchStudentResult(data) {
    const result = await repository.getStudentResultFromRollNo(pool, data);
    if (!result) {
      throw new ApiError(ERROR_CONFIG.RESULT_NOT_FOUND);
    }
    return result;
  },
  async fetchStudentProfile(data) {
    const [profile, backlogs, spi] = await Promise.all([
      repository.getStudentProfile(pool, data),
      repository.getStudentBacklogs(pool, data),
      repository.getStudentSpi(pool, data),
    ]);

    let cgpa = {};
    if (spi && spi.length > 0) {
      const total = spi.reduce((sum, item) => sum + parseFloat(item.spi), 0);
      cgpa.value = parseFloat((total / spi.length).toFixed(2));
      cgpa.semesters = spi.map((item) => item.semester);
    }
    return { profile, backlogs, cgpa };
  },
};
