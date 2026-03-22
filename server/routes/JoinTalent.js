const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { createRequest } = require("../controllers/JoinTalent");
const rateLimit = require('express-rate-limit');

// Rate limiter for form submissions
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 submissions per hour
  message: 'Too many submissions, please try again after 1 hour',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/", formLimiter, upload.single("file"), createRequest);

module.exports = router;
