const User = require('../models/User');
const Category = require('../models/Category')
const Blog = require('../models/Blog')
const Subscription = require('../models/Subscription')
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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

// Route to verify cookie on page refresh
exports.getadmin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.status(200).json({ admin: req.user });

  } catch (error) {
    console.error("Crash in getadmin controller:", error);
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // Promise.all runs all 4 database queries simultaneously, saving massive amounts of time
    const [categoriesCount, blogsCount, subscriptionsCount, usersCount] = await Promise.all([
      Category.countDocuments(),
      Blog.countDocuments(),
      Subscription.countDocuments(),
      User.countDocuments()
    ]);

    res.status(200).json({
      categories: categoriesCount,
      blogs: blogsCount,
      subscriptions: subscriptionsCount,
      users: usersCount
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error while fetching statistics" });
  }
};