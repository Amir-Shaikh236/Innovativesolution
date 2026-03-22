const express = require('express');
const router = express.Router();
const { addSubscription, getSubscriptions } = require('../controllers/subscriptionController');
const { adminAuth } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter for subscriptions
const subscriptionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 subscriptions per hour per IP
  message: 'Too many subscription attempts, please try again after 1 hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Public route for a user to subscribe
router.post('/', subscriptionLimiter, addSubscription);

// Protected route for an admin to view all subscriptions
router.get('/', adminAuth, getSubscriptions);

module.exports = router;