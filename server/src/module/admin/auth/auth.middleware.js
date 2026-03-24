import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';

export function validateRole(role) {
  return (req, res, next) => {
    const session = req.session;
    if (session.role !== role) {
      throw new ApiError(ERROR_CONFIG.FORBIDDEN_REQUEST);
    }
    next();
  };
}
