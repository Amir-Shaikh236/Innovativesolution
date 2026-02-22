const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/authMiddleware');

// Public login route - NO middleware here
router.post('/login', adminController.login);
router.post('/admin-Logout', adminController.AdminLogout)
router.get('/getadmin', adminAuth, adminController.getadmin)

module.exports = router;
