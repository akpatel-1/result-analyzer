import express from 'express';

import { validateSchema } from '../../validate.schema.middleware.js';
import { validateRole } from '../auth/auth.middleware.js';
import { validateSession } from '../session/session.middleware.js';
import { controller } from './upload.controller.js';
import {
  profileUploadSchema,
  resultUploadSchema,
  subjectUploadSchema,
} from './upload.schema.js';

export const uploadRoute = express.Router();

uploadRoute.use(validateSession, validateRole('admin'));

uploadRoute.post(
  '/upload/profile',
  validateSchema(profileUploadSchema),
  controller.handleProfileUpload
);

uploadRoute.post(
  '/upload/subjects',
  validateSchema(subjectUploadSchema),
  controller.createSubjectInfo
);

uploadRoute.post(
  '/upload/results',
  validateSchema(resultUploadSchema),
  controller.createResults
);
