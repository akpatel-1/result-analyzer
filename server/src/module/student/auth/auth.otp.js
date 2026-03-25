import crypto, { verify } from 'crypto';
import 'dotenv/config';

const secret = process.env.OTP_SECRET;
export const OTP = {
  generateOtp() {
    const otp = crypto.randomInt(100000, 1000000);
    const hashedOtp = crypto
      .createHmac('sha256', secret)
      .update(otp.toString())
      .digest('hex');

    return { otp, hashedOtp };
  },

  verifyOtp(otp, hashedOtp) {
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(otp.toString())
      .digest('hex');

    const bufferA = Buffer.from(generatedHash, 'hex');
    const bufferB = Buffer.from(hashedOtp, 'hex');

    if (bufferA.length !== bufferB.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufferA, bufferB);
  },
};
