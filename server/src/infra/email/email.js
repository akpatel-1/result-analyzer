import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_API);

export default resend;
