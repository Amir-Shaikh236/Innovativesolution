const Subpage = require('../models/Subpage');

// List with optional category filtering
exports.getAllSubpages = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const subpages = await Subpage.find(filter)
      .populate('category')
      .sort({ order: 1 });
    res.json(subpages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by slug
exports.getSubpageBySlug = async (req, res) => {
  try {
    const subpage = await Subpage.findOne({ slug: req.params.slug });
    if (!subpage) return res.status(404).json({ msg: 'Subpage not found' });
    res.json(subpage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
exports.getSubpageById = async (req, res) => {
  try {
    const subpage = await Subpage.findById(req.params.id).populate('category');
    if (!subpage) return res.status(404).json({ msg: 'Subpage not found' });
    res.json(subpage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE (accepts sections array from body)
exports.createSubpage = async (req, res) => {
  try {
    const { title, slug, description, content, category, order, image, sections } = req.body;
    const subpage = new Subpage({ title, slug, description, content, category, order, image, sections });
    await subpage.save();
    res.status(201).json(subpage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE (allows updating the sections array)
exports.updateSubpage = async (req, res) => {
  try {
    const updates = req.body; // Can include `sections` and any other subpage field
    const subpage = await Subpage.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!subpage) return res.status(404).json({ msg: 'Subpage not found' });
    res.json(subpage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteSubpage = async (req, res) => {
  try {
    const subpage = await Subpage.findByIdAndDelete(req.params.id);
    if (!subpage) return res.status(404).json({ msg: 'Subpage not found' });
    res.json({ msg: 'Subpage deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
