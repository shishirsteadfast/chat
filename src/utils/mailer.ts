// src/utils/mailer.ts
import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.mail.host,
  port: env.mail.port,
  secure: false,
  auth: {
    user: env.mail.user,
    pass: env.mail.pass,
  },
});

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetLink = `${env.appUrl}/admin/reset-password/${token}`;

  await transporter.sendMail({
    from: env.mail.from,
    to,
    subject: 'Password reset request',
    html: `
      <p>You requested a password reset.</p>
      <p>Click here: <a href="${resetLink}">${resetLink}</a></p>
    `,
  });
}
