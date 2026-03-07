// routes/dashboardRoutes.js
const express = require("express");
const adminController = require('../controllers/adminController');
const router = express.Router();

const { adminAuth, protect } = require('../middleware/authMiddleware');

// All routes are admin-protected
// router.get("/", adminAuth, getDashboardStats); // GET /api/admin/dashboard-stats


router.get('/', adminAuth, adminController.getDashboardStats)
router.get("/user-growth", adminAuth, adminController.getUserGrowth);    // GET /api/admin/dashboard-stats/user-growth
router.get("/blog-stats", adminAuth, adminController.getBlogStats);     // GET /api/admin/dashboard-stats/blog-stats
router.get("/revenue", adminAuth, adminController.getRevenue);       // GET /api/admin/dashboard-stats/revenue
router.get("/top-content", adminAuth, adminController.getTopContent);    // GET /api/admin/dashboard-stats/top-content
router.get("/activity", adminAuth, adminController.getActivity);      // GET /api/admin/dashboard-stats/activity


module.exports = router;