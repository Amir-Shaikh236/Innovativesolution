const express = require('express');
const router = express.Router();
const { getUsers, updateUserAdminStatus } = require('../controllers/AdminuserController');
const { adminAuth, protect } = require('../middleware/authMiddleware'); // Import the single middleware function

// Apply the adminAuth middleware to both routes
router.route('/').get(protect, adminAuth, getUsers);
router.route('/:id/admin').put(protect, adminAuth, updateUserAdminStatus);

module.exports = router;