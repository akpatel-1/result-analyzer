import express from 'express';

import { controller } from '../admin/auth/auth.controller.js';
import { validateRole } from '../admin/auth/auth.middleware.js';
import { schema } from '../admin/auth/auth.schema.js';
import { validateSession } from '../admin/session/session.middleware.js';
import { validateSchema } from '../validate.schema.middleware.js';

export const hodAuth = express.Router();

hodAuth.post('/login', validateSchema(schema), controller.handleLogin);
hodAuth.get(
  '/logout',
  validateSession,
  validateRole('hod'),
  controller.handleLogout
);
hodAuth.get('/me', validateSession, controller.handleMe);
