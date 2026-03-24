import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
});

export async function sendOTP(email, otp, subject = 'VEYRA - Your OTP Verification Code') {
  const message = `Hello,\n\nYour OTP verification code is: ${otp}\n\nThis code will expire in 15 minutes.\n\nIf you did not request this code, please ignore this email.\n\nRegards,\nVEYRA Team`;
  const mailOptions = {
    from: process.env.MAIL_FROM || 'noreply@veyra.com',
    to: email,
    subject,
    text: message
  };
  if (!process.env.SMTP_USER) {
    console.log(`OTP for user email is: ${otp}`);
    return true;
  }
  
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('SMTP Error:', error.message);
    return false;
  }
}

export async function sendResetOTP(email, otp) {
  return sendOTP(email, otp, 'VEYRA - Password Reset Code');
}
