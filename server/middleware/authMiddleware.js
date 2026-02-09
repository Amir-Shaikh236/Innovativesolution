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

// 2. Admin Only (Checks Role)
const adminAuth = (req, res, next) => {
    // We assume 'protect' has already run and set req.user
    if (req.user && (req.user.isAdmin)) {
        next();
    } else {
        res.status(403).json({ msg: 'Not authorized as an admin' });
    }
};

module.exports = { protect, adminAuth };