// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>',
    to,
    subject: 'Your INNOVATIVE STAFFING SOLUTION OTP Code',
    text: `Dear User,

Your OTP code for verification on INNOVATIVE STAFFING SOLUTION is: ${otp}

This code will expire in 10 minutes.

If you did not request this, please ignore this email.

Thank you,
INNOVATIVE STAFFING SOLUTION Team`,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };
