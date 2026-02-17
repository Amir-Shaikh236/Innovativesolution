const nodemailer = require("nodemailer");
const ContactRequest = require("../models/ContactRequest");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.createContactRequest = async (req, res) => {
  try {
    const { fullName, emailAddress, inquiryType, message } = req.body;

    // Save to database (removed unused variable)
    await ContactRequest.create({
      fullName,
      emailAddress: emailAddress.toLowerCase(),
      inquiryType,
      message,
    });

    // Create the email content with sanitized input
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"INNOVATIVE STAFFING SOLUTION" <no-reply@innovativestaffing.com>',
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission: ${inquiryType}`,
      text: `
        A new message has been submitted via the contact form.

        Full Name: ${fullName}
        Email: ${emailAddress}
        Inquiry Type: ${inquiryType}
        Message:
        ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a success message
    res.status(201).json({ success: true, message: "Contact request submitted successfully." });
  } catch (error) {
    console.error("Error submitting contact form:", error);

    // Handle specific errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: "Invalid data format" });
    }

    res.status(500).json({ success: false, error: "Server error. Failed to send request." });
  }
};
