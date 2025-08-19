import nodemailer from 'nodemailer';
import { otpService } from '../domain/otp/otp.service.js';

async function sendOtp(email: string) {
  const otp = await otpService.gen(email);

  const testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"Dummy" <no-reply@dummy.com>',
    to: otp.email,
    subject: 'Your Authentication Code',
    text: `Code ${otp.code}`,
    html: `<b>Code ${otp.code}</b>`,
  });

  // return;
  return nodemailer.getTestMessageUrl(info);
}

export const emailClient = {
  sendOtp,
};
