import { AUTH_CONFIG } from './auth.config.js';
import { service } from './auth.services.js';

export const controller = {
  async handleLogin(req, res) {
    const { sessionId, data } = await service.processLogin(req.data);

    res.cookie(AUTH_CONFIG.COOKIE_NAME, sessionId, AUTH_CONFIG.COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: 'Login successful', data });
  },

  async handleLogout(req, res) {
    const sessionId = req.cookies[AUTH_CONFIG.COOKIE_NAME];

    await service.processLogout(sessionId);

    res.clearCookie(AUTH_CONFIG.COOKIE_NAME, AUTH_CONFIG.CLEAR_COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  },
};
