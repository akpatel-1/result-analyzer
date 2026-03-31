import express from 'express';

import { authenticateToken } from '../auth/auth.middleware.js';
import { controller } from './result.controller.js';

export const studentResult = express.Router();

studentResult.get(
  '/latest-result',
  authenticateToken,
  controller.hadleRecentResult
);
