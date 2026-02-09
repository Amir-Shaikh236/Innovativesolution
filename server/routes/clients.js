const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { adminAuth } = require('../middleware/authMiddleware');

// Public route to get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load clients' });
  }
});

// Admin-protected routes for create/update/delete

router.post('/', adminAuth, async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create client' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(client);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update client' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete client' });
  }
});

module.exports = router;
