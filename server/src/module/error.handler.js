import { ApiError } from '../utils/api.error.js';

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  console.error('Error Details:', {
    url: req.originalUrl,
    method: req.method,
    message: err.message,
    code: err.code || 'UNKNOWN',
    type: err.constructor.name,
    stack: err.stack,
  });

  res.status(status).json({
    success: false,
    message:
      err instanceof ApiError
        ? err.message
        : 'Internal server error. Please try again after a while.',
    code: err.code || 'INTERNAL_ERROR',
  });
}
