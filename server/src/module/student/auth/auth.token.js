import crypto from 'crypto';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const token = {
  generateAuthToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');
    return { rawToken, hashedToken };
  },

  generateHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  generateAccessToken(userId) {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '30m',
    });
  },
};
