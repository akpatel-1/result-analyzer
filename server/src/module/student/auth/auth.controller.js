import { success } from 'zod';

import { service } from './auth.services.js';

export const controller = {
  async handleOtpRequest(req, res) {
    const otp = await service.processOtpRequest(req.data);
    res
      .status(201)
      .json({ success: true, message: 'Please verify your email to continue' });
  },
};
