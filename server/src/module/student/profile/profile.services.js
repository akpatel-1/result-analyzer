import { promise } from 'zod';

import { pool } from '../../../infra/database/db.js';
import { repository } from './profile.repository.js';

export async function profileService(id) {
  const [profile, backlogs, spi] = await Promise.all([
    repository.getStudentProfile(pool, id),
    repository.getStudentBacklogs(pool, id),
    repository.getStudentSpi(pool, id),
  ]);

  let cgpa = {};
  if (spi && spi.length > 0) {
    const total = spi.reduce((sum, item) => sum + parseFloat(item.spi), 0);
    cgpa.value = parseFloat((total / spi.length).toFixed(2));
    cgpa.semesters = spi.map((item) => item.semester);
  }
  return { profile, backlogs, cgpa };
}
