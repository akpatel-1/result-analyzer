import express from 'express';

import { validateSchema } from '../../validate.schema.middleware.js';
import { authenticateToken } from '../auth/auth.middleware.js';
import { controller } from './result.controller.js';
import { resultSchema } from './result.schema.js';

export const studentResult = express.Router();

studentResult.get(
  '/latest-result',
  authenticateToken,
  controller.handleRecentResult
);

studentResult.get(
  '/result',
  authenticateToken,
  validateSchema(resultSchema, 'query'),
  controller.handleSemesterResult
);
