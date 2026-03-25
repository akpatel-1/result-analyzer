import { redis } from '../../../infra/redis/redis.js';
import { AUTH_CONFIG } from './auth.config.js';

export const otpRepository = {
  async create(hashedEmail, hashedOtp) {
    const key = this._getKey(hashedEmail);
    return redis.set(key, { hashedOtp }, { ex: AUTH_CONFIG.OTP_TTL });
  },

  async delete(hashedEmail) {
    const key = this._getKey(hashedEmail);
    return redis.del(key);
  },
  _getKey(hashedEmail) {
    return `${AUTH_CONFIG.OTP_PREFIX}${hashedEmail}`;
  },
};
