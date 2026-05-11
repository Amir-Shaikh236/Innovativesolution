const JoinTalent = require("../models/JoinTalent");
const Joi = require('joi');
const xss = require('xss');
const { sendJoinTalentEmail } = require('../utils/sendEmail');
require("dotenv").config();

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

    // Send email via shared utility
    await sendJoinTalentEmail({
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      location: sanitizedData.location,
      anythingElse: sanitizedData.anythingElse,
      file: req.file,
    });

    res.status(201).json({ success: true, message: "Request submitted successfully" });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Server error" });
  }
};
