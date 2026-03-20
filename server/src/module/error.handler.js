export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  console.error(' Error Details:', {
    url: req.url,
    error: err.message,
    code: err.code,
    type: err.constructor.name,
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
