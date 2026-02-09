const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser, getMe, logoutUser, forgetPassword, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/logout', logoutUser)
router.post('/forgot-password', forgetPassword)
router.put('/resetPassword/:resettoken', resetPassword)
router.get('/me', protect, getMe)

module.exports = router;
