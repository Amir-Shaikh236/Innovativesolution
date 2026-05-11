const ContactRequest = require("../models/ContactRequest");
const Joi = require('joi');
const xss = require("xss");
const { sendContactEmail } = require('../utils/sendEmail');

// Validation schema
const contactSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name must be less than 100 characters',
    'any.required': 'Full name is required',
  }),
  emailAddress: Joi.string().trim().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email address is required',
  }),
  inquiryType: Joi.string()
    .valid('General', 'Support', 'Careers', 'Business Inquiry')
    .required()
    .messages({
      'any.only': 'Please select a valid inquiry type',
      'any.required': 'Please select an inquiry type',
    }),
  message: Joi.string().trim().min(10).max(5000).required().messages({
    'string.min': 'Message must be at least 10 characters',
    'string.max': 'Message must be less than 5000 characters',
    'any.required': 'Message is required',
  }),
});

// Sanitize: strip newlines + XSS
const sanitize = (str = '') => xss(String(str).replace(/[\r\n]/g, ''));

exports.createContactRequest = async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((d) => d.message),
      });
    }

    const { fullName, emailAddress, inquiryType, message } = value;

    // Sanitize before saving
    const sanitizedData = {
      fullName: sanitize(fullName),
      emailAddress: sanitize(emailAddress.toLowerCase()),
      inquiryType: sanitize(inquiryType),
      message: sanitize(message),
    };

    // Save to DB
    await ContactRequest.create(sanitizedData);

    // Send email via shared utility
    await sendContactEmail(sanitizedData);

    return res.status(201).json({
      success: true,
      message: 'Contact request submitted successfully.',
    });
  } catch (error) {
    console.error('Error submitting contact form:', error.message);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, error: 'Invalid data format' });
    }

    return res.status(500).json({ success: false, error: 'Server error. Failed to send request.' });
  }
};
