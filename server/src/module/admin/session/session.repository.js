import { redis } from '../../../infra/redis/redis.js';
import { AUTH_CONFIG } from '../auth/auth.config.js';

export const repository = {
  async create(user) {
    const sessionId = crypto.randomUUID();
    const key = `${AUTH_CONFIG.SESSION_PREFIX}${sessionId}`;
    const data = {
      id: user.id,
      role: user.role,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + AUTH_CONFIG.SESSION_TTL * 1000),
    };
    await redis.set(key, data, { ex: AUTH_CONFIG.SESSION_TTL });
    return sessionId;
  },

  async delete(sessionId) {
    const key = `${AUTH_CONFIG.SESSION_PREFIX}${sessionId}`;
    return redis.del(key);
  },

  async get(sessionId) {
    const key = `${AUTH_CONFIG.SESSION_PREFIX}${sessionId}`;
    return redis.get(key);
  },
};
