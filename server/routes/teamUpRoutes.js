const express = require("express");
const router = express.Router();
const { createTeamUpRequest } = require("../controllers/team");
const rateLimit = require('express-rate-limit');

// Rate limiter for team-up requests
const teamUpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 submissions per hour
    message: 'Too many team-up requests, please try again after 1 hour',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/", createTeamUpRequest);

module.exports = router;
