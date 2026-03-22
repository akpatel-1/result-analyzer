import { success } from 'zod';

import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { AUTH_CONFIG } from '../auth/auth.config.js';
import { repository } from './session.repository.js';

export async function validateSession(req, res, next) {
  const sessionId = req.cookies[AUTH_CONFIG.COOKIE_NAME];

  if (!sessionId) {
    throw new ApiError(ERROR_CONFIG.SESSION_EXPIRED);
  }

  const admin = await repository.get(sessionId);

  if (!admin) {
    throw new ApiError(ERROR_CONFIG.USER_NOT_FOUND);
  }

  req.session = {
    id: admin.id,
    email: admin.email,
  };

  next();
}
