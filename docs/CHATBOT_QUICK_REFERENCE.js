/**
 * CHATBOT QUICK REFERENCE
 * Fast lookup guide for all methods, endpoints, and features
 * Version 2.0 - Advanced Edition
 * 
 * Usage: Import specific functions or refer to this guide while coding
 * All code examples are production-ready
 */

// ============================================================================
// FRONTEND - AdvancedChatbot.jsx QUICK REFERENCE
// ============================================================================

/**
 * SENDING A MESSAGE TO THE BOT
 * 
 * Flow:
 * 1. User types in input field
 * 2. Press Enter or click Send
 * 3. Message sent to /api/chatbot endpoint
 * 4. Bot response received and displayed
 * 5. Auto-scroll to latest message
 */

// Function: Send message and get bot response
async function sendMessage(userMessage, sessionId) {
  try {
    const response = await axios.post('/api/chatbot', {
      message: userMessage
    }, {
      headers: {
        'x-session-id': sessionId
      }
    });

    return {
      success: true,
      botResponse: response.data.response,
      intent: response.data.intent,
      sentiment: response.data.sentiment,
      confidence: response.data.confidence,
      suggestions: response.data.suggestions,
      shouldEscalate: response.data.escalationAlert
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to get response'
    };
  }
}

/**
 * SESSION MANAGEMENT
 * Sessions are stored in localStorage and linked to MongoDB
 */

// Get or create session ID
function getOrCreateSessionId() {
  let sessionId = localStorage.getItem('chatbot_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatbot_session_id', sessionId);
  }
  
  return sessionId;
}

// Load conversation history for session
async function loadConversationHistory(sessionId) {
  try {
    const response = await axios.get('/api/chatbot/history', {
      params: { sessionId, limit: 100 }
    });
    return response.data.messages || [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}

/**
 * FEEDBACK SUBMISSION
 * Users can rate conversations 1-5 stars
 */

// Submit feedback and rating
async function submitFeedback(conversationId, rating, comment) {
  try {
    const response = await axios.post('/api/chatbot/feedback', {
      conversationId,
      rating, // 1-5
      comment,
      qualityAssessment: {
        accuracy: true,
        relevance: true,
        completeness: true,
        timeliness: true
      }
    });
    return { success: true, feedbackId: response.data.feedbackId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * ESCALATION HANDLING
 * Route complex issues to human agents
 */

// Escalate conversation
async function escalateConversation(sessionId, reason) {
  try {
    const response = await axios.post('/api/chatbot/escalate', {
      sessionId,
      reason // "User requested human", "Issue too complex", etc.
    });
    return {
      success: true,
      agentId: response.data.agentId,
      queuePosition: response.data.queuePosition
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// BACKEND - API ENDPOINTS QUICK REFERENCE
// ============================================================================

/**
 * ENDPOINT 1: POST /api/chatbot
 * Main endpoint for getting bot responses
 * 
 * @param {string} message - User message
 * @param {string} sessionId - From x-session-id header
 * @returns {object} Bot response with metadata
 */

// Example request:
// curl -X POST http://localhost:5000/api/chatbot \
//   -H "x-session-id: session_123" \
//   -H "Content-Type: application/json" \
//   -d '{"message":"How can I join as a talent?"}'

// Example response (200):
{
  "response": "You can join us by filling out the talent application form at our website...",
  "intent": "question",
  "sentiment": "neutral",
  "confidence": 0.87,
  "suggestions": [
    "What are the requirements?",
    "What benefits do you offer?",
    "How long does the process take?"
  ],
  "sessionId": "session_123",
  "escalationAlert": false,
  "escalationReason": null
}

/**
 * ENDPOINT 2: POST /api/chatbot/feedback
 * Submit user feedback and ratings
 * 
 * @param {string} conversationId - ID from database
 * @param {number} rating - 1-5 stars
 * @param {string} comment - Optional feedback text
 * @returns {object} Confirmation
 */

// Example request:
{
  "conversationId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Very helpful and quick response!",
  "qualityAssessment": {
    "accuracy": true,
    "relevance": true,
    "completeness": true,
    "timeliness": true
  }
}

// Response (200):
{
  "success": true,
  "feedbackId": "507f1f77bcf86cd799439012"
}

/**
 * ENDPOINT 3: GET /api/chatbot/history
 * Retrieve conversation history
 * 
 * @param {string} sessionId - Query parameter
 * @param {number} limit - Max messages (default 50)
 * @returns {object} Message history
 */

// Example request:
// GET /api/chatbot/history?sessionId=session_123&limit=20

// Response (200):
{
  "sessionId": "session_123",
  "messages": [
    {
      "type": "user",
      "text": "What services do you offer?",
      "timestamp": "2026-04-10T10:30:00Z",
      "sentiment": "neutral",
      "intent": "question",
      "confidence": 0.92
    },
    {
      "type": "bot",
      "text": "We offer consulting, software development...",
      "timestamp": "2026-04-10T10:30:05Z",
      "confidence": 0.87
    }
  ],
  "totalMessages": 5,
  "duration": 320
}

/**
 * ENDPOINT 4: POST /api/chatbot/escalate
 * Escalate to human agent
 * 
 * @param {string} sessionId - Current session
 * @param {string} reason - Escalation reason
 * @returns {object} Agent assignment info
 */

// Example request:
{
  "sessionId": "session_123",
  "reason": "User is frustrated with automated responses"
}

// Response (200):
{
  "success": true,
  "agentId": "agent_456",
  "queuePosition": 3,
  "estimatedWaitTime": 120
}

/**
 * ENDPOINT 5: POST /api/chatbot/improve
 * Submit improvement suggestions
 */

// Example request:
{
  "sessionId": "session_123",
  "suggestion": "Add FAQ about enterprise pricing",
  "category": "Services"
}

// Response (200):
{
  "success": true,
  "suggestionId": "507f1f77bcf86cd799439013"
}

/**
 * ENDPOINT 6: GET /api/chatbot/analytics
 * Get analytics dashboard data
 * 
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate - YYYY-MM-DD
 * @returns {object} Metrics and charts data
 */

// Example request:
// GET /api/chatbot/analytics?startDate=2026-04-01&endDate=2026-04-10

// Response (200):
{
  "metrics": {
    "totalConversations": 250,
    "avgRating": 4.2,
    "escalationRate": 8.5,
    "avgResolutionTime": 45
  },
  "intents": {
    "question": 150,
    "complaint": 30,
    "greeting": 40,
    "farewell": 20,
    "help": 10
  },
  "sentiment": {
    "positive": 60,
    "neutral": 30,
    "negative": 10
  },
  "trends": [
    { "date": "2026-04-01", "conversations": 20, "rating": 4.1 },
    { "date": "2026-04-02", "conversations": 25, "rating": 4.3 }
  ]
}

// ============================================================================
// NLP UTILITIES QUICK REFERENCE
// ============================================================================

/**
 * NLP FUNCTION 1: sentimentAnalysis(text)
 * Analyzes emotional tone of user message
 */

const nlpUtils = require('./server/utils/nlpUtils');

// Example:
const sentiment = nlpUtils.sentimentAnalysis("I'm frustrated with your service");
// Returns: { sentiment: "negative", score: -0.8 }

// Possible values:
// "positive"  - Happy, satisfied, grateful
// "neutral"   - Normal questions or statements
// "negative"  - Frustrated, angry, complaining

/**
 * NLP FUNCTION 2: classifyIntent(text)
 * Determines what user wants to do
 */

const intent = nlpUtils.classifyIntent("How do I join as a talent?");
// Returns: { 
//   intent: "question", 
//   subIntent: "services",
//   confidence: 0.92 
// }

// Intent types:
// "greeting"  - "hi", "hello", "hey"
// "farewell"  - "bye", "goodbye", "see you"
// "thanks"    - "thank you", "thanks", "appreciate"
// "help"      - "help me", "support", "assist"
// "complaint" - "problem", "issue", "broken"
// "question"  - General inquiries
// "feedback"  - "suggestion", "feedback", "improve"
// "urgency"   - "urgent", "asap", "immediately"

/**
 * NLP FUNCTION 3: extractEntities(text)
 * Extracts named entities (people, places, etc.)
 */

const entities = nlpUtils.extractEntities("I'm John from New York");
// Returns: [
//   { type: "PERSON", value: "John" },
//   { type: "LOCATION", value: "New York" }
// ]

/**
 * NLP FUNCTION 4: extractKeywords(text)
 * Removes stopwords and gets meaningful terms
 */

const keywords = nlpUtils.extractKeywords("I want to join as a software engineer");
// Returns: ["join", "software", "engineer"]

// ============================================================================
// MATCHING ALGORITHM QUICK REFERENCE
// ============================================================================

/**
 * FUNCTION: findBestMatchAdvanced(userMessage, keywords)
 * Finds best matching FAQ with confidence scoring
 */

const matchingAlgorithm = require('./server/utils/matchingAlgorithm');

// Example:
const match = matchingAlgorithm.findBestMatchAdvanced(
  "how to jion as talent",  // Note the typo!
  ["join", "talent"]
);

// Returns:
{
  "bestMatch": {
    "question": "How do I join as a talent?",
    "answer": "You can join our talent network by...",
    "category": "Services",
    "confidence": 0.87
  },
  "alternatives": [
    { question: "What are talent requirements?", confidence: 0.65 },
    { question: "What benefits do talents get?", confidence: 0.58 }
  ],
  "confidence": 0.87,
  "shouldEscalate": false
}

// Confidence scoring:
// >= 0.8  - High confidence, show answer directly
// 0.5-0.8 - Medium, show answer + alternatives
// < 0.5   - Low, show "Try rephrasing" + escalation option
// < 0.2   - Very low, auto-escalate to human

// ============================================================================
// DATABASE MODELS QUICK REFERENCE
// ============================================================================

/**
 * MODEL 1: ChatConversation
 * Stores all conversation data
 */

// Example document in MongoDB:
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "sessionId": "session_123",
  "userId": "user_456",
  "messages": [
    {
      "type": "user",
      "text": "How can I become a vendor?",
      "timestamp": ISODate("2026-04-10T10:30:00Z"),
      "sentiment": "neutral",
      "intent": "question",
      "confidence": 0.92,
      "keywords": ["vendor", "become"],
      "entities": []
    },
    {
      "type": "bot",
      "text": "To become a vendor, please review our vendor program...",
      "timestamp": ISODate("2026-04-10T10:30:05Z"),
      "matchedFAQ": "vendor_faq_001",
      "confidence": 0.89,
      "suggestions": ["vendor_faq_002", "vendor_faq_003"],
      "escalationFlag": false
    }
  ],
  "messageCount": 2,
  "avgConfidence": 0.905,
  "hasEscalation": false,
  "status": "active",
  "startTime": ISODate("2026-04-10T10:30:00Z"),
  "duration": 5,
  "source": "web",
  "language": "en",
  "createdAt": ISODate("2026-04-10T10:30:00Z"),
  "updatedAt": ISODate("2026-04-10T10:30:05Z")
}

// Query examples:
// Find all recent conversations:
db.chatconversations.find().sort({ createdAt: -1 }).limit(10)

// Find escalated conversations:
db.chatconversations.find({ status: "escalated" })

// Find conversations from last 7 days:
db.chatconversations.find({
  createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
})

/**
 * MODEL 2: ChatFeedback
 * Stores user ratings and feedback
 */

// Example document:
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "conversationId": ObjectId("507f1f77bcf86cd799439011"),
  "sessionId": "session_123",
  "rating": 5,
  "comment": "Excellent and fast response!",
  "qualityAssessment": {
    "accuracy": true,
    "relevance": true,
    "completeness": true,
    "timeliness": true
  },
  "userId": "user_456",
  "createdAt": ISODate("2026-04-10T10:35:00Z")
}

// Query examples:
// Get average rating:
db.chatfeedbacks.aggregate([
  { $group: { _id: null, avgRating: { $avg: "$rating" } } }
])

// Get feedback for specific conversation:
db.chatfeedbacks.findOne({ conversationId: ObjectId("...") })

// Get low-rated feedback:
db.chatfeedbacks.find({ rating: { $lte: 3 } })

// ============================================================================
// CONTROLLER FUNCTIONS QUICK REFERENCE
// ============================================================================

/**
 * advancedChatbotController.js
 * Main business logic for chatbot operations
 */

// Function 1: Get bot response
// FILE: server/controllers/advancedChatbotController.js
// EXPORT: getAdvancedChatbotReply
async function getAdvancedChatbotReply(req, res) {
  // 1. Get message from request
  // 2. Validate input
  // 3. Get/create session
  // 4. Run NLP pipeline
  // 5. Find best FAQ match
  // 6. Check escalation conditions
  // 7. Save to database
  // 8. Return response
}

// Function 2: Save feedback
// EXPORT: submitChatbotFeedback
async function submitChatbotFeedback(req, res) {
  // 1. Validate rating (1-5)
  // 2. Create ChatFeedback document
  // 3. Save to database
  // 4. Return success
}

// Function 3: Escalate conversation
// EXPORT: escalateConversation
async function escalateConversation(req, res) {
  // 1. Find conversation
  // 2. Update status to "escalated"
  // 3. Notify support team
  // 4. Assign agent
  // 5. Return agent info
}

// Function 4: Get history
// EXPORT: getChatbotHistory
async function getChatbotHistory(req, res) {
  // 1. Get sessionId from query
  // 2. Find ChatConversation in DB
  // 3. Format messages
  // 4. Return conversation array
}

// Function 5: Get analytics
// EXPORT: getChatbotAnalytics
async function getChatbotAnalytics(req, res) {
  // 1. Get date range from query
  // 2. Query ChatConversation collection
  // 3. Calculate metrics (count, avg, etc.)
  // 4. Build trend data
  // 5. Return analytics object
}

// ============================================================================
// COMMON TASKS & SOLUTIONS
// ============================================================================

/**
 * TASK 1: How to test the chatbot locally?
 * 
 * Step 1: Start backend
 *   cd server
 *   npm run dev
 * 
 * Step 2: Start frontend
 *   cd client (in another terminal)
 *   npm run dev
 * 
 * Step 3: Open browser
 *   http://localhost:5173
 * 
 * Step 4: Click chatbot icon in bottom right
 * 
 * Step 5: Type a question and press Enter
 */

/**
 * TASK 2: How to check MongoDB documents?
 * 
 * Using MongoDB Compass (GUI):
 * 1. Open MongoDB Compass
 * 2. Connect to localhost:27017
 * 3. Navigate to database → collection
 * 4. View documents
 * 
 * Using MongoDB Shell (CLI):
 * mongosh
 * use innovativedb
 * db.chatconversations.find()
 * db.chatfeedbacks.find()
 */

/**
 * TASK 3: How to debug NLP issues?
 * 
 * Add logging to advancedChatbotController:
 * 
 * console.log('User message:', userMessage);
 * console.log('Sentiment:', sentiment);
 * console.log('Intent:', intent);
 * console.log('Keywords:', keywords);
 * console.log('Best match:', bestMatch);
 * console.log('Confidence:', confidence);
 * 
 * Check server terminal for output
 */

/**
 * TASK 4: How to add new FAQ entries?
 * 
 * FILE: server/chatbotData.js
 * 
 * Add to appropriate category:
 * {
 *   "id": "faq_123",
 *   "category": "Services",
 *   "question": "New question here?",
 *   "answer": "New answer here.",
 *   "keywords": ["keyword1", "keyword2"]
 * }
 * 
 * Save and restart server
 */

/**
 * TASK 5: How to change confidence threshold?
 * 
 * FILE: server/utils/matchingAlgorithm.js
 * 
 * Find: const CONFIDENCE_THRESHOLD = 0.2;
 * 
 * Change to desired value:
 * const CONFIDENCE_THRESHOLD = 0.3; // Higher = stricter
 */

/**
 * TASK 6: How to view analytics for a date range?
 * 
 * API Call:
 * GET /api/chatbot/analytics?startDate=2026-04-01&endDate=2026-04-10
 * 
 * Or access via Admin Dashboard:
 * http://localhost:5175 → ChatBot Analytics tab
 */

// ============================================================================
// TROUBLESHOOTING QUICK GUIDE
// ============================================================================

/**
 * ISSUE: "Cannot connect to MongoDB"
 * SOLUTION:
 * 1. Check MongoDB is running: mongod --version
 * 2. Start MongoDB: mongod
 * 3. Check connection string in server/config/db.js
 * 4. Restart server
 */

/**
 * ISSUE: "Bot not responding"
 * SOLUTION:
 * 1. Check backend is running: http://localhost:5000 in browser
 * 2. Check console for errors
 * 3. Verify sessionId header being sent
 * 4. Check network tab in browser DevTools
 */

/**
 * ISSUE: "Analytics not showing data"
 * SOLUTION:
 * 1. Check MongoDB has documents: db.chatconversations.count()
 * 2. Check date range is correct
 * 3. Hard refresh admin page (Ctrl+Shift+R)
 * 4. Check browser console for errors
 */

/**
 * ISSUE: "Feedback not saving"
 * SOLUTION:
 * 1. Check conversationId is valid ObjectId
 * 2. Check rating is 1-5 number
 * 3. Check MongoDB connection
 * 4. Check browser console for error message
 */

/**
 * ISSUE: "Low matching confidence"
 * SOLUTION:
 * 1. Check user message for typos in query
 * 2. Add more keywords to FAQ entries
 * 3. Add similar question variations to FAQ
 * 4. Lower confidence threshold if appropriate
 * 5. Check NLP keywords extraction
 */

// ============================================================================
// PERFORMANCE METRICS CHEAT SHEET
// ============================================================================

const METRICS = {
  responseTimeTarget: '< 500ms',
  databaseQueryTarget: '< 100ms',
  nlpProcessingTarget: '< 200ms',
  apiTimeoutSeconds: 10,
  maxConcurrentBrowserConnections: 5,
  maxMessagesPerSession: 1000,
  maxMessageLength: 5000,
  sessionExpiryDays: 30,
  messageRetentionDays: 90
};

// ============================================================================
// USEFUL SERVER ROUTES
// ============================================================================

/**
 * All Chatbot Routes (server/routes/chatbot.js)
 * 
 * POST   /api/chatbot                    - Get bot response
 * POST   /api/chatbot/feedback           - Submit feedback
 * POST   /api/chatbot/escalate           - Escalate to agent
 * POST   /api/chatbot/improve            - Submit improvement
 * GET    /api/chatbot/history            - Get conversation
 * GET    /api/chatbot/analytics          - Get admin metrics
 */

// ============================================================================
// VERSION INFO & CHANGELOG
// ============================================================================

const VERSION_INFO = {
  version: '2.0.0',
  releaseDate: '2026-04-10',
  previousVersion: '1.0.0',
  features: [
    'Advanced NLP (sentiment, intent, entities)',
    'Fuzzy matching with Levenshtein distance',
    'Conversation persistence in MongoDB',
    'User feedback & rating system',
    'Admin analytics dashboard',
    'Automatic escalation routing',
    'Session management',
    'Message suggestions'
  ],
  improvements: [
    'Better typo tolerance',
    'Higher match accuracy',
    'Faster response times',
    'More conversation data',
    'Real-time analytics'
  ],
  nextPlanned: [
    'AI language model integration (OpenAI/Claude)',
    'Multi-language support',
    'WhatsApp/Slack integration',
    'Predictive analytics',
    'Machine learning optimization'
  ]
};

// ============================================================================
// EXPORT ALL REFERENCES
// ============================================================================

module.exports = {
  VERSION_INFO,
  METRICS,
  sendMessage,
  getOrCreateSessionId,
  loadConversationHistory,
  submitFeedback,
  escalateConversation
};
