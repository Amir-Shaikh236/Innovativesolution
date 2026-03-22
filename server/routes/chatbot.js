const express = require("express");
const router = express.Router();
const { getChatbotReply } = require("../controllers/chatbotController");

// health check / simple verification
router.route("/")
  .get((req, res) => {
    console.log('[Chatbot Routes DEBUG] GET request received (health check)');
    res.json({ status: 'chatbot route active' });
  })
  .post((req, res, next) => {
    console.log('[Chatbot Routes DEBUG] POST request received to chatbot route');
    next();
  }, getChatbotReply);

module.exports = router;