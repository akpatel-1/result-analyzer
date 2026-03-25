export function generateOtpTemplate(otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your insight Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
          <tr>
            <td align="center">
              <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e4e4e7; overflow: hidden;">
                
                <!-- Top accent bar -->
                <tr>
                  <td style="height: 4px; background-color: #18181b;"></td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding: 40px 40px 32px;">
                    
                    <p style="margin: 0 0 4px; font-size: 20px; font-weight: 700; color: #18181b;">
                      insight
                    </p>
                    <p style="margin: 0 0 32px; font-size: 14px; color: #71717a;">
                      Email Verification
                    </p>

                    <p style="margin: 0 0 8px; font-size: 14px; color: #3f3f46;">
                      Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.
                    </p>

                    <!-- OTP Box -->
                    <div style="margin: 24px 0; padding: 24px; background-color: #f4f4f5; border-radius: 8px; text-align: center;">
                      <p style="margin: 0 0 4px; font-size: 12px; color: #71717a; letter-spacing: 0.05em; text-transform: uppercase;">
                        Verification Code
                      </p>
                      <p style="margin: 0; font-size: 36px; font-weight: 700; letter-spacing: 0.2em; color: #18181b;">
                        ${otp}
                      </p>
                    </div>

                    <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
                      If you didn't request this, you can safely ignore this email.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 20px 40px; border-top: 1px solid #f4f4f5;">
                    <p style="margin: 0; font-size: 12px; color: #a1a1aa; text-align: center;">
                      © ${new Date().getFullYear()} insight - Get you insights
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
