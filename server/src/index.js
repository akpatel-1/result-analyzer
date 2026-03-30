import express from 'express';

import { adminAuth } from './module/admin/auth/auth.routes.js';
import { uploadRoute } from './module/admin/upload/upload.routes.js';
import { deptAuth } from './module/deptment/auth.routes.js';
import { studentAuth } from './module/student/auth/auth.routes.js';
import { studentProfile } from './module/student/profile/profile.routes.js';

export const router = express.Router();

router.use('/admin', adminAuth);
router.use('/admin', uploadRoute);

router.use('/dept', deptAuth);

router.use('/students', studentAuth);
router.use('/students', studentProfile);
