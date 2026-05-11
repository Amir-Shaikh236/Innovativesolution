'use strict';
const nodemailer = require('nodemailer');

// Single shared transporter for the entire application
// Created as a function so it always reads fresh env vars
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

// Send email verification link after signup
const sendVerificationEmail = async (email, token) => {
  const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>',
    to: email,
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
};

// Generic send — used for password reset and any other emails
const sendEmail = async ({ to, subject, text }) => {
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>',
    to,
    subject,
    html: text,
  });
};

// Send contact form notification to admin
const sendContactEmail = async ({ fullName, emailAddress, inquiryType, message }) => {
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>',
    to: process.env.EMAIL_USER,
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
};

// Send team-up request notification to admin
const sendTeamUpEmail = async ({ companyName, firstName, lastName, email, phone, mainCategoryName, subCategoryName, description }) => {
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>',
    to: process.env.EMAIL_USER,
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
};

// Send join talent notification to admin (with resume attachment)
const sendJoinTalentEmail = async ({ firstName, lastName, email, phone, location, anythingElse, file }) => {
  await createTransporter().sendMail({
    from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>',
    to: process.env.EMAIL_USER,
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
    attachments: file ? [{ filename: file.originalname, path: file.path }] : [],
  });
};

module.exports = {
  sendVerificationEmail,
  sendEmail,
  sendContactEmail,
  sendTeamUpEmail,
  sendJoinTalentEmail,
};
