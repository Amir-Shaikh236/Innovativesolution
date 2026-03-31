require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const adminAuth = require('./middleware/authMiddleware');
const path = require('path');
const userAuthRoutes = require('./routes/userAuth');
const adminAuthRoutes = require('./routes/adminAuth');
const dashboardRoutes = require('./routes/dashboard')
const categoryRoutes = require('./routes/categories');
const subpageRoutes = require('./routes/subpages');
const featuredSolutionsRoutes = require('./routes/featuredSolutions');
const clientsRoutes = require('./routes/clients');
const uploadRoute = require('./routes/upload');
const blogRoutes = require("./routes/blogs");
const JoinTalent = require("./routes/JoinTalent");
const teamUpRoutes = require("./routes/teamUpRoutes");
const contactRoutes = require("./routes/contact");
const userRoutes = require('./routes/userRoutes');
const subscriptionRoutes = require('./routes/subscriptions');
const settingRoutes = require('./routes/settingRoutes')
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// 'https://innovative-staffing.vercel.app',
// 'https://innovativn:estaffing-v7jj.vercel.app'

/// Dynamic CORS configuration for development and production
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    // Allow localhost in development
    if (process.env.NODE_ENV === 'development') {
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalhost) {
        return callback(null, true);
      }
    }

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_FRONTEND_URL,
      'https://innovative-staffing.vercel.app',
      'https://innovativn:estaffing-v7jj.vercel.app'
    ].filter(Boolean);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));

app.set("trust proxy", 1);

// Body parser with size limits to prevent large payload attacks
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

connectDB();

// Public routes
app.use('/api/auth', userAuthRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subpages', subpageRoutes);
app.use('/api/featuredSolutions', featuredSolutionsRoutes);
app.use('/api/clients', clientsRoutes);
app.use("/api/blogs", blogRoutes);

app.use('/api/admin', adminAuthRoutes);
app.use('/api/admin/dashboard-stats', dashboardRoutes);
app.use('/api/admin/settings', settingRoutes);
app.use('/api/users', userRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/api/upload', uploadRoute);
app.use("/api/JoinTalent", JoinTalent);
app.use("/api/teamup", teamUpRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api/subscriptions', subscriptionRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});