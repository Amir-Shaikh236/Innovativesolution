const mongoose = require('mongoose');

const ChatConversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    userEmail: {
      type: String,
      default: null
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ['user', 'bot'],
          required: true
        },
        text: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        intent: {
          type: String,
          default: null
        },
        sentiment: {
          type: String,
          enum: ['positive', 'negative', 'neutral'],
          default: null
        },
        confidence: {
          type: Number,
          default: 0
        }
      }
    ],
    status: {
      type: String,
      enum: ['active', 'closed', 'escalated'],
      default: 'active'
    },
    escalated: {
      type: Boolean,
      default: false
    },
    escalatedToAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    topic: {
      type: String,
      default: null
    },
    satisfactionRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    feedback: {
      type: String,
      default: null
    },
    resolvedTime: {
      type: Date,
      default: null
    },
    duration: {
      type: Number,
      default: 0 // in seconds
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      language: {
        type: String,
        default: 'en'
      },
      country: String,
      referrer: String
    }
  },
  { timestamps: true }
);

// Compound index for faster queries
ChatConversationSchema.index({ sessionId: 1, createdAt: -1 });
ChatConversationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatConversation', ChatConversationSchema);
