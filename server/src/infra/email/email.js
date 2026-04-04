import nodemailer from 'nodemailer';

const EMAIL_TIMEOUT_MS = Number(process.env.EMAIL_TIMEOUT_MS || 15000);

const smtpConfigured = Boolean(
  process.env.BREVO_USER && process.env.BREVO_PASS
);

const transporter = smtpConfigured
  ? nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.BREVO_SMTP_PORT || 587),
      secure: Number(process.env.BREVO_SMTP_PORT || 587) === 465,
      connectionTimeout: EMAIL_TIMEOUT_MS,
      greetingTimeout: EMAIL_TIMEOUT_MS,
      socketTimeout: EMAIL_TIMEOUT_MS,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    })
  : null;

async function sendViaSmtp({ to, subject, text, html }) {
  if (!transporter) {
    const err = new Error('SMTP credentials are not configured');
    err.code = 'SMTP_NOT_CONFIGURED';
    throw err;
  }

  return transporter.sendMail({
    from: process.env.BREVO_FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });
}

async function sendViaBrevoApi({ to, subject, text, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.BREVO_FROM_EMAIL;

  if (!apiKey) {
    const err = new Error('BREVO_API_KEY is missing');
    err.code = 'BREVO_API_KEY_MISSING';
    throw err;
  }

  if (!from) {
    const err = new Error('BREVO_FROM_EMAIL is missing');
    err.code = 'BREVO_FROM_EMAIL_MISSING';
    throw err;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), EMAIL_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { email: from },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      const err = new Error(`Brevo API failed with status ${response.status}`);
      err.code = 'BREVO_API_SEND_FAILED';
      err.responseCode = response.status;
      err.response = body;
      throw err;
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendEmail({ to, subject, text, html }) {
  const provider = process.env.EMAIL_PROVIDER 

  if (provider === 'api') {
    return sendViaBrevoApi({ to, subject, text, html });
  }

  try {
    return await sendViaSmtp({ to, subject, text, html });
  } catch (smtpError) {
    if (process.env.BREVO_API_KEY) {
      console.error('SMTP send failed. Falling back to Brevo API.', {
        code: smtpError?.code,
        command: smtpError?.command,
        responseCode: smtpError?.responseCode,
        message: smtpError?.message,
      });
      return sendViaBrevoApi({ to, subject, text, html });
    }

    throw smtpError;
  }
}

export default { sendEmail };
