const nodemailer = require("nodemailer");
const ContactRequest = require("../models/ContactRequest");
const Joi = require('joi')
const xss = require("xss"); // <--- Ensure this is imported!
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validation schema for contact form with trim
const contactSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name must be less than 100 characters',
    'any.required': 'Full name is required'
  }),
  emailAddress: Joi.string().trim().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email address is required'
  }),
  inquiryType: Joi.string().valid('General', 'Support', 'Careers', 'Business Inquiry').required().messages({
    'any.only': 'Please select a valid inquiry type',
    'any.required': 'Please select an inquiry type'
  }),
  message: Joi.string().trim().min(10).max(5000).required().messages({
    'string.min': 'Message must be at least 10 characters',
    'string.max': 'Message must be less than 5000 characters',
    'any.required': 'Message is required'
  })
});

// Enhanced sanitization: removes newlines + XSS protection using xss library
const sanitize = (str = '') => {
  const cleaned = String(str).replace(/[\r\n]/g, '');
  return xss(cleaned);
};

exports.createContactRequest = async (req, res) => {
  try {
    // Validate input data
    const { error, value } = contactSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        errors: errorMessages
      });
    }

    const { fullName, emailAddress, inquiryType, message } = value;

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
    res
      .status(201)
      .json({
        success: true,
        message: "Contact request submitted successfully.",
      });
  } catch (error) {
    console.error("Error submitting contact form:", error);

    // Handle specific errors
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, error: "Invalid data format" });
    }

    res.status(500).json({ success: false, error: "Server error. Failed to send request." });
  }
};
