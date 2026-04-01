import { sendEmail } from '../../../infra/email/email.js';
import { generateOtpTemplate } from '../../../infra/email/otp.template.js';
import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';

export async function sendOtp(email, otp) {
  try {
    const response = await sendEmail({
      to: email,
      subject: 'Your insight Verification Code',
      text: `Your OTP is ${otp}`,
      html: generateOtpTemplate(otp),
    });

    return response;
  } catch (error) {
    throw new ApiError(ERROR_CONFIG.EMAIL_SEND_FAILED);
  }
}
