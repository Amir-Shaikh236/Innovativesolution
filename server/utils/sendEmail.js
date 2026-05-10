'use strict';
const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendVerificationEmail = async (email, token) => {
//   // verification Link
//   const link = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

//   const mailOptions = {
//     from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>',
//     to: email,
//     subject: 'Verify Your Email - INNOVATIVE STAFFING SOLUTION',
//     html: `
//         <h2> Email Verification </h2>
//         <p>Please click the button below to verify your email </p>
//         <a href="${link}" style="padding:10px 15px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:5px"> Verify Email </a>
//         <p> This link will expire in 1 Hour. </p>
//         `
//   };
//   // await transporter.sendMail(mailOptions);

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Message sent:", info.messageId);

//     if (info.rejected.length > 0) {
//       console.warn("Some recipients were rejected:", info.rejected);
//     }
//   } catch (err) {
//     switch (err.code) {
//       case "ECONNECTION":
//       case "ETIMEDOUT":
//         console.error("Network error - retry later:", err.message);
//         break;
//       case "EAUTH":
//         console.error("Authentication failed:", err.message);
//         break;
//       case "EENVELOPE":
//         console.error("Invalid recipients:", err.rejected);
//         break;
//       default:
//         console.error("Send failed:", err.message);
//     }
//   }
// }

// const sendEmail = async (options) => {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING" <no-reply@innovativestaffing.com>',
//     to: options.to,
//     subject: options.subject,
//     html: options.text, // we passed the HTML string as 'text'
//   };

//   await transporter.sendMail(mailOptions);
// };

// // Export both functions
// module.exports = { sendVerificationEmail, sendEmail };




// ---------------------------------------------------------------------------
// 1.  Transporter — created once, reused across calls (connection pooling)
// ---------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE !== 'false', // default true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App Password, not account password
  },

  pool: true,
  maxConnections: 5,
  maxMessages: 100,

  // Timeouts (ms)
  connectionTimeout: 10_000,  // 10 s to establish connection
  greetingTimeout: 8_000,   // 8 s for server greeting
  socketTimeout: 30_000,  // 30 s of socket inactivity

  // Improve deliverability — tell the server our real domain
  // tls: {
  //   rejectUnauthorized: true, // always verify the cert in production
  // },
  connectionTimeout: 10000, // 10 seconds — fail fast instead of hanging
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// ---------------------------------------------------------------------------
// 2.  Verify transporter on startup (catches mis-config early)
// ---------------------------------------------------------------------------
transporter.verify((err) => {
  if (err) {
    console.error('[emailService] SMTP connection failed:', err.message);
    // Do NOT crash the process — the app can still run; emails will fail gracefully
  } else {
    console.log('[emailService] SMTP connection verified — ready to send');
  }
});

// ---------------------------------------------------------------------------
// 3.  Internal send helper with retry logic
// ---------------------------------------------------------------------------
const RETRYABLE_CODES = new Set(['ECONNECTION', 'ETIMEDOUT', 'ECONNRESET', 'ESOCKET']);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1_500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function sendWithRetry(mailOptions) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);

      // Nodemailer does NOT throw for rejected recipients — we must check manually
      if (info.rejected && info.rejected.length > 0) {
        throw Object.assign(
          new Error(`Recipients rejected by server: ${info.rejected.join(', ')}`),
          { code: 'EENVELOPE', rejected: info.rejected }
        );
      }

      console.log(`[emailService] Message sent (attempt ${attempt}):`, info.messageId);
      return info;

    } catch (err) {
      lastError = err;
      const isRetryable = RETRYABLE_CODES.has(err.code);

      if (!isRetryable || attempt === MAX_RETRIES) {
        // Permanent error or exhausted retries — log and re-throw
        logMailError(err, mailOptions.to);
        throw err;
      }

      console.warn(
        `[emailService] Transient error on attempt ${attempt} (${err.code}), ` +
        `retrying in ${RETRY_DELAY_MS}ms…`
      );
      await sleep(RETRY_DELAY_MS * attempt); // exponential-ish back-off
    }
  }

  throw lastError; // unreachable, but satisfies linters
}

// ---------------------------------------------------------------------------
// 4.  Error logger (centralised, easy to swap for Sentry / Datadog / etc.)
// ---------------------------------------------------------------------------
function logMailError(err, recipient) {
  switch (err.code) {
    case 'EAUTH':
      console.error(
        '[emailService] ❌ Authentication failed. ' +
        'Check SMTP_USER / SMTP_PASS and ensure you are using a Gmail App Password.',
        err.message
      );
      break;
    case 'EENVELOPE':
      console.error('[emailService] ❌ Invalid / rejected recipients:', err.rejected);
      break;
    case 'ECONNECTION':
    case 'ETIMEDOUT':
    case 'ECONNRESET':
      console.error('[emailService] ❌ Network/connection error:', err.message);
      break;
    default:
      console.error(`[emailService] ❌ Failed to send to ${recipient}:`, err.message);
  }
}

// ---------------------------------------------------------------------------
// 5.  Shared mail defaults (improves deliverability & spam score)
// ---------------------------------------------------------------------------
const FROM_ADDRESS =
  process.env.EMAIL_FROM ||
  '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>';
function baseMailOptions(overrides = {}) {
  return {
    from: FROM_ADDRESS,

    // Reply-To keeps your From address a no-reply while still being reachable
    replyTo: process.env.EMAIL_REPLY_TO || FROM_ADDRESS,

    // Message-ID in your own domain helps DKIM / spam filters
    // Nodemailer generates one automatically — leaving it out is fine

    headers: {
      // Suppress auto-replies (OOO messages, vacation responders)
      'X-Auto-Response-Suppress': 'OOF, AutoReply',
      // Mark as automated so mail clients can categorise it correctly
      'Auto-Submitted': 'auto-generated',
    },

    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 6.  sendVerificationEmail
// ---------------------------------------------------------------------------

async function sendVerificationEmail(email, token) {
  const link =
    `${process.env.BACKEND_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  // Always include both html AND text — missing plain-text is a spam signal
  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f4f4">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
          <!-- Header -->
          <tr>
            <td style="background:#0d6efd;padding:32px 40px;text-align:center">
              <h1 style="margin:0;color:#ffffff;font-size:22px;letter-spacing:.5px">
                INNOVATIVE STAFFING SOLUTION
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px">
              <h2 style="margin:0 0 16px;color:#1a1a1a;font-size:20px">Verify Your Email Address</h2>
              <p style="margin:0 0 24px;color:#555555;font-size:15px;line-height:1.6">
                Thanks for signing up! Click the button below to confirm your email address
                and activate your account.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:6px;background:#0d6efd">
                    <a href="${link}"
                       style="display:inline-block;padding:14px 28px;color:#ffffff;
                              font-size:15px;font-weight:bold;text-decoration:none;
                              border-radius:6px">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:#888888;font-size:13px;line-height:1.5">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${link}" style="color:#0d6efd;word-break:break-all">${link}</a>
              </p>
              <p style="margin:16px 0 0;color:#888888;font-size:13px">
                This link expires in <strong>1 hour</strong>. If you didn't create an account,
                you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fa;padding:20px 40px;text-align:center;
                       border-top:1px solid #e9ecef">
              <p style="margin:0;color:#aaaaaa;font-size:12px">
                © ${new Date().getFullYear()} Innovative Staffing Solution. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const textBody = `
INNOVATIVE STAFFING SOLUTION — Email Verification

Please verify your email address by visiting the link below:

${link}

This link expires in 1 hour.

If you didn't create an account, please ignore this email.
`.trim();

  await sendWithRetry(
    baseMailOptions({
      to: email,
      subject: 'Verify Your Email — INNOVATIVE STAFFING SOLUTION',
      html: htmlBody,
      text: textBody, // plain-text fallback (crucial for spam filters)
    })
  );
}

// ---------------------------------------------------------------------------
// 7.  sendEmail — generic transactional helper
// ---------------------------------------------------------------------------

async function sendEmail(options) {
  if (!options.to || !options.subject || !options.html) {
    throw new Error('[emailService] sendEmail requires "to", "subject", and "html".');
  }

  await sendWithRetry(
    baseMailOptions({
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html), // auto-generate plain text if omitted
      ...(options.replyTo && { replyTo: options.replyTo }),
    })
  );
}

// ---------------------------------------------------------------------------
// 8.  Tiny HTML → plain-text stripper (avoids a heavy dependency)
// ---------------------------------------------------------------------------
function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// 9.  Exports
// ---------------------------------------------------------------------------
module.exports = { sendVerificationEmail, sendEmail };