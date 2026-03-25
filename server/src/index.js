import express from 'express';

import { adminAuth } from './module/admin/auth/auth.routes.js';
import { uploadRoute } from './module/admin/upload/upload.routes.js';
import { hodAuth } from './module/hod/auth.routes.js';
import { studentAuth } from './module/student/auth/auth.routes.js';

export const router = express.Router();

router.use('/admin', adminAuth);
router.use('/admin', uploadRoute);

router.use('/hod', hodAuth);

router.use('/students', studentAuth);
