const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get category by slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new category (with sections array support)
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, order, image, sections } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ error: "Name and slug are required" });
    }

    // check duplicate slug
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ error: "Slug already exists" });
    }

    const category = new Category({
      name,
      slug,
      description,
      order,
      image,
      sections
    });

    await category.save();

    res.status(201).json({
      message: "Category created successfully",
      data: category
    });

  } catch (err) {
    res.status(500).json({
      error: err.message || "Server error"
    });
  }
};


// Update category (with sections array support)
exports.updateCategory = async (req, res) => {
  try {
    const updates = req.body; // can include sections array
    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ msg: 'Category not found' });
    res.json({ msg: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
