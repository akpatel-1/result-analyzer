export const ERROR_CONFIG = {
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: 'Invalid email or password',
    code: 'INVALID_CREDENTIALS',
  },
  SESSION_EXPIRED: {
    statusCode: 401,
    message: 'Your session has expired, please login again',
    code: 'SESSION_EXPIRED',
  },
  UNAUTHORIZED_REQUEST: {
    statusCode: 401,
    message: 'You are not authorized to perform this action',
    code: 'UNAUTHORIZED_REQUEST',
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'User not found',
    code: 'USER_NOT_FOUND',
  },
  FORBIDDEN_REQUEST: {
    statusCode: 403,
    message: 'You do not have permission to perform this action',
    code: 'FORBIDDEN_REQUEST',
  },
};
