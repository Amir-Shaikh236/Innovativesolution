const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Validation schema
const adminLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim(),
  username: Joi.string().email().lowercase().trim(),
  password: Joi.string().required(),
}).or('email', 'username');

exports.login = async (req, res) => {
  try {
    // Validate input
    const { error, value } = adminLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

    const { email, username, password } = value;
    const loginEmail = email || username;

    if (!loginEmail || !password) {
      return res.status(400).json({ msg: "Email/Username and password required" });
    }

    const user = await User.findOne({ email: loginEmail.toLowerCase(), isAdmin: true });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Setting the JWT inside an HTTP-Only cookie
    res.cookie("adminToken", token, {
      httpOnly: true, // Prevents JavaScript (XSS) from reading the cookie
      secure: process.env.NODE_ENV === "production", // Must be true on Render
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allows cross-domain requests (Vercel -> Render)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds to match JWT
    });

    // Send the response
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.AdminLogout = (req, res) => {
  res.cookie("adminToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    expires: new Date(0), // Sets expiration to the past to delete it immediately
  });
  res.status(200).json({ msg: "Admin logged out successfully" });
};

// In your admin routes file (e.g., adminRoutes.js)

// Route to verify cookie on page refresh
exports.getadmin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // 2. Just send the user data back to React exactly how it expects it: { admin: ... }
    res.status(200).json({ admin: req.user });

  } catch (error) {
    console.error("Crash in getadmin controller:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};