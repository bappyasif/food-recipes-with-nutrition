"use server"

import nodemailer from 'nodemailer';

export async function resendSMTP() {

  console.log(process.env.NEXT_PUBLIC_RESEND_API_KEY, process.env.NEXT_RESEND_API_KEY)

  const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    secure: true,
    port: 465,
    auth: {
      user: 'resend',
      pass: process.env.NEXT_RESEND_API_KEY,
    },
  });

  const info = await transporter.sendMail({
    from: 'onboarding@resend.dev',
    to: 'asifuzzamanbappy@gmail.com',
    subject: 'Hello World',
    html: '<strong>!!It works!!</strong>'
  });

  console.log('Message sent: %s', info.messageId);
}

resendSMTP().catch(console.error);