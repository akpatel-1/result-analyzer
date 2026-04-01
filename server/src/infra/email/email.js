import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  return transporter.sendMail({
    from: process.env.BREVO_FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });
}

export default { sendEmail };
