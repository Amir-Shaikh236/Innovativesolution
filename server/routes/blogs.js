// routes/blogs.js
const express = require("express");
const Blog = require("../models/Blog");
const { adminAuth } = require('../middleware/authMiddleware'); // <-- IMPORT MIDDLEWARE
const router = express.Router();

// --- PUBLIC ROUTES ---

// REFACTORED Public Route: Now supports server-side pagination, searching, and filtering.
router.get("/", async (req, res) => {
  try {
    const { category, searchTerm, page = 1, limit = 9 } = req.query;

    // Base filter always includes published posts
    const filter = { published: true };

    // Add category to filter if it's provided and not 'All'
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Add search term to filter if provided
    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
        { summary: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Get the total count of documents matching the filter for pagination
    const totalCount = await Blog.countDocuments(filter);

    res.json({
      blogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / parseInt(limit))
    });

  } catch (err) {
    res.status(500).json({ error: "Server error fetching blogs" });
  }
});

// Public: get a single blog post by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found or not published" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching blog" });
  }
});

// REFACTORED Public Route: Now only gets categories from PUBLISHED posts
router.get("/categories", async (req, res) => {
  try {
    // The second argument filters the documents from which to pull distinct values
    const categories = await Blog.distinct("category", { published: true });
    res.json(categories.filter(c => c)); // Filter out any null/empty categories
  } catch (err) {
    res.status(500).json({ error: "Server error fetching categories" });
  }
});


// --- ADMIN ROUTES (PROTECTED) ---

// SECURED Admin Route: Get all blogs (published and drafts)
router.get("/all", adminAuth, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching all blogs" });
  }
});

// SECURED Admin Route: Create a new blog post
router.post("/", adminAuth, async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json(newBlog);
  } catch (err) {
    // Improved Error Handling: Check for duplicate slug
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(400).json({ error: "This slug is already in use. Please choose another." });
    }
    res.status(400).json({ error: "Failed to create blog. Check required fields." });
  }
});

// SECURED Admin Route: Update an existing blog post
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(updatedBlog);
  } catch (err) {
    // Improved Error Handling: Check for duplicate slug
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(400).json({ error: "This slug is already in use. Please choose another." });
    }
    res.status(400).json({ error: "Failed to update blog. Check required fields." });
  }
});

// SECURED Admin Route: Delete a blog post
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json({ success: true, message: "Blog deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting blog" });
  }
});

module.exports = router;