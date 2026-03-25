
import { AUTH_CONFIG } from './auth.config.js';
import { service } from './auth.services.js';

export const controller = {
  async handleOtpRequest(req, res) {
    const otp = await service.processOtpRequest(req.data);
    res
      .status(201)
      .json({ success: true, message: 'Please verify your email to continue' });
  },

  async handleOtpVerification(req, res) {
    const { accessToken, refreshToken } = await service.processOtpVerification(
      req.data
    );

    res.cookie(
      AUTH_CONFIG.ACCESS_COOKIE_NAME,
      accessToken,
      AUTH_CONFIG.ACCESS_COOKIE_OPTIONS
    );

    res.cookie(
      AUTH_CONFIG.REFRESH_COOKIE_NAME,
      refreshToken,
      AUTH_CONFIG.REFRESH_COOKIE_OPTIONS
    );

    return res.status(200).json({ message: 'Login successful.' });
  },
};
