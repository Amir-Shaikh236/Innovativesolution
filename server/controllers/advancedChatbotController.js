const ChatConversation = require('../models/ChatConversation');
const ChatFeedback = require('../models/ChatFeedback');
const chatbotData = require('../chatbotData');
const {
  sentimentAnalysis,
  classifyIntent,
  extractEntities,
  extractKeywords
} = require('../utils/nlpUtils');
const { findBestMatchAdvanced } = require('../utils/matchingAlgorithm');
const { v4: uuidv4 } = require('uuid');

// Generate or retrieve session ID
const getOrCreateSessionId = (req) => {
  let sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
  if (!sessionId) {
    sessionId = uuidv4();
  }
  return sessionId;
};

// Extract client information
const getClientInfo = (req) => {
  return {
    userAgent: req.headers['user-agent'] || 'unknown',
    ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
    language: req.headers['accept-language']?.split(',')[0] || 'en',
    referrer: req.headers['referer'] || 'direct'
  };
};

// Get or create conversation
const getOrCreateConversation = async (sessionId, req) => {
  let conversation = await ChatConversation.findOne({ sessionId });

  if (!conversation) {
    conversation = new ChatConversation({
      sessionId,
      metadata: getClientInfo(req),
      status: 'active'
    });
    await conversation.save();
  }

  return conversation;
};

// Process user message with NLP
const processUserMessage = async (userMessage, conversation) => {
  const sentiment = sentimentAnalysis(userMessage);
  const { intent, confidence: intentConfidence } = classifyIntent(userMessage);
  const entities = extractEntities(userMessage);
  const keywords = extractKeywords(userMessage);

  return {
    sentiment,
    intent,
    intentConfidence,
    entities,
    keywords
  };
};

// Enhanced chatbot reply endpoint
exports.getAdvancedChatbotReply = async (req, res) => {
  try {
    const sessionId = getOrCreateSessionId(req);

    if (!req.body || typeof req.body.message !== 'string') {
      return res.status(400).json({
        error: 'Invalid request format',
        reply: 'I encountered an error processing your message. Please try again.'
      });
    }

    const userMessage = req.body.message.trim();

    if (!userMessage) {
      return res.json({
        reply: "Please type a question so I can assist you."
      });
    }

    // Get or create conversation
    const conversation = await getOrCreateConversation(sessionId, req);

    // Process message with NLP
    const nlpAnalysis = await processUserMessage(userMessage, conversation);

    // Find best matching answer
    const { bestMatch, alternativeMatches, confidence } = findBestMatchAdvanced(userMessage, chatbotData);

    // Check if we need to escalate
    const needsEscalation =
      nlpAnalysis.sentiment.sentiment === 'negative' ||
      nlpAnalysis.intent === 'complaint' ||
      (bestMatch === null && confidence < 0.2);

    let botResponse = {
      reply: 'I apologize, I could not understand that. Please contact our support team.',
      cta: { label: 'Contact Support', link: '/contact' },
      shouldEscalate: false,
      suggestions: []
    };

    if (bestMatch) {
      botResponse = {
        reply: bestMatch.a,
        cta: bestMatch.cta || null,
        shouldEscalate: needsEscalation,
        suggestions: alternativeMatches.slice(0, 2).map(m => ({
          question: m.q,
          answer: m.a
        })),
        metadata: {
          matchedQuestion: bestMatch.q,
          confidence: confidence,
          intent: nlpAnalysis.intent
        }
      };
    } else if (alternativeMatches.length > 0) {
      botResponse.suggestions = alternativeMatches.slice(0, 3).map(m => ({
        question: m.q,
        answer: m.a
      }));
    }

    // Save message to conversation
    conversation.messages.push({
      sender: 'user',
      text: userMessage,
      intent: nlpAnalysis.intent,
      sentiment: nlpAnalysis.sentiment.sentiment,
      confidence
    });

    conversation.messages.push({
      sender: 'bot',
      text: botResponse.reply,
      intent: nlpAnalysis.intent,
      confidence
    });

    // Update conversation status if escalation needed
    if (needsEscalation) {
      conversation.status = 'escalated';
      conversation.escalated = true;
      botResponse.shouldEscalate = true;
    }

    // Update topic based on intent
    if (!conversation.topic && nlpAnalysis.intent !== 'greeting') {
      conversation.topic = nlpAnalysis.intent;
    }

    await conversation.save();

    // Add session ID to response
    botResponse.sessionId = sessionId;

    res.json(botResponse);

  } catch (error) {
    console.error('[Advanced Chatbot Controller ERROR]', error);
    res.status(500).json({
      error: 'Chatbot server error',
      reply: 'An unexpected error occurred. Please try again later.'
    });
  }
};

// Submit feedback for a conversation
exports.submitChatbotFeedback = async (req, res) => {
  try {
    const { sessionId, rating, feedback, wasHelpful, answers } = req.body;

    if (!sessionId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid feedback data' });
    }

    const conversation = await ChatConversation.findOne({ sessionId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Save feedback
    const chatFeedback = new ChatFeedback({
      conversationId: conversation._id,
      sessionId,
      rating,
      feedback,
      wasHelpful,
      answers: answers || {}
    });

    await chatFeedback.save();

    // Update conversation with feedback
    conversation.satisfactionRating = rating;
    conversation.feedback = feedback;
    conversation.status = 'closed';
    conversation.resolvedTime = new Date();
    await conversation.save();

    res.json({
      success: true,
      message: 'Thank you for your feedback!'
    });

  } catch (error) {
    console.error('[Chatbot Feedback ERROR]', error);
    res.status(500).json({ error: 'Error saving feedback' });
  }
};

// Get conversation history
exports.getConversationHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const conversation = await ChatConversation.findOne({ sessionId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      sessionId,
      messages: conversation.messages,
      status: conversation.status,
      topic: conversation.topic,
      rating: conversation.satisfactionRating
    });

  } catch (error) {
    console.error('[Get History ERROR]', error);
    res.status(500).json({ error: 'Error retrieving conversation' });
  }
};

// Get chatbot analytics (admin only)
exports.getChatbotAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;

    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const conversations = await ChatConversation.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalConversations = await ChatConversation.countDocuments(query);
    const escalatedCount = await ChatConversation.countDocuments({ ...query, escalated: true });

    const feedback = await ChatFeedback.find(query);
    const avgRating = feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(2)
      : 0;

    // Get intent distribution
    const intents = {};
    conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        if (msg.intent && intents[msg.intent]) {
          intents[msg.intent]++;
        } else if (msg.intent) {
          intents[msg.intent] = 1;
        }
      });
    });

    res.json({
      totalConversations,
      escalatedCount,
      escalationRate: ((escalatedCount / totalConversations) * 100).toFixed(2) + '%',
      averageRating: parseFloat(avgRating),
      feedbackCount: feedback.length,
      intentsDistribution: intents,
      recentConversations: conversations.slice(0, 10),
      trends: {
        positiveMessages: conversations.reduce((sum, c) =>
          sum + c.messages.filter(m => m.sentiment === 'positive').length, 0),
        negativeMessages: conversations.reduce((sum, c) =>
          sum + c.messages.filter(m => m.sentiment === 'negative').length, 0)
      }
    });

  } catch (error) {
    console.error('[Analytics ERROR]', error);
    res.status(500).json({ error: 'Error retrieving analytics' });
  }
};

// Escalate conversation to human agent
exports.escalateConversation = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const conversation = await ChatConversation.findOne({ sessionId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.escalated = true;
    conversation.status = 'escalated';
    await conversation.save();

    res.json({
      success: true,
      message: 'Your request has been escalated to our support team. They will contact you shortly.'
    });

  } catch (error) {
    console.error('[Escalation ERROR]', error);
    res.status(500).json({ error: 'Error escalating conversation' });
  }
};

// Improve FAQ based on unmatched queries
exports.addToImproveQueue = async (req, res) => {
  try {
    const { sessionId, userQuery } = req.body;

    const conversation = await ChatConversation.findOne({ sessionId });
    if (conversation) {
      conversation.status = 'escalated';
      await conversation.save();
    }

    // Log unmatched query for future improvement
    console.log('[FAQ Improvement Queue] Unmatched query:', userQuery);

    res.json({
      success: true,
      message: 'Thank you! We\'ll use your feedback to improve our chatbot.'
    });

  } catch (error) {
    console.error('[Improve Queue ERROR]', error);
    res.status(500).json({ error: 'Error processing request' });
  }
};
