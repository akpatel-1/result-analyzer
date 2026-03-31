import { pool } from '../../../infra/database/db.js';
import { repository } from './result.repository.js';

export const service = {
  async processRecentResult(id) {
    return await repository.getRecentResult(pool, id);
  },
};
