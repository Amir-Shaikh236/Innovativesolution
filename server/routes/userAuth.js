const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser, getMe, logoutUser, forgetPassword, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiters for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: 'Too many password reset attempts, please try again after 1 hour',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', authLimiter, loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', passwordResetLimiter, forgetPassword);
router.put('/resetPassword/:resettoken', passwordResetLimiter, resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
