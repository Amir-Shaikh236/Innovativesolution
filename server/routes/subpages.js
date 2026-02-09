const express = require('express');
const router = express.Router();
const subpageController = require('../controllers/subpageController');
const { adminAuth } = require('../middleware/authMiddleware');

// Public GET routes
router.get('/', subpageController.getAllSubpages);
router.get('/slug/:slug', subpageController.getSubpageBySlug);
router.get('/:id', subpageController.getSubpageById);

// Protected routes
router.post('/', adminAuth, subpageController.createSubpage);
router.put('/:id', adminAuth, subpageController.updateSubpage);
router.delete('/:id', adminAuth, subpageController.deleteSubpage);

module.exports = router;
