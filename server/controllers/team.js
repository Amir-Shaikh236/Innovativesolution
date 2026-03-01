const nodemailer = require("nodemailer");
const TeamUpRequest = require("../models/TeamUpRequest");
const Category = require("../models/Category"); // Import your Category model
const Subpage = require("../models/Subpage"); // Import your Subpage model
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

exports.createTeamUpRequest = async (req, res) => {
  try {
    const {
      companyName,
      firstName,
      lastName,
      phone,
      email,
      description,
      mainCategory,
      subCategory,
    } = req.body;

    // Validate required fields
    if (!mainCategory || mainCategory.trim() === "") {
      return res.status(400).json({ error: "Main category is required." });
    }
    if (!subCategory || subCategory.trim() === "") {
      return res.status(400).json({ error: "Sub category is required." });
    }

    // Find the names for the main category and subcategory using their IDs
    let mainCategoryName = "Not specified";
    let subCategoryName = "Not specified";

    if (mainCategory) {
      const mainCat = await Category.findById(mainCategory);
      if (mainCat) {
        mainCategoryName = mainCat.name;
      }
    }

    if (subCategory) {
      const subCat = await Subpage.findById(subCategory);
      if (subCat) {
        subCategoryName = subCat.title || subCat.name; // Use 'title' or 'name'
      }
    }

    // Optional: Save the data to your database
    const newRequest = await TeamUpRequest.create({
      companyName,
      firstName,
      lastName,
      phone,
      email,
      description,
      mainCategory, // Save the ID for database integrity
      subCategory,  // Save the ID for database integrity
    });

    // Create the email content with the names
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: "New Team-Up Request Submission",
      text: `
        A new Team-Up request has been submitted.

        Company Name: ${companyName}
        Contact Name: ${firstName} ${lastName}
        Email: ${email}
        Phone: ${phone}  
        Main Category: ${mainCategoryName}
        Sub Category: ${subCategoryName}
        Description: ${description}
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