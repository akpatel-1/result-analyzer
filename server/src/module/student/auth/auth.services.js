import { pool } from '../../../infra/database/db.js';
import { ApiError } from '../../../utils/api.error.js';
import { withTransaction } from '../../../utils/transaction.js';
import { ERROR_CONFIG } from '../../error.config.js';
import { AUTH_CONFIG } from './auth.config.js';
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
  },

  async processOtpVerification({ email, otp }) {
    await this._authenticate(email, otp);
    const { studentId, rawToken } = await this._createSession(email);
    const accessToken = token.generateAccessToken(studentId);
    return { accessToken, refreshToken: rawToken };
  },

  async _authenticate(email, otp) {
    const hashedEmail = token.generateHash(email);
    const otpRecord = await otpRepository.get(hashedEmail);

    if (!otpRecord || !otpRecord.hashedOtp) {
      throw new ApiError(ERROR_CONFIG.INVALID_OR_EXPIRED_OTP);
    }

    if (!OTP.verifyOtp(otp, otpRecord.hashedOtp)) {
      throw new ApiError(ERROR_CONFIG.INVALID_OR_EXPIRED_OTP);
    }

    await otpRepository.delete(hashedEmail);
  },

  async _createSession(email) {
    return withTransaction(pool, async (client) => {
      const student = await repository.findStudentByEmail(client, email);
      const { rawToken, hashedToken } = token.generateAuthToken();
      await repository.createRefreshToken(client, {
        studentId: student.id,
        tokenHash: hashedToken,
        expiresAt: AUTH_CONFIG.REFRESH_TOKEN_EXPIRE,
      });
      return { studentId: student.id, rawToken };
    });
  },

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(ERROR_CONFIG.SESSION_EXPIRED);
    }
    const hashedToken = token.generateHash(refreshToken);

    const { studentId, rawToken } = await withTransaction(
      pool,
      async (client) => {
        const studentId = await repository.markRefreshTokenAsRevoked(
          client,
          hashedToken
        );

        if (!studentId) {
          throw new ApiError(ERROR_CONFIG.SESSION_EXPIRED);
        }

        const rawToken = await this._createSessionById(client, studentId);

        return { studentId, rawToken };
      }
    );
    const accessToken = token.generateAccessToken(studentId);

    return { accessToken, refreshToken: rawToken };
  },

  async _createSessionById(client, studentId) {
    const { rawToken, hashedToken } = token.generateAuthToken();
    await repository.createRefreshToken(client, {
      studentId,
      tokenHash: hashedToken,
      expiresAt: AUTH_CONFIG.REFRESH_TOKEN_EXPIRE,
    });
    return rawToken;
  },
};
