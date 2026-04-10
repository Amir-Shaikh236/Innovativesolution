const express = require("express");
const router = express.Router();
const { 
  getAdvancedChatbotReply, 
  submitChatbotFeedback,
  getConversationHistory,
  getChatbotAnalytics,
  escalateConversation,
  addToImproveQueue
} = require("../controllers/advancedChatbotController");

// Health check
router.get("/", (req, res) => {
  console.log('[Chatbot Routes] GET request received (health check)');
  res.json({ status: 'advanced chatbot route active' });
});

// Main chatbot endpoint
router.post("/", (req, res, next) => {
  console.log('[Chatbot Routes] POST request received');
  next();
}, getAdvancedChatbotReply);

// Submit feedback for a conversation
router.post("/feedback", submitChatbotFeedback);

// Get conversation history
router.get("/history/:sessionId", getConversationHistory);

// Escalate conversation to human agent
router.post("/escalate", escalateConversation);

// Add query to improvement queue
router.post("/improve", addToImproveQueue);

// Analytics endpoint (protected route recommended)
router.get("/analytics", getChatbotAnalytics);

module.exports = router;