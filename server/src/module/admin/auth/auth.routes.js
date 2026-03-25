import express from 'express';

import { validateSchema } from '../../validate.schema.middleware.js';
import { validateSession } from '../session/session.middleware.js';
import { controller } from './auth.controller.js';
import { validateRole } from './auth.middleware.js';
import { schema } from './auth.schema.js';

export const adminAuth = express.Router();

adminAuth.post('/login', validateSchema(schema), controller.handleLogin);
adminAuth.post('/logout', controller.handleLogout);
adminAuth.get(
  '/me',
  validateSession,
  controller.handleMe
);
