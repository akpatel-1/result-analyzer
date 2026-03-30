import express from 'express';

import { authenticateToken } from '../auth/auth.middleware.js';
import { profileController } from './profile.controller.js';

export const studentProfile = express.Router();

studentProfile.get('/profile', authenticateToken, profileController);
