// NLP Utilities for advanced chatbot processing

// Intent Classification
const intentPatterns = {
  greeting: {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good evening', 'howdy'],
    patterns: /^(hello|hi|hey|greetings|good\s*(morning|evening))/i
  },
  farewell: {
    keywords: ['bye', 'goodbye', 'exit', 'quit', 'see you', 'farewell'],
    patterns: /^(bye|goodbye|exit|quit|see\s*you|farewell)/i
  },
  thanks: {
    keywords: ['thanks', 'thank you', 'appreciate', 'thankyou', 'ty'],
    patterns: /(thanks|thank\s*you|appreciate|ty)/i
  },
  help: {
    keywords: ['help', 'assist', 'support', 'guide', 'how to', 'howtoinformation'],
    patterns: /(help|assist|support|guide|how\s*to|information)/i
  },
  complaint: {
    keywords: ['issue', 'problem', 'error', 'bug', 'not working', 'broken', 'fail', 'complaint', 'unhappy', 'frustrated'],
    patterns: /(issue|problem|error|bug|not\s*working|broken|fail|complaint|unhappy|frustrated)/i
  },
  question: {
    keywords: ['what', 'how', 'why', 'when', 'where', 'who', '?'],
    patterns: /(\?|^(what|how|why|when|where|who|which)\s)/i
  },
  feedback: {
    keywords: ['feedback', 'improvement', 'suggest', 'opinion', 'thoughts', 'comment'],
    patterns: /(feedback|improvement|suggest|opinion|thoughts|comment)/i
  },
  urgency: {
    keywords: ['urgent', 'emergency', 'asap', 'immediately', 'now', 'critical'],
    patterns: /(urgent|emergency|asap|immediately|critical|right\s*now)/i
  }
};

// Sentiment Analysis
const sentimentAnalysis = (text) => {
  const lowerText = text.toLowerCase();
  
  const positiveWords = [
    'good', 'great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'perfect',
    'love', 'awesome', 'brilliant', 'happy', 'pleased', 'satisfied', 'helpful',
    'thank', 'thanks', 'appreciate', 'grateful', 'thank you', 'impressed'
  ];
  
  const negativeWords = [
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'poor', 'hate', 'don\'t like',
    'problem', 'issue', 'error', 'bug', 'broken', 'fail', 'angry', 'frustrated',
    'disappointed', 'unhappy', 'sad', 'upset', 'annoyed', 'complain'
  ];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) {
    return { sentiment: 'positive', score: positiveScore };
  } else if (negativeScore > positiveScore) {
    return { sentiment: 'negative', score: negativeScore };
  }
  return { sentiment: 'neutral', score: 0 };
};

// Intent Classification
const classifyIntent = (text) => {
  for (const [intent, config] of Object.entries(intentPatterns)) {
    if (config.patterns.test(text)) {
      return { intent, confidence: 0.85 };
    }
  }
  return { intent: 'general_inquiry', confidence: 0.5 };
};

// Extract entities (emails, phone numbers, names, etc.)
const extractEntities = (text) => {
  const entities = {};
  
  // Email extraction
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/g;
  entities.emails = text.match(emailRegex) || [];
  
  // Phone number extraction (various formats)
  const phoneRegex = /(?:\+\d{1,3}[-.\s]?)?\(?[\d]{3}\)?[-.\s]?[\d]{3}[-.\s]?[\d]{4}/g;
  entities.phones = text.match(phoneRegex) || [];
  
  // URL extraction
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  entities.urls = text.match(urlRegex) || [];
  
  // Numbers
  const numbersRegex = /\b\d+(?:\.\d+)?\b/g;
  entities.numbers = text.match(numbersRegex) || [];
  
  return entities;
};

// Fuzzy matching for better question matching
const calculateSimilarity = (str1, str2) => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));
  
  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,      // deletion
        matrix[j - 1][i] + 1,      // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return 1 - (matrix[len2][len1] / Math.max(len1, len2));
};

// Keywords extraction
const extractKeywords = (text) => {
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const stopwords = new Set([
    'the', 'and', 'with', 'that', 'this', 'what', 'your', 'from', 'have', 'been',
    'will', 'would', 'could', 'should', 'about', 'more', 'some', 'please'
  ]);
  
  return words.filter(word => !stopwords.has(word) && word.length > 2);
};

module.exports = {
  sentimentAnalysis,
  classifyIntent,
  extractEntities,
  calculateSimilarity,
  extractKeywords,
  intentPatterns
};
