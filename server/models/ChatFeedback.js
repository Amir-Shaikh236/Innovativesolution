const mongoose = require('mongoose');

const ChatFeedbackSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatConversation',
      required: true
    },
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    wasHelpful: {
      type: Boolean,
      default: null
    },
    feedback: {
      type: String,
      default: null
    },
    suggestedTopic: {
      type: String,
      default: null
    },
    markedForImprovement: {
      type: Boolean,
      default: false
    },
    answers: {
      accurate: { type: Boolean, default: null },
      relevant: { type: Boolean, default: null },
      complete: { type: Boolean, default: null },
      timely: { type: Boolean, default: null }
    }
  },
  { timestamps: true }
);

ChatFeedbackSchema.index({ sessionId: 1, createdAt: -1 });
ChatFeedbackSchema.index({ conversationId: 1 });

module.exports = mongoose.model('ChatFeedback', ChatFeedbackSchema);
