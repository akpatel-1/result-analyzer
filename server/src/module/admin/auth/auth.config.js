const isProd = process.env.NODE_ENV === 'production';

export const AUTH_CONFIG = {
  COOKIE_NAME: 'sid',
  SESSION_PREFIX: 'sess:',
  SESSION_TTL: 7 * 24 * 60 * 60,
  MAX_AGE: 7 * 24 * 60 * 60 * 1000,

  get COOKIE_OPTIONS() {
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: this.MAX_AGE,
    };
  },

  get CLEAR_COOKIE_OPTIONS() {
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    };
  },
};
