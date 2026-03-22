import express from 'express';

import { adminAuth } from './module/admin/auth/auth.routes.js';
import { uploadRoute } from './module/admin/upload/upload.routes.js';

export const router = express.Router();

router.use('/admin', adminAuth);
router.use('/admin', uploadRoute);
