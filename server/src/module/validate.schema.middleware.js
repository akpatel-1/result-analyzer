import { ApiError } from '../utils/api.error.js';

export function validateSchema(schema, source = 'body') {
  return (req, res, next) => {
    const data = req[source] || {};

    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors)[0]?.[0];

      throw new ApiError({
        statusCode: 400,
        message: firstError || 'Validation Error',
        code: 'VALIDATION_ERROR',
      });
    }

    req.data = Object.assign(req.data || {}, result.data);

    next();
  };
}
