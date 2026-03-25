import express from 'express';

import { validateSchema } from '../../validate.schema.middleware.js';
import { controller } from './auth.controller.js';
import { authenticateToken } from './auth.middleware.js';
import { schema } from './auth.schema.js';

export const studentAuth = express.Router();

studentAuth.post(
  '/otp',
  validateSchema(schema.email),
  controller.handleOtpRequest
);

studentAuth.post(
  '/otp/verify',
  validateSchema(schema.otp),
  controller.handleOtpVerification
);

studentAuth.post('/auth/refresh', controller.refreshToken);

studentAuth.post('/auth/logout', authenticateToken, controller.logout);

studentAuth.get('/me', authenticateToken, controller.handleMe);
