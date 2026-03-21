import express from 'express';

import { adminAuth } from './module/admin/auth/auth.routes.js';

export const router = express.Router();

router.use('/admin', adminAuth);
