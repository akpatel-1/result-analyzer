import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { AUTH_CONFIG } from '../auth/auth.config.js';
import { repository } from './session.repository.js';

export async function validateSession(req, res, next) {
  const sessionId = req.cookies[AUTH_CONFIG.COOKIE_NAME];

  if (!sessionId) {
    throw new ApiError(ERROR_CONFIG.SESSION_EXPIRED);
  }

  const user = await repository.get(sessionId);

  if (!user) {
    throw new ApiError(ERROR_CONFIG.USER_NOT_FOUND);
  }

  req.session = {
    id: user.id,
    role: user.role,
    email: user.email,
  };

  next();
}
