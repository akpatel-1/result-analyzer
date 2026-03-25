import 'dotenv/config';
import jwt from 'jsonwebtoken';

import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { AUTH_CONFIG } from './auth.config.js';

export function authenticateToken(req, res, next) {
  const accessToken = req.cookies[AUTH_CONFIG.ACCESS_COOKIE_NAME];

  if (!accessToken) {
    throw new ApiError(ERROR_CONFIG.ACCESS_TOKEN_MISSING);
  }

  const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  if (typeof payload === 'object' && payload.studentId) {
    req.studentId = payload.studentId;
  } else {
    throw new ApiError(ERROR_CONFIG.INVALID_TOKEN);
  }

  next();
}
