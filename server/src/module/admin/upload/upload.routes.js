import express from 'express';

import { validateSchema } from '../../validate.schema.middleware.js';
import { validateRole } from '../auth/auth.middleware.js';
import { validateSession } from '../session/session.middleware.js';
import { controller } from './upload.controller.js';
import { schema } from './upload.schema.js';

export const uploadRoute = express.Router();

uploadRoute.use(validateSession, validateRole('admin'), validateSchema(schema));

uploadRoute.post('/upload/profile', controller.handleProfileUpload);

uploadRoute.post('/upload/subjects', controller.createSubjectInfo);

uploadRoute.post('/upload/results', controller.createResults);
