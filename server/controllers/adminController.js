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

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD CONTROLLERS
// Add these to your existing controller file and register routes below
// ─────────────────────────────────────────────────────────────────────────────

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build a 12-month array of { month, year, count } from an aggregation */
// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD CONTROLLERS
// Add these to your existing controller file and register routes below
// ─────────────────────────────────────────────────────────────────────────────

const mongoose = require("mongoose");

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Build a 12-month array of { month, year, count } from an aggregation */
async function monthlyCountAgg(Model, dateField = "createdAt", matchExtra = {}) {
  const twelve = new Date();
  twelve.setMonth(twelve.getMonth() - 11);
  twelve.setDate(1);
  twelve.setHours(0, 0, 0, 0);

  const raw = await Model.aggregate([
    { $match: { [dateField]: { $gte: twelve }, ...matchExtra } },
    {
      $group: {
        _id: {
          year: { $year: `$${dateField}` },
          month: { $month: `$${dateField}` },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  // Fill every month so the chart never has gaps
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const found = raw.find((r) => r._id.year === y && r._id.month === m);
    months.push({
      month: d.toLocaleString("en-US", { month: "short" }),
      year: y,
      count: found ? found.count : 0,
    });
  }
  return months;
}

/** Running cumulative total — adds each month's new count to the previous total */
function cumulativeFrom(months, startTotal) {
  let running = startTotal;
  return months.map((m) => {
    running += m.count;
    return { ...m, total: running };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MAIN STATS  →  GET /api/admin/dashboard-stats
// ─────────────────────────────────────────────────────────────────────────────

exports.getDashboardStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [
      categoriesCount,
      blogsCount,
      subscriptionsCount,
      usersCount,
      usersThisMonth,
      usersLastMonth,
      subsThisMonth,
      subsLastMonth,
    ] = await Promise.all([
      Category.countDocuments(),
      Blog.countDocuments(),
      Subscription.countDocuments(),
      User.countDocuments(),

      // This month vs last month for trend % on stat cards
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),

      Subscription.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Subscription.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    ]);

    const trendPct = (curr, prev) =>
      prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100);

    res.status(200).json({
      // Core counts
      categories: categoriesCount,
      blogs: blogsCount,
      subscriptions: subscriptionsCount,
      users: usersCount,

      // Trend percentages (used by stat card badges)
      trends: {
        users: trendPct(usersThisMonth, usersLastMonth),
        subscriptions: trendPct(subsThisMonth, subsLastMonth),
        // revenue, activeNow, churnRate — will be added later
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Server error while fetching statistics" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. USER GROWTH CHART  →  GET /api/admin/dashboard-stats/user-growth
// ─────────────────────────────────────────────────────────────────────────────

exports.getUserGrowth = async (req, res) => {
  try {
    const totalBefore12Months = await User.countDocuments({
      createdAt: { $lt: (() => { const d = new Date(); d.setMonth(d.getMonth() - 11); d.setDate(1); return d; })() },
    });

    const monthly = await monthlyCountAgg(User, "createdAt");
    const withCumulative = cumulativeFrom(monthly, totalBefore12Months);

    res.status(200).json(
      withCumulative.map((m) => ({
        month: m.month,
        year: m.year,
        newUsers: m.count,    // bar: new signups this month
        users: m.total,    // line: running total
      }))
    );
  } catch (error) {
    console.error("Error fetching user growth:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. BLOG STATS CHART  →  GET /api/admin/dashboard-stats/blog-stats
// ─────────────────────────────────────────────────────────────────────────────

exports.getBlogStats = async (req, res) => {
  try {
    const monthly = await monthlyCountAgg(Blog, "createdAt");

    // If your Blog model has a `views` field, aggregate that too
    const twelve = new Date();
    twelve.setMonth(twelve.getMonth() - 11);
    twelve.setDate(1);

    const viewsAgg = await Blog.aggregate([
      { $match: { createdAt: { $gte: twelve } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          views: { $sum: { $ifNull: ["$views", 0] } },
        },
      },
    ]);

    res.status(200).json(
      monthly.map((m) => {
        const vEntry = viewsAgg.find(
          (v) => v._id.month === new Date(`${m.month} 1 ${m.year}`).getMonth() + 1
            && v._id.year === m.year
        );
        return {
          month: m.month,
          year: m.year,
          published: m.count,
          views: vEntry?.views || 0,
        };
      })
    );
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. REVENUE CHART  →  GET /api/admin/dashboard-stats/revenue
// ─────────────────────────────────────────────────────────────────────────────

exports.getRevenue = async (req, res) => {
  try {
    const twelve = new Date();
    twelve.setMonth(twelve.getMonth() - 11);
    twelve.setDate(1);

    const raw = await Subscription.aggregate([
      { $match: { createdAt: { $gte: twelve } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: { $ifNull: ["$amount", 0] } },
          subs: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Fill gaps
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const mo = d.getMonth() + 1;
      const found = raw.find((r) => r._id.year === y && r._id.month === mo);
      months.push({
        month: d.toLocaleString("en-US", { month: "short" }),
        year: y,
        revenue: found?.revenue || 0,
        subs: found?.subs || 0,
      });
    }

    res.status(200).json(months);
  } catch (error) {
    console.error("Error fetching revenue:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. TOP CONTENT  →  GET /api/admin/dashboard-stats/top-content
// ─────────────────────────────────────────────────────────────────────────────

exports.getTopContent = async (req, res) => {
  try {
    const top = await Blog.find()
      .sort({ views: -1, likes: -1 })   // adjust field names to match your Blog model
      .limit(6)
      .select("title views likes category createdAt")
      .lean();

    res.status(200).json(
      top.map((b) => ({
        title: b.title,
        views: b.views || 0,
        likes: b.likes || 0,
        category: b.category || "General",
      }))
    );
  } catch (error) {
    console.error("Error fetching top content:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. ACTIVITY FEED  →  GET /api/admin/dashboard-stats/activity
// ─────────────────────────────────────────────────────────────────────────────

exports.getActivity = async (req, res) => {
  try {
    // Fetch last 4 of each type in parallel
    const [recentUsers, recentBlogs, recentSubs] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(6).select("name email createdAt").lean(),
      Blog.find().sort({ createdAt: -1 }).limit(4).select("title createdAt").lean(),
      Subscription.find().sort({ createdAt: -1 }).limit(4)
        .select("userId plan createdAt")
        .populate("userId", "name")
        .lean(),
    ]);

    const timeAgo = (date) => {
      const diff = Math.floor((Date.now() - new Date(date)) / 1000);
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    };

    // Merge and sort all events by date descending
    const events = [
      ...recentUsers.map((u) => ({
        type: "user",
        icon: "UserPlus",
        color: "#f97316",
        bg: "#fff7ed",
        text: `${u.name || u.email || "A new user"} joined`,
        time: timeAgo(u.createdAt),
        _date: u.createdAt,
      })),
      ...recentBlogs.map((b) => ({
        type: "blog",
        icon: "FileText",
        color: "#3b82f6",
        bg: "#eff6ff",
        text: `"${b.title}" published`,
        time: timeAgo(b.createdAt),
        _date: b.createdAt,
      })),
      ...recentSubs.map((s) => ({
        type: "sub",
        icon: "CreditCard",
        color: "#8b5cf6",
        bg: "#f5f3ff",
        text: `${s.userId?.name || "Someone"} activated ${s.plan || "a"} plan`,
        time: timeAgo(s.createdAt),
        _date: s.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b._date) - new Date(a._date))
      .slice(0, 10)
      .map(({ _date, ...rest }) => rest); // strip internal _date before sending

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ message: "Server error" });
  }
};