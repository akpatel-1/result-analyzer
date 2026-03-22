import { pool } from '../../../infra/database/db.js';
import { repository } from './upload.repository.js';

export const service = {
  async processProfileUpload(data) {
    const { insertedRollNos, rowCount } =
      await repository.createStudentsProfile(client, data);

    const sentRollNos = data.map((s) => s.roll_no);
    const insertedSet = new Set(insertedRollNos);
    const skippedRollNos = sentRollNos.filter(
      (roll_no) => !insertedSet.has(roll_no)
    );

    return {
      total: data.length,
      inserted: rowCount,
      skipped: skippedRollNos.length,
      skippedRollNos,
    };
  },
};
