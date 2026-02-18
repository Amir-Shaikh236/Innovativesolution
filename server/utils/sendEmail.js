const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  try {
    const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: `"INNOVATIVE STAFFING SOLUTION" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - INNOVATIVE STAFFING SOLUTION',
      html: `
        <h2>Email Verification</h2>
        <p>Please click the button below to verify your email</p>
        <a href="${link}" style="padding:10px 15px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:5px">
          Verify Email
        </a>
        <p>This link will expire in 1 Hour.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);

  } catch (err) {
    console.error("Verification email failed:", err);
    throw err;
  }
};

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"INNOVATIVE STAFFING SOLUTION" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
};

module.exports = { sendVerificationEmail, sendEmail };
