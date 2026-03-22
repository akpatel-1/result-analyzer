import { pool } from '../../../infra/database/db.js';
import { withTransactions } from '../../../utils/transactions.js';
import { repository } from './upload.repository.js';

export const service = {
  async processProfileUpload(data) {
    for (const student of data) {
      await repository.createStudentsProfile(pool, student);
    }
  },
};
