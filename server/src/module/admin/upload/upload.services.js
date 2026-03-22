import { pool } from '../../../infra/database/db.js';
import { withTransactions } from '../../../utils/transactions.js';
import { repository } from './upload.repository.js';

export const service = {
  async processProfileUpload(data) {
    await repository.createStudentsProfile(pool, data);
  },
};
