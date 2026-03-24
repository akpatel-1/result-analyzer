import { ApiError } from '../utils/api.error.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
    });
  }
  const status = err.statusCode || 500;

  console.error('Error Details:', {
    url: req.originalUrl,
    message: err.message,
    code: err.code || 'UNKNOWN',
    type: err.constructor.name,
    stack: err.stack,
  });

  return res.status(500).json({
    message: 'Internal server error. Please try again after a while.',
    code: 'INTERNAL_ERROR',
  });
}
