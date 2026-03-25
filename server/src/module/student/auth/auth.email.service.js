import resend from '../../../infra/email/email.js';
import { generateOtpTemplate } from '../../../infra/email/otp.template.js';
import { ApiError } from '../../../utils/api.error.js';
import { ERROR_CONFIG } from '../../error.config.js';

export async function sendOtp(email, otp) {
  // try {
  //   const response = await resend.emails.send({
  //     from: 'insight <onboarding@resend.dev>',
  //     to: email,
  //     subject: 'Your insight Verification Code',
  //     html: generateOtpTemplate(otp),
  //   });

  //   return response;
  // } catch (error) {
  //   throw new ApiError(ERROR_CONFIG.EMAIL_SEND_FAILED);
  // }
  console.log(otp);
}
