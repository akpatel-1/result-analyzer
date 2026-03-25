import express from 'express';

import { validateSchema } from '../../validate.schema.middleware.js';
import { controller } from './auth.controller.js';
import { schema } from './auth.schema.js';

export const studentAuth = express.Router();

studentAuth.post(
  '/otp-requests',
  validateSchema(schema.email),
  controller.handleOtpRequest
);
