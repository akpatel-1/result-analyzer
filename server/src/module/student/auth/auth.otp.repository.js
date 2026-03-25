import { redis } from '../../../infra/redis/redis.js';
import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { AUTH_CONFIG } from './auth.config.js';

export const otpRepository = {
  async checkCoolDown(hashedEmail) {
    const key = `${AUTH_CONFIG.OTP_COOLDOWN_PREFIX}${hashedEmail}`;
    const exists = await redis.get(key);

    if (exists) {
      const ttl = await redis.ttl(key);
      throw new ApiError({
        statusCode: 429,
        message: `Please wait ${ttl} seconds before requesting another OTP`,
        code: 'OTP_REQUEST_LIMIT',
      });
    }
    await redis.set(key, '1', { ex: AUTH_CONFIG.OTP_COOLDOWN_TTL });
  },

  async checkRateLimit(hashedEmail) {
    const key = `${AUTH_CONFIG.OTP_RATE_LIMIT_PREFIX}${hashedEmail}`;
    const count = await redis.incr(key);

    if (count === 1) {
      await redis.expire(key, AUTH_CONFIG.OTP_RATE_LIMIT_TTL);
    }

    if (count > AUTH_CONFIG.OTP_MAX_REQUESTS) {
      throw new ApiError(ERROR_CONFIG.OTP_RATE_LIMIT_EXCEEDED);
    }
  },

  async create(hashedEmail, hashedOtp) {
    const key = this._getKey(hashedEmail);
    return redis.set(key, { hashedOtp }, { ex: AUTH_CONFIG.OTP_TTL });
  },

  async delete(hashedEmail) {
    const key = this._getKey(hashedEmail);
    return redis.del(key);
  },

  async get(hashedEmail) {
    const key = this._getKey(hashedEmail);
    return redis.get(key);
  },

  _getKey(hashedEmail) {
    return `${AUTH_CONFIG.OTP_PREFIX}${hashedEmail}`;
  },
};
