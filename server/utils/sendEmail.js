'use strict';
const { Resend } = require('resend');

// Single Resend client — reads API key from env at call time
const getClient = () => new Resend(process.env.RESEND_API_KEY);

// Default sender address (must be a verified domain in your Resend account)
const FROM = process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>';

// ─── Send email verification link after signup ────────────────────────────────
const sendVerificationEmail = async (email, token) => {
  const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

  const { error } = await getClient().emails.send({
    from: FROM,
    to: [email],
    subject: 'Verify Your Email - INNOVATIVE STAFFING SOLUTION',
    html: `
      <h2>Email Verification</h2>
      <p>Please click the button below to verify your email address.</p>
      <a href="${link}" style="padding:10px 15px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:5px">
        Verify Email
      </a>
      <p>This link will expire in 1 hour.</p>
    `,
  });

  if (error) throw new Error(`sendVerificationEmail failed: ${error.message}`);
};

// ─── Generic send — used for password reset and any other emails ──────────────
const sendEmail = async ({ to, subject, text }) => {
  const { error } = await getClient().emails.send({
    from: FROM,
    to: [to],
    subject,
    html: text,
  });

  if (error) throw new Error(`sendEmail failed: ${error.message}`);
};

// ─── Send contact form notification to admin ─────────────────────────────────
const sendContactEmail = async ({ fullName, emailAddress, inquiryType, message }) => {
  const { error } = await getClient().emails.send({
    from: FROM,
    to: [process.env.EMAIL_USER],
    subject: `New Contact Form Submission: ${inquiryType}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${emailAddress}</p>
      <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  if (error) throw new Error(`sendContactEmail failed: ${error.message}`);
};

// ─── Send team-up request notification to admin ───────────────────────────────
const sendTeamUpEmail = async ({ companyName, firstName, lastName, email, phone, mainCategoryName, subCategoryName, description }) => {
  const { error } = await getClient().emails.send({
    from: FROM,
    to: [process.env.EMAIL_USER],
    subject: 'New Team-Up Request Submission',
    html: `
      <h2>New Team-Up Request</h2>
      <p><strong>Company Name:</strong> ${companyName}</p>
      <p><strong>Contact Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Main Category:</strong> ${mainCategoryName}</p>
      <p><strong>Sub Category:</strong> ${subCategoryName}</p>
      <p><strong>Description:</strong> ${description}</p>
    `,
  });

  if (error) throw new Error(`sendTeamUpEmail failed: ${error.message}`);
};

// ─── Send join talent notification to admin (with resume attachment) ──────────
const sendJoinTalentEmail = async ({ firstName, lastName, email, phone, location, anythingElse, file }) => {
  const fs = require('fs');

  // Build attachments array only if a file was uploaded
  // Resend expects: { filename, content } where content is a Buffer or base64 string
  const attachments = file
    ? [{ filename: file.originalname, content: fs.readFileSync(file.path) }]
    : [];

  const { error } = await getClient().emails.send({
    from: FROM,
    to: [process.env.EMAIL_USER],
    subject: 'New Join Talent Request Submission',
    html: `
      <h2>New Join Talent Submission</h2>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Additional Info:</strong> ${anythingElse || 'N/A'}</p>
    `,
    attachments,
  });

  if (error) throw new Error(`sendJoinTalentEmail failed: ${error.message}`);
};

module.exports = {
  sendVerificationEmail,
  sendEmail,
  sendContactEmail,
  sendTeamUpEmail,
  sendJoinTalentEmail,
};