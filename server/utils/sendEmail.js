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
    subject: 'Action Required: Verify Your Email - Innovative Staffing Solutions',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
      </head>
      <body style="background-color: #f4f7f6; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; max-width: 600px; width: 100%;">
                
                <tr>
                  <td style="background-color: #0b1120; padding: 35px 40px; text-align: center;">
                    <h1 style="color: #4ade80; margin: 0; font-size: 24px; letter-spacing: 1.5px; text-transform: uppercase;">
                      Innovative Staffing
                    </h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px 40px 30px 40px;">
                    <h2 style="color: #1f2937; margin-top: 0; font-size: 22px; font-weight: 600;">Welcome aboard!</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                      Thank you for registering. To complete your setup and secure your account, please verify your email address by clicking the secure button below.
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 10px 0 30px 0;">
                          <a href="${link}" style="background-color: #4ade80; color: #0b1120; font-weight: 700; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
                      <strong style="color: #ef4444;">Note:</strong> This secure verification link will expire in exactly <strong>1 hour</strong>. If you did not request this account creation, you can safely ignore and delete this email.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: #f9fafb; padding: 25px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px 0;">
                      &copy; ${new Date().getFullYear()} Innovative Staffing Solutions. All rights reserved.
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin: 0; word-break: break-all; line-height: 1.5;">
                      If the button above doesn't work, copy and paste this link into your web browser:<br>
                      <a href="${link}" style="color: #3b82f6; text-decoration: underline;">${link}</a>
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
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
    reply_to: emailAddress, // Crucial: Allows your team to hit 'Reply' and email the user directly
    subject: `New Inquiry [${inquiryType}] - ${fullName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="background-color: #f3f4f6; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; max-width: 600px; width: 100%;">
                
                <tr>
                  <td style="background-color: #0b1120; padding: 25px 40px; border-bottom: 4px solid #4ade80;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">
                      New Contact Submission
                    </h1>
                    <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 14px;">
                      Innovative Staffing Solutions - Automated Routing
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 35px 40px 20px 40px;">
                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Sender Details</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px;">
                      <tr>
                        <td width="130" style="padding-bottom: 12px; color: #6b7280; font-size: 14px; font-weight: 500;">Full Name:</td>
                        <td style="padding-bottom: 12px; color: #111827; font-size: 15px; font-weight: 600;">${fullName}</td>
                      </tr>
                      <tr>
                        <td width="130" style="padding-bottom: 12px; color: #6b7280; font-size: 14px; font-weight: 500;">Email Address:</td>
                        <td style="padding-bottom: 12px; font-size: 15px;">
                          <a href="mailto:${emailAddress}" style="color: #3b82f6; text-decoration: none; font-weight: 600;">${emailAddress}</a>
                        </td>
                      </tr>
                      <tr>
                        <td width="130" style="color: #6b7280; font-size: 14px; font-weight: 500;">Inquiry Type:</td>
                        <td>
                          <span style="background-color: #dcfce7; color: #166534; padding: 4px 10px; border-radius: 4px; font-size: 13px; font-weight: 600; display: inline-block;">
                            ${inquiryType}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 10px 40px 40px 40px;">
                    <h2 style="color: #111827; margin: 0 0 15px 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Message Content</h2>
                    
                    <div style="background-color: #ffffff; border-left: 4px solid #4ade80; padding: 15px 20px; color: #374151; font-size: 15px; line-height: 1.6; border-top: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; border-radius: 0 6px 6px 0; white-space: pre-wrap;">${message}</div>
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: #f9fafb; padding: 20px 40px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                      To reply to this inquiry, simply click <strong>"Reply"</strong> in your email client.
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
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