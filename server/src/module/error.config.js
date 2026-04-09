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
  EMAIL_SEND_FAILED: {
    statusCode: 500,
    message: 'Unable to send OTP at the moment. Please try again later.',
    code: 'EMAIL_SEND_FAILED',
  },
  EMAIL_NOT_FOUND: {
    statusCode: 404,
    message: 'We couldn’t find an account associated with this email address.',
    code: 'EMAIL_NOT_FOUND',
  },
  INVALID_OR_EXPIRED_OTP: {
    statusCode: 400,
    message: 'Invalid or expired OTP',
    code: 'INVALID_OR_EXPIRED_OTP',
  },
  ACCESS_TOKEN_MISSING: {
    statusCode: 401,
    message: 'Authentication required.',
    code: 'ACCESS_TOKEN_MISSING',
  },
  INVALID_TOKEN: {
    statusCode: 401,
    message: 'Invalid token structure',
    code: 'INVALID_TOKEN',
  },
  OTP_RATE_LIMIT_EXCEEDED: {
    statusCode: 429,
    message: 'Too many OTP requests. Please try again after 10 minutes.',
    code: 'OTP_RATE_LIMIT_EXCEEDED',
  },
  STUDENT_NOT_FOUND: {
    statusCode: 404,
    message: 'Student not found',
    code: 'STUDENT_NOT_FOUND',
  },
  SUBJECTS_LESS_THAN_10: {
    statusCode: 400,
    message: 'Subjects must be at least 10',
    code: 'SUBJECTS_LESS_THAN_10',
  },
  RESULT_NOT_FOUND: {
    statusCode: 404,
    message: 'Result not found',
    code: 'RESULT_NOT_FOUND',
  },
};
