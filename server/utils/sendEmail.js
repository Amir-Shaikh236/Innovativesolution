const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  // verification Link
  const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>',
    to: email,
    subject: 'Verify Your Email - INNOVATIVE STAFFING SOLUTION',
    html: `
        <h2> Email Verification </h2>
        <p>Please click the button below to verify your email </p>
        <a href="${link}" style="padding:10px 15px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:5px"> Verify Email </a>
        <p> This link will expire in 1 Hour. </p>
        `
  };
  await transporter.sendMail(mailOptions);
}

const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING" <no-reply@innovativestaffing.com>',
    to: options.to,
    subject: options.subject,
    html: options.text, // In your controller, we passed the HTML string as 'text'
  };

  await transporter.sendMail(mailOptions);
};

// Export both functions
module.exports = { sendVerificationEmail, sendEmail };
