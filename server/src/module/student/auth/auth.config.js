const isProd = process.env.NODE_ENV === 'production';

export const AUTH_CONFIG = {
  OTP_PREFIX: 'student:otp:',
  OTP_TTL: 10 * 60,

  ACCESS_COOKIE_NAME: 'user_sid',
  ACCESS_MAX_AGE: 30 * 60 * 1000,
  REFRESH_COOKIE_NAME: 'user_rid',
  REFRESH_MAX_AGE: 30 * 24 * 60 * 60 * 1000,

  REFRESH_TOKEN_EXPIRE: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

  get ACCESS_COOKIE_OPTIONS() {
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: this.ACCESS_MAX_AGE,
    };
  },

  get REFRESH_COOKIE_OPTIONS() {
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: this.REFRESH_MAX_AGE,
    };
  },
};
