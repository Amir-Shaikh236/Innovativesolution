# Advanced Chatbot System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  AdvancedChatbot.jsx                                     │   │
│  │  ├─ Message Display & Input                             │   │
│  │  ├─ Session Management (localStorage)                   │   │
│  │  ├─ Feedback Form                                       │   │
│  │  ├─ Suggestions Display                                 │   │
│  │  ├─ Escalation Alerts                                   │   │
│  │  └─ Message Animations (Framer Motion)                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
                    (REST API via axios)
                              
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Server                                       │   │
│  │  ├─ chatbot.js (Routes)                                 │   │
│  │  │  ├─ POST /api/chatbot (main endpoint)                │   │
│  │  │  ├─ POST /api/chatbot/feedback                       │   │
│  │  │  ├─ GET /api/chatbot/history                         │   │
│  │  │  ├─ POST /api/chatbot/escalate                       │   │
│  │  │  ├─ POST /api/chatbot/improve                        │   │
│  │  │  └─ GET /api/chatbot/analytics                       │   │
│  │  └─ Middleware (auth, validation, error handling)       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  advancedChatbotController.js                            │   │
│  │  ├─ getAdvancedChatbotReply()                            │   │
│  │  │  ├─ Validate input                                   │   │
│  │  │  ├─ Get/Create session                               │   │
│  │  │  ├─ Run NLP pipeline                                 │   │
│  │  │  ├─ Find best FAQ match                              │   │
│  │  │  ├─ Check for escalation                             │   │
│  │  │  ├─ Save conversation                                │   │
│  │  │  └─ Return response with metadata                    │   │
│  │  ├─ submitChatbotFeedback()                             │   │
│  │  ├─ escalateConversation()                              │   │
│  │  ├─ getChatbotAnalytics()                               │   │
│  │  └─ getChatbotHistory()                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                      NLP PROCESSING LAYER                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  nlpUtils.js & matchingAlgorithm.js                      │   │
│  │  ├─ sentimentAnalysis()                                  │   │
│  │  │  └─ Returns: positive|negative|neutral               │   │
│  │  ├─ classifyIntent()                                     │   │
│  │  │  └─ Returns: greeting|farewell|help|complaint|etc    │   │
│  │  ├─ extractEntities()                                    │   │
│  │  │  └─ Returns: [{ type, value }]                       │   │
│  │  ├─ extractKeywords()                                    │   │
│  │  │  └─ Returns: [keywords]                              │   │
│  │  └─ findBestMatchAdvanced()                              │   │
│  │     ├─ Fuzzy matching (Levenshtein distance)             │   │
│  │     ├─ Semantic similarity (word overlap)                │   │
│  │     ├─ Keyword matching                                  │   │
│  │     └─ Confidence scoring                                │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MongoDB + Mongoose                                      │   │
│  │  ├─ ChatConversation Model                               │   │
│  │  │  ├─ sessionId (unique, indexed)                       │   │
│  │  │  ├─ messages[] (with metadata)                        │   │
│  │  │  ├─ sentiment, intent, entities, keywords             │   │
│  │  │  ├─ status (active|closed|escalated)                  │   │
│  │  │  └─ timestamps                                        │   │
│  │  ├─ ChatFeedback Model                                   │   │
│  │  │  ├─ conversationId (reference)                        │   │
│  │  │  ├─ userId, rating, comment                           │   │
│  │  │  └─ qualityAssessment                                 │   │
│  │  └─ FAQ Data (chatbotData.js)                            │   │
│  │     ├─ Categories & Topics                               │   │
│  │     └─ Questions & Answers                               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Request Flow (User Message → Bot Response)

```
User Types Message
    ↓
advancedChatbot.jsx captures input
    ↓
Creates/Uses sessionId from localStorage
    ↓
Sends to /api/chatbot endpoint
    ├─ Headers: { 'x-session-id': sessionId }
    └─ Body: { message: "user text" }
    ↓
advancedChatbotController.getAdvancedChatbotReply()
    ↓
1. VALIDATION
   ├─ Check message not empty
   └─ Check session valid
    ↓
2. SESSION MANAGEMENT
   ├─ Query MongoDB for sessionId
   ├─ If exists: Update existing
   └─ If new: Create ChatConversation doc
    ↓
3. NLP PIPELINE (nlpUtils.js)
   ├─ sentimentAnalysis(userMessage)
   │  └─ Returns: "positive"|"negative"|"neutral"
   ├─ classifyIntent(userMessage)
   │  └─ Returns: intent type + confidence
   ├─ extractEntities(userMessage)
   │  └─ Returns: array of { type, value }
   └─ extractKeywords(userMessage)
      └─ Returns: array of keywords
    ↓
4. FAQ MATCHING (matchingAlgorithm.js)
   ├─ findBestMatchAdvanced(userMessage, keywords)
   │  ├─ Iterate all FAQs
   │  ├─ Calculate similarity score:
   │  │  ├─ Levenshtein distance (handling typos)
   │  │  ├─ Keyword overlap (word matches)
   │  │  ├─ Semantic similarity (synonym detection)
   │  │  └─ Combined weighted score
   │  ├─ Sort by score
   │  └─ Return top match + alternatives
    ↓
5. ESCALATION CHECK
   ├─ If sentiment === "negative" → ESCALATE
   ├─ If intent === "complaint" → ESCALATE
   ├─ If confidence < 0.2 → ESCALATE
   └─ If user explicitly requests → ESCALATE
    ↓
6. RESPONSE BUILDING
   ├─ Get matched FAQ answer
   ├─ Format with suggestions
   ├─ Add escalation alert if needed
   └─ Build metadata object
    ↓
7. DATABASE SAVE
   ├─ Save user message to ChatConversation
   ├─ Save bot response to ChatConversation
   ├─ Store NLP metadata (sentiment, intent, etc.)
   ├─ Update status if escalrated
   └─ Set timestamps
    ↓
8. RESPONSE RETURN
   └─ Send to client:
      {
        response: "answer text",
        intent: "...",
        sentiment: "...",
        confidence: 0.85,
        suggestions: [...],
        shouldEscalate: false,
        escalationReason: null
      }
    ↓
Client receives response
    ↓
advancedChatbot.jsx:
    ├─ Animate message display
    ├─ Show suggestions (if any)
    ├─ Show escalation alert (if needed)
    └─ Save sessionId to localStorage
    ↓
User sees response + options
```

---

## Component Specifications

### 1. Client Component: AdvancedChatbot.jsx

**Responsibilities:**
- Message UI rendering
- Session management
- User input handling
- API communication
- Feedback collection
- Suggestion display

**Key State Variables:**
```javascript
messages[]              // All messages with timestamps
sessionId              // Unique session identifier
isLoading              // Show loading indicator
suggestions[]          // Suggested follow-ups
showFeedbackForm       // Toggle feedback UI
escalationAlert        // Show escalation notice
userRating             // Star rating (1-5)
feedbackText           // User comment
```

**Key Functions:**
```javascript
handleSendMessage()    // Capture, validate, send message
fetchBotResponse()     // Call /api/chatbot endpoint
handleFeedbackSubmit() // Call /api/chatbot/feedback
handleEscalate()       // Call /api/chatbot/escalate
loadSessionFromStorage() // Restore from localStorage
saveSessionToStorage() // Persist to localStorage
```

**Lifecycle:**
1. Mount: Check localStorage for sessionId
2. Render: Display messages + input + suggestions
3. User types: Update controlled input
4. User sends: Validate, save to state, call API
5. Response received: Add to messages, show suggestions
6. User feedback: Submit rating and comments

---

### 2. Controller: advancedChatbotController.js

**Main Functions:**

#### `getAdvancedChatbotReply(req, res)`
```
Input:  {sessionId, message}
Process: NLP → Matching → Escalation → DB Save
Output: {response, metadata, suggestions, escalation}
Status Codes:
  200 - Success
  400 - Bad request (validation failed)
  500 - Server error
```

#### `submitChatbotFeedback(req, res)`
```
Input:  {conversationId, rating, comment, qualityAssessment}
Process: Validate input → Create ChatFeedback doc
Output: {success, feedbackId}
```

#### `escalateConversation(req, res)`
```
Input:  {conversationId, reason}
Process: Update status to "escalated" → Notify admin
Output: {success, agentId}
```

#### `getChatbotHistory(req, res)`
```
Input:  {sessionId, limit}
Process: Query ChatConversation → Format messages
Output: {messages[], sessionInfo}
```

#### `getChatbotAnalytics(req, res)`
```
Input:  {dateRange, filters}
Process: Aggregate ChatConversation & ChatFeedback
Output: {metrics, trends, charts}
```

---

### 3. NLP Utils: nlpUtils.js

#### `sentimentAnalysis(text)`
```
Input:  "I'm very frustrated with your service"
Logic:  Check for negative keywords (frustrated, angry, hate, etc.)
Output: {sentiment: "negative", score: -0.8}
```

#### `classifyIntent(text)`
```
Input:  "How do I join as talent?"
Logic:  Check text against intent patterns
Output: {
  intent: "question",
  subIntent: "services",
  confidence: 0.92
}
Intent Types:
  - greeting: "hi", "hello"
  - farewell: "bye", "goodbye"
  - thanks: "thank you", "thanks"
  - help: "help", "assist"
  - complaint: "problem", "issue"
  - question: general inquiries
  - feedback: "feedback", "suggestion"
  - urgency: "urgent", "asap"
```

#### `extractEntities(text)`
```
Input:  "I'm John from New York"
Logic:  Pattern matching for names, locations, etc.
Output: [
  {type: "PERSON", value: "John"},
  {type: "LOCATION", value: "New York"}
]
```

#### `extractKeywords(text)`
```
Input:  "I want to join as a software engineer"
Logic:  Remove stopwords, extract meaningful terms
Output: ["join", "software", "engineer"]
```

---

### 4. Matching Algorithm: matchingAlgorithm.js

#### `findBestMatchAdvanced(userMessage, keywords)`

**Multi-Tier Scoring System:**

```
1. LEVENSHTEIN DISTANCE (Typo Tolerance)
   ├─ For each FAQ question
   ├─ Calculate character-level similarity
   ├─ Handle: "jion" → "join" (typo forgiveness)
   └─ Score: 0.0 to 1.0

2. KEYWORD OVERLAP (Exact Matches)
   ├─ Count matching keywords
   ├─ Weight by importance
   ├─ Handle: "how to join as talent"
   └─ Score: 0.0 to 1.0

3. SEMANTIC SIMILARITY (Meaning Detection)
   ├─ Word-level comparison
   ├─ Consider synonyms
   ├─ Handle: "employee" ≈ "staff"
   └─ Score: 0.0 to 1.0

4. COMBINED SCORE
   └─ final = (levenshtein × 0.3) + 
             (keywordOverlap × 0.4) + 
             (semanticSimilarity × 0.3)

5. SORT & RANK
   ├─ Choose top match
   ├─ Store alternatives
   └─ Return confidence
```

**Output:**
```javascript
{
  bestMatch: {
    question: "How do I join as a talent?",
    answer: "Fill out our form at...",
    category: "Services",
    confidence: 0.87
  },
  alternatives: [alternative FAQs],
  confidence: 0.87,
  shouldEscalate: false // if confidence < 0.2
}
```

---

## Database Schemas

### ChatConversation Collection

```javascript
{
  _id: ObjectId,
  
  // Session & User Info
  sessionId: "uuid-v4-string" (unique, indexed),
  userId: "optional-user-id",
  ipAddress: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  
  // Conversation Content
  messages: [
    {
      type: "user" | "bot",
      text: "What services do you offer?",
      timestamp: ISODate(),
      sentiment: "neutral",
      intent: "question",
      confidence: 0.92,
      entities: [{type, value}],
      keywords: ["services", "offer"]
    },
    {
      type: "bot",
      text: "We provide...",
      timestamp: ISODate(),
      matchedFAQ: "faq-id",
      confidence: 0.87,
      suggestions: ["FAQ2", "FAQ3"],
      escalationFlag: false
    }
  ],
  
  // Statistics
  messageCount: 5,
  avgConfidence: 0.89,
  hasEscalation: false,
  escalationReason: null,
  
  // Status
  status: "active" | "closed" | "escalated",
  startTime: ISODate(),
  endTime: ISODate(),
  duration: 320, // seconds
  
  // Metadata
  source: "web" | "mobile" | "api",
  language: "en",
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

### ChatFeedback Collection

```javascript
{
  _id: ObjectId,
  
  // Reference Data
  conversationId: ObjectId (reference to ChatConversation),
  sessionId: "uuid-v4-string",
  
  // Rating & Feedback
  rating: 1-5, // Star rating
  comment: "The bot was very helpful...",
  
  // Quality Assessment
  qualityAssessment: {
    accuracy: true,
    relevance: true,
    completeness: true,
    timeliness: true
  },
  
  // User Info
  userId: "optional-user-id",
  email: "user@example.com",
  
  // Metadata
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

---

## API Endpoints

### 1. POST /api/chatbot
**Get Bot Response**
```
Request:
  Headers: { 'x-session-id': 'uuid' }
  Body: { message: "How to join?" }

Response (200):
  {
    response: "You can join by...",
    intent: "question",
    sentiment: "neutral",
    confidence: 0.87,
    suggestions: ["FAQ2", "FAQ3"],
    sessionId: "uuid",
    escalationAlert: false,
    escalationReason: null
  }

Error (400):
  { error: "Message cannot be empty" }

Error (500):
  { error: "Server error", details: "..." }
```

### 2. POST /api/chatbot/feedback
**Submit User Feedback**
```
Request:
  Body: {
    conversationId: "id",
    rating: 5,
    comment: "Great bot!",
    qualityAssessment: {
      accuracy: true,
      relevance: true,
      completeness: true,
      timeliness: true
    }
  }

Response (200):
  { success: true, feedbackId: "id" }

Error (400):
  { error: "Invalid rating (1-5)" }
```

### 3. GET /api/chatbot/history
**Get Conversation History**
```
Request:
  Query: ?sessionId=uuid&limit=50

Response (200):
  {
    sessionId: "uuid",
    messages: [...],
    totalMessages: 10,
    startTime: "2026-04-10T...",
    endTime: "2026-04-10T..."
  }

Error (404):
  { error: "Session not found" }
```

### 4. POST /api/chatbot/escalate
**Escalate to Human Agent**
```
Request:
  Body: {
    sessionId: "uuid",
    reason: "User requested agent"
  }

Response (200):
  {
    success: true,
    agentId: "agent-123",
    queuePosition: 5
  }

Error (400):
  { error: "Invalid session" }
```

### 5. POST /api/chatbot/improve
**Submit Improvement Suggestion**
```
Request:
  Body: {
    sessionId: "uuid",
    suggestion: "Add FAQ about...",
    category: "Services"
  }

Response (200):
  { success: true, suggestionId: "id" }
```

### 6. GET /api/chatbot/analytics
**Get Analytics Dashboard Data**
```
Request:
  Query: ?startDate=2026-04-01&endDate=2026-04-10

Response (200):
  {
    metrics: {
      totalConversations: 250,
      avgRating: 4.2,
      escalationRate: 8.5,
      avgResolutionTime: 45
    },
    intents: { question: 150, complaint: 30, ... },
    sentiment: { positive: 60%, negative: 15%, ...},
    trends: [...],
    recentConversations: [...]
  }
```

---

## Security Architecture

### Input Validation
```javascript
// Example from advancedChatbotController
const validateMessage = (msg) => {
  if (!msg || typeof msg !== 'string') return false;
  if (msg.trim().length === 0) return false;
  if (msg.length > 5000) return false; // Prevent spam
  return true;
};
```

### XSS Prevention
```javascript
// All user input sanitized before storage
const sanitized = userMessage
  .trim()
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');
```

### Session Security
```javascript
// Session IDs generated with crypto.randomUUID()
// Stored in user's browser localStorage
// Validated on each request
// Can be invalidated server-side
```

### Rate Limiting (Recommended)
```javascript
// Implement per session:
// Max 100 messages per hour
// Max 1 message per 500ms
```

---

## Performance Optimization

### Caching Strategy
```
Client:
  ├─ sessionId cached in localStorage
  ├─ Recent FAQs cached in state
  └─ Message history cached locally

Server:
  ├─ FAQ data cached in memory
  ├─ Common queries cached (Redis optional)
  └─ User sessions cached briefly
```

### Database Indexing
```javascript
// ChatConversation indexes
db.chatconversations.createIndex({ sessionId: 1 }) // Query lookup
db.chatconversations.createIndex({ createdAt: -1 }) // Analytics
db.chatconversations.createIndex({ status: 1 }) // Escalation filtering

// ChatFeedback indexes
db.chatfeedbacks.createIndex({ conversationId: 1 })
db.chatfeedbacks.createIndex({ rating: 1 })
```

### Response Time Targets
```
API Response: < 500ms (including NLP)
Database Query: < 100ms
NLP Processing: < 200ms
Total: < 500ms per user message
```

---

## Error Handling

### Graceful Degradation
```
1. NLP fails → Use simple keyword matching
2. Database fails → Cache responses temporarily
3. Escalation fails → Queue escalation request
4. Match fails → Show "Try rewording your question"
```

### Error Logging
```javascript
// Log severity levels:
ERROR   - Critical issues (database down)
WARNING - Degraded service (slow response)
INFO    - Normal operations
DEBUG   - Development only
```

---

## Monitoring & Observability

### Key Metrics to Track
```
- Response time (p50, p95, p99)
- Error rate by endpoint
- Database query performance
- NLP processing time
- User satisfaction (rating distribution)
- Escalation rate
- Message volume over time
- Most common intents
- Lowest confidence matches
```

### Logging Points
```
1. Message received
2. NLP analysis complete
3. FAQ match found
4. Escalation triggered
5. Response sent
6. Feedback received
7. Any errors
```

---

## Scalability Roadmap

### Phase 1 (Current)
- Single server instance
- MongoDB database
- In-memory caching

### Phase 2 (Month 2)
- Load balancer
- Multiple server instances
- Redis caching layer
- Database replication

### Phase 3 (Month 3)
- Microservices architecture
- NLP service separation
- Analytics data warehouse
- Real-time analytics

### Phase 4 (Month 6)
- AI language model integration
- Multi-language support
- Global CDN deployment
- Advanced ML features

---

**Architecture Version**: 2.0  
**Last Updated**: April 10, 2026  
**Ready for**: Production deployment with 1000+ concurrent users
