import express from 'express';

import { adminAuth } from './module/admin/auth/auth.routes.js';
import { uploadRoute } from './module/admin/upload/upload.routes.js';
import { studentAuth } from './module/student/auth/auth.routes.js';
import { studentProfile } from './module/student/profile/profile.routes.js';
import { studentResult } from './module/student/result/result.routes.js';

export const router = express.Router();

router.use('/admin', adminAuth);
router.use('/admin', uploadRoute);

router.use('/students', studentAuth);
router.use('/students', studentProfile);
router.use('/students', studentResult);
