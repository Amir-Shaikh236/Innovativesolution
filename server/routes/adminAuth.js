const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter for admin login
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Public login route with rate limiting
router.post('/login', adminLoginLimiter, adminController.login);
router.post('/admin-Logout', adminController.AdminLogout);
router.get('/getadmin', adminAuth, adminController.getadmin);

module.exports = router;
