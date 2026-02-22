const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Standard Protect (For Logged In Users)
const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ msg: 'Not authorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // or decoded._id
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token failed' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        const token = req.cookies.adminToken;

        if (!token) {
            return res.status(401).json({ msg: 'Not authorized, no admin token found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        // Verify the user exists and is actually an admin
        if (user && user.isAdmin) {
            req.user = user; // Attach user data to the request
            next();
        } else {
            res.status(403).json({ msg: 'Not authorized as an admin' });
        }
    } catch (err) {
        res.status(401).json({ msg: 'Admin token failed or expired' });
    }
};

module.exports = { protect, adminAuth };