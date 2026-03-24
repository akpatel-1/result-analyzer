import express from 'express';

import { validateSchema } from '../../validate.schema.middleware.js';
import { validateSession } from '../session/session.middleware.js';
import { controller } from './auth.controller.js';
import { schema } from './auth.schema.js';

export const adminAuth = express.Router();

adminAuth.post('/login', validateSchema(schema), controller.handleLogin);
adminAuth.get('/logout', controller.handleLogout);
adminAuth.get('/me', validateSession, controller.handleMe);
