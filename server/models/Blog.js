// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  summary: String,
  body: String,
  // The Corrected Schema
  image: {
    type: String,
    required: [true, 'A cover image is required for all blog posts.']
  },
  slug: { type: String, unique: true },
  published: { type: Boolean, default: true },
  category: String, // <<--- New field for category
  tags: [String],   // <<--- Tags as an array of strings
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model("Blog", blogSchema);