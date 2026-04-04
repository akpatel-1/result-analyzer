const EMAIL_TIMEOUT_MS = Number(process.env.EMAIL_TIMEOUT_MS || 15000);

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
  return sendViaBrevoApi({ to, subject, text, html });
}

export default { sendEmail };
