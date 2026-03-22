import express from 'express';

import { validateSchema } from '../../validate.schema.middleware.js';
import { validateSession } from '../session/session.middleware.js';
import { controller } from './upload.controller.js';
import { middleware } from './upload.middleware.js';
import { schema } from './upload.schema.js';

export const uploadRoute = express.Router();

uploadRoute.post(
  '/upload/profile',
  validateSession,
  middleware.uploadJSON.array('files'),
  middleware.parseJSONfiles,
  validateSchema(schema, 'parsedJSON'),
  controller.handleProfileUpload
);
