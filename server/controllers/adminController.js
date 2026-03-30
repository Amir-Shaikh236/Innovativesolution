"use strict";

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const User = require("../models/User");
const Category = require("../models/Category");
const Blog = require("../models/Blog");
const Subscription = require("../models/Subscription");

// ─── Constants ────────────────────────────────────────────────────────────────

const COOKIE_NAME = "adminToken";
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const TOKEN_TTL_STR = "7d";
const IS_PROD = process.env.NODE_ENV === "production";

// ─── Validation ───────────────────────────────────────────────────────────────

const adminLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim(),
  username: Joi.string().email().lowercase().trim(),
  password: Joi.string().required(),
}).or("email", "username");

// ─── Cookie helpers ───────────────────────────────────────────────────────────

const cookieOptions = (overrides = {}) => ({
  httpOnly: true,
  secure: IS_PROD,
  sameSite: IS_PROD ? "None" : "Lax",
  ...overrides,
});

// ─── Aggregation helpers ──────────────────────────────────────────────────────

/** Returns a Date set to the 1st of the month, N months ago at midnight. */
function twelveMonthsStart() {
  const d = new Date();
  d.setMonth(d.getMonth() - 11);
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Aggregates a model by month over the last 12 months,
 * filling gaps so every month is present.
 */
async function monthlyCountAgg(Model, dateField = "createdAt", matchExtra = {}) {
  const since = twelveMonthsStart();

  const raw = await Model.aggregate([
    { $match: { [dateField]: { $gte: since }, ...matchExtra } },
    {
      $group: {
        _id: { year: { $year: `$${dateField}` }, month: { $month: `$${dateField}` } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const found = raw.find((r) => r._id.year === y && r._id.month === m);
    return {
      month: d.toLocaleString("en-US", { month: "short" }),
      year: y,
      count: found ? found.count : 0,
    };
  });
}

/** Converts a monthly-count array into a running cumulative total series. */
function buildCumulative(months, priorTotal) {
  let running = priorTotal;
  return months.map((m) => {
    running += m.count;
    return { ...m, total: running };
  });
}

/** Returns a trend percentage comparing current vs previous period. */
function trendPct(curr, prev) {
  if (prev === 0) return 100;
  return Math.round(((curr - prev) / prev) * 100);
}

/** Human-readable relative time string. */
function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Auth controllers ─────────────────────────────────────────────────────────

exports.login = async (req, res) => {
  try {
    const { error, value } = adminLoginSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    const loginEmail = (value.email || value.username).toLowerCase();

    const user = await User.findOne({ email: loginEmail, isAdmin: true });
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });

    const isMatch = await user.matchPassword(value.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_TTL_STR }
    );

    res.cookie(COOKIE_NAME, token, cookieOptions({ maxAge: TOKEN_TTL_MS }));

    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

exports.logout = (_req, res) => {
  res.cookie(COOKIE_NAME, "", cookieOptions({ expires: new Date(0) }));
  return res.status(200).json({ msg: "Logged out successfully" });
};

exports.getAdmin = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ msg: "Admin not found" });
    return res.status(200).json({ admin: req.user });
  } catch (err) {
    console.error("getAdmin error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ─── Dashboard controllers ────────────────────────────────────────────────────

/**
 * GET /api/admin/dashboard-stats
 * Core counts + 30-day trend percentages.
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 864e5);
    const sixtyDaysAgo = new Date(now - 60 * 864e5);

    const [
      categories,
      blogs,
      subscriptions,
      users,
      usersThisMonth,
      usersLastMonth,
      subsThisMonth,
      subsLastMonth,
    ] = await Promise.all([
      Category.countDocuments(),
      Blog.countDocuments(),
      Subscription.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      Subscription.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Subscription.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
    ]);

    return res.status(200).json({
      categories,
      blogs,
      subscriptions,
      users,
      trends: {
        users: trendPct(usersThisMonth, usersLastMonth),
        subscriptions: trendPct(subsThisMonth, subsLastMonth),
      },
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

/**
 * GET /api/admin/dashboard-stats/user-growth
 * Monthly new signups + running cumulative total for the last 12 months.
 */
exports.getUserGrowth = async (req, res) => {
  try {
    const since = twelveMonthsStart();
    const priorTotal = await User.countDocuments({ createdAt: { $lt: since } });

    const monthly = await monthlyCountAgg(User);
    const series = buildCumulative(monthly, priorTotal);

    return res.status(200).json(
      series.map(({ month, year, count, total }) => ({
        month,
        year,
        newUsers: count,
        users: total,
      }))
    );
  } catch (err) {
    console.error("getUserGrowth error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

/**
 * GET /api/admin/dashboard-stats/blog-stats
 * Monthly published count + total views per month for the last 12 months.
 */
exports.getBlogStats = async (req, res) => {
  try {
    const since = twelveMonthsStart();

    const [monthly, viewsAgg] = await Promise.all([
      monthlyCountAgg(Blog),
      Blog.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            views: { $sum: { $ifNull: ["$views", 0] } },
          },
        },
      ]),
    ]);

    return res.status(200).json(
      monthly.map(({ month, year, count }) => {
        const mo = new Date(`${month} 1 ${year}`).getMonth() + 1;
        const vEntry = viewsAgg.find((v) => v._id.year === year && v._id.month === mo);
        return { month, year, published: count, views: vEntry?.views ?? 0 };
      })
    );
  } catch (err) {
    console.error("getBlogStats error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

/**
 * GET /api/admin/dashboard-stats/revenue
 * Monthly revenue + subscription count for the last 12 months.
 */
exports.getRevenue = async (req, res) => {
  try {
    const since = twelveMonthsStart();

    const raw = await Subscription.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: { $ifNull: ["$amount", 0] } },
          subs: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (11 - i));
      const y = d.getFullYear();
      const mo = d.getMonth() + 1;
      const found = raw.find((r) => r._id.year === y && r._id.month === mo);
      return {
        month: d.toLocaleString("en-US", { month: "short" }),
        year: y,
        revenue: found?.revenue ?? 0,
        subs: found?.subs ?? 0,
      };
    });

    return res.status(200).json(months);
  } catch (err) {
    console.error("getRevenue error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

/**
 * GET /api/admin/dashboard-stats/top-content
 * Top 6 blogs by views then likes.
 */
exports.getTopContent = async (req, res) => {
  try {
    const top = await Blog.find()
      .sort({ views: -1, likes: -1 })
      .limit(6)
      .select("title views likes category createdAt")
      .lean();

    return res.status(200).json(
      top.map(({ title, views, likes, category }) => ({
        title,
        views: views ?? 0,
        likes: likes ?? 0,
        category: category ?? "General",
      }))
    );
  } catch (err) {
    console.error("getTopContent error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

/**
 * GET /api/admin/dashboard-stats/activity
 * Latest 10 mixed events (new users, published blogs, new subscriptions).
 */
exports.getActivity = async (req, res) => {
  try {
    const [recentUsers, recentBlogs, recentSubs] = await Promise.all([
      User.find().sort({ createdAt: -1 }).limit(6).select("name email createdAt").lean(),
      Blog.find().sort({ createdAt: -1 }).limit(4).select("title createdAt").lean(),
      Subscription.find()
        .sort({ createdAt: -1 })
        .limit(4)
        .select("userId plan createdAt")
        .populate("userId", "name")
        .lean(),
    ]);

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
        text: `${s.userId?.name ?? "Someone"} activated ${s.plan ?? "a"} plan`,
        time: timeAgo(s.createdAt),
        _date: s.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b._date) - new Date(a._date))
      .slice(0, 10)
      .map(({ _date, ...rest }) => rest);

    return res.status(200).json(events);
  } catch (err) {
    console.error("getActivity error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};