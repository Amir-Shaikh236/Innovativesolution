const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const rateLimit = require('express-rate-limit');

// Rate limiter: 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: { 
    success: false, 
    error: 'Too many contact requests from this IP, please try again after 15 minutes.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Define the route for your contact form
router.post("/", contactLimiter, contactController.createContactRequest);

module.exports = router;
