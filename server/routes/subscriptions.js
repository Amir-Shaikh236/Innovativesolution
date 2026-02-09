const express = require('express');
const router = express.Router();
const { addSubscription, getSubscriptions } = require('../controllers/subscriptionController');
const { adminAuth } = require('../middleware/authMiddleware');

// Public route for a user to subscribe
router.post('/', addSubscription);

// Protected route for an admin to view all subscriptions
router.get('/', adminAuth, getSubscriptions);

module.exports = router;