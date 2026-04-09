import express from 'express';

import { validateSchema } from '../../validate.schema.middleware.js';
import { validateSession } from '../session/session.middleware.js';
import { controller } from './admin.dash.controller.js';
import { schema } from './admin.dash.schema.js';

export const admidDashRoutes = express.Router();

admidDashRoutes.get(
  '/student',
  validateSession,
  validateSchema(schema.result, 'query'),
  controller.getStudentResult
);
