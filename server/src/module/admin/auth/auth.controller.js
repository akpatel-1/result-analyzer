import { AUTH_CONFIG } from './auth.config.js';
import { service } from './auth.services.js';

export const controller = {
  async handleLogin(req, res) {
    const { sessionId, data } = await service.processLogin(req.data);

    res.cookie(AUTH_CONFIG.COOKIE_NAME, sessionId, AUTH_CONFIG.COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: 'Login successful', data });
  },
};
