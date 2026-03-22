const nodemailer = require("nodemailer");
const TeamUpRequest = require("../models/TeamUpRequest");
const Category = require("../models/Category");
const Subpage = require("../models/Subpage");
const Joi = require('joi');
const xss = require('xss');
const mongoose = require('mongoose');
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
const teamUpSchema = Joi.object({
  companyName: Joi.string().min(2).max(100).required().trim(),
  firstName: Joi.string().min(2).max(50).required().trim(),
  lastName: Joi.string().min(2).max(50).required().trim(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]{10,20}$/).required().trim()
    .messages({
      'string.pattern.base': 'Phone number must be valid (10-20 digits)'
    }),
  email: Joi.string().email().required().lowercase().trim(),
  description: Joi.string().min(10).max(1000).required().trim(),
  mainCategory: Joi.string().required().trim(),
  subCategory: Joi.string().required().trim(),
});

exports.createTeamUpRequest = async (req, res) => {
  try {
    // Validate input
    const { error, value } = teamUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      companyName,
      firstName,
      lastName,
      phone,
      email,
      description,
      mainCategory,
      subCategory,
    } = value;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(mainCategory)) {
      return res.status(400).json({ error: "Invalid main category ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(subCategory)) {
      return res.status(400).json({ error: "Invalid sub category ID" });
    }

    // Sanitize inputs
    const sanitizedData = {
      companyName: xss(companyName),
      firstName: xss(firstName),
      lastName: xss(lastName),
      phone: xss(phone),
      email: xss(email),
      description: xss(description),
    };

    // Find the names for the main category and subcategory using their IDs
    let mainCategoryName = "Not specified";
    let subCategoryName = "Not specified";

    const mainCat = await Category.findById(mainCategory);
    if (mainCat) {
      mainCategoryName = mainCat.name;
    }

    const subCat = await Subpage.findById(subCategory);
    if (subCat) {
      subCategoryName = subCat.title || subCat.name;
    }

    // Save the data to database
    const newRequest = await TeamUpRequest.create({
      ...sanitizedData,
      mainCategory,
      subCategory,
    });

    // Create the email content with the names
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: "New Team-Up Request Submission",
      text: `
        A new Team-Up request has been submitted.

        Company Name: ${sanitizedData.companyName}
        Contact Name: ${sanitizedData.firstName} ${sanitizedData.lastName}
        Email: ${sanitizedData.email}
        Phone: ${sanitizedData.phone}  
        Main Category: ${mainCategoryName}
        Sub Category: ${subCategoryName}
        Description: ${sanitizedData.description}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, message: "Team-Up request submitted successfully." });
  } catch (error) {
    console.error("Error submitting Team-Up request:", error);
    res.status(500).json({ error: "Server error. Failed to send request." });
  }
};