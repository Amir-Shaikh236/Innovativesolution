const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/authMiddleware');

// Public login route - NO middleware here
router.post('/login', adminController.login);
router.post('/admin-Logout', adminController.AdminLogout)

// Middleware Required to get details
router.get('/getadmin', adminAuth, adminController.getadmin)
router.get('/dashboard-stats', adminAuth, adminController.getDashboardStats)

module.exports = router;
