import argon2 from 'argon2';

import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { repository } from '../session/session.repository.js';
import { findAdminByEmail } from './auth.repository.js';

export const service = {
  async processLogin({ email, password }) {
    const admin = await this._authenticate(email, password);
    const sessionId = await repository.create(admin.id);
    return {
      sessionId,
      data: {
        id: admin.id,
        email: admin.email,
      },
    };
  },

  async _authenticate(email, password) {
    const admin = await findAdminByEmail(email);

    if (!admin) {
      throw new ApiError(ERROR_CONFIG.INVALID_CREDENTIALS);
    }

    const isMatch = argon2.verify(admin.password_hash, password);

    if (!isMatch) {
      throw new ApiError(ERROR_CONFIG.INVALID_CREDENTIALS);
    }

    return admin;
  },

  async processLogout(sessionId) {
    if (!sessionId) {
      return;
    }
    await repository.delete(sessionId);
  },
};
