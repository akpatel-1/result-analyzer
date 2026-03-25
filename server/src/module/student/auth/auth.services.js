import { pool } from '../../../infra/database/db.js';
import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { sendOtp } from './auth.email.service.js';
import { OTP } from './auth.otp.js';
import { otpRepository } from './auth.otp.repository.js';
import { repository } from './auth.repository.js';
import { token } from './auth.token.js';

export const service = {
  async processOtpRequest({ email }) {
    const student = await repository.findStudentByEmail(pool, email);

    if (!student) {
      throw new ApiError(ERROR_CONFIG.EMAIL_NOT_FOUND);
    }

    const { otp, hashedOtp } = OTP.generateOtp();
    const hashedEmail = token.generateHash(email);
    await otpRepository.create(hashedEmail, hashedOtp);
    try {
      await sendOtp(email, otp);
    } catch (err) {
      await otpRepository.delete(hashedEmail);
      throw err;
    }
    return otp;
  },
};
