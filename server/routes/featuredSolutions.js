const express = require('express');
const router = express.Router();
const FeaturedSolution = require('../models/FeaturedSolution');
const { adminAuth } = require('../middleware/authMiddleware');

// Public route to get all featured solutions
router.get('/', async (req, res) => {
  try {
    const solutions = await FeaturedSolution.find();
    res.json(solutions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load featured solutions' });
  }
});

// Admin-protected routes for create/update/delete

router.post('/', adminAuth, async (req, res) => {
  try {
    const solution = new FeaturedSolution(req.body);
    await solution.save();
    res.status(201).json(solution);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create featured solution' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const solution = await FeaturedSolution.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(solution);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update featured solution' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await FeaturedSolution.findByIdAndDelete(req.params.id);
    res.json({ message: 'Featured solution deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete featured solution' });
  }
});

module.exports = router;
