const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('./models/User');
const Category = require('./models/Category');
const Subpage = require('./models/Subpage');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/innovativestaffing';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Subpage.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@innovativestaffing.com',
      password: hashedPassword,
      isAdmin: true
    });
    console.log('Created admin user:', adminUser.email);

    // Create default categories
    const categories = await Category.insertMany([
      { name: 'Staffing Solutions', slug: 'staffing-solutions', description: 'Professional staffing services for businesses', order: 1 },
      { name: 'IT Services', slug: 'it-services', description: 'Technology and IT consulting services', order: 2 },
      { name: 'Finance & Accounting', slug: 'finance-accounting', description: 'Financial and accounting talent solutions', order: 3 },
      { name: 'Healthcare', slug: 'healthcare', description: 'Healthcare staffing and recruitment', order: 4 },
      { name: 'Industrial', slug: 'industrial', description: 'Industrial and manufacturing staffing', order: 5 }
    ]);
    console.log('Created categories:', categories.map(c => c.name).join(', '));

    // Create sample subpages for each category
    const subpages = [
      { title: 'Temporary Staffing', slug: 'temporary-staffing', description: 'Flexible temporary staffing solutions', category: categories[0]._id, order: 1 },
      { title: 'Permanent Recruitment', slug: 'permanent-recruitment', description: 'Find your perfect long-term hire', category: categories[0]._id, order: 2 },
      { title: 'IT Consulting', slug: 'it-consulting', description: 'Expert IT consulting services', category: categories[1]._id, order: 1 },
      { title: 'Software Development', slug: 'software-development', description: 'Custom software development', category: categories[1]._id, order: 2 },
      { title: 'Accounting Services', slug: 'accounting-services', description: 'Professional accounting solutions', category: categories[2]._id, order: 1 },
      { title: 'Financial Analysis', slug: 'financial-analysis', description: 'Expert financial analysis', category: categories[2]._id, order: 2 },
      { title: 'Medical Staffing', slug: 'medical-staffing', description: 'Healthcare professional staffing', category: categories[3]._id, order: 1 },
      { title: 'Nursing Recruitment', slug: 'nursing-recruitment', description: 'Qualified nursing recruitment', category: categories[3]._id, order: 2 },
      { title: 'Warehouse Staffing', slug: 'warehouse-staffing', description: 'Warehouse and logistics staffing', category: categories[4]._id, order: 1 },
      { title: 'Manufacturing Talent', slug: 'manufacturing-talent', description: 'Manufacturing and production talent', category: categories[4]._id, order: 2 }
    ];

    await Subpage.insertMany(subpages);
    console.log('Created subpages');

    console.log('\n Seed completed successfully!');
    console.log('Admin login:');
    console.log('  Email: admin@innovativestaffing.com');
    console.log('  Password: admin123');
    console.log('\nCategories and subpages have been created.');

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
