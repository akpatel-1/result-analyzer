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
};
