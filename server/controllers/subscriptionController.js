const Subscription = require('../models/Subscription');

// @desc    Add a new email subscription
// @route   POST /api/subscriptions
// @access  Public
exports.addSubscription = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(409).json({ message: 'This email is already subscribed' });
    }

    const newSubscription = await Subscription.create({ email });
    res.status(201).json({ message: 'Subscription successful', subscription: newSubscription });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all subscriptions
// @route   GET /api/subscriptions
// @access  Private/Admin
exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({});
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};