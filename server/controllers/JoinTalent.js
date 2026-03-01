const JoinTalent = require("../models/JoinTalent");
const nodemailer = require("nodemailer");
const Joi = require('joi');
const xss = require('xss');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Validation schema
const joinTalentSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().trim(),
  lastName: Joi.string().min(2).max(50).required().trim(),
  email: Joi.string().email().required().lowercase().trim(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]{10,20}$/).required().trim()
    .messages({
      'string.pattern.base': 'Phone number must be valid (10-20 digits)'
    }),
  location: Joi.string().min(2).max(100).required().trim(),
  anythingElse: Joi.string().max(500).allow('').trim(),
});

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

exports.createRequest = async (req, res) => {
  try {
    // Validate input
    const { error, value } = joinTalentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: "Resume/CV file is required" });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type. Only PDF, DOC, DOCX, JPG, PNG allowed" });
    }

    // Validate file size
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: "File size must be less than 5MB" });
    }

    const { firstName, lastName, email, phone, location, anythingElse } = value;

    // Sanitize inputs
    const sanitizedData = {
      firstName: xss(firstName),
      lastName: xss(lastName),
      email: xss(email),
      phone: xss(phone),
      location: xss(location),
      anythingElse: xss(anythingElse || ''),
    };

    const newRequest = await JoinTalent.create({
      ...sanitizedData,
      fileUrl: req.file.path,
      originalFileName: req.file.originalname,
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: "New JoinTalent Request Submission",
      text: `
New submission:
First Name: ${sanitizedData.firstName}
Last Name: ${sanitizedData.lastName}
Email: ${sanitizedData.email}
Phone: ${sanitizedData.phone}
Location: ${sanitizedData.location}
Anything Else: ${sanitizedData.anythingElse}
      `,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Request submitted successfully" });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Server error" });
  }
};
