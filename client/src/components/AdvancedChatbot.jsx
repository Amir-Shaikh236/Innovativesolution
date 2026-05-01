import React, { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, ThumbsUp, ThumbsDown, Star, AlertCircle, MessageSquare, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import chatbotData from "../assets/chatbotData";

// Session ID management
const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem('chatbot_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatbot_session_id', sessionId);
  }
  return sessionId;
};

const AdvancedChatbot = () => {
  // State Management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [shouldEscalate, setShouldEscalate] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  const navigate = useNavigate();  
  const chatEndRef = useRef(null);

  // Initialize Session
  useEffect(() => {
    const id = getOrCreateSessionId();
    setSessionId(id);
  }, []);

  // Load Conversation History
  const loadConversationHistory = async (id) => {
    try {
      const res = await fetch(`/api/chatbot/history/${id}`);
      if (res.ok) {
        const data = await res.json();
        setConversationHistory(data.messages || []);
        // Load previous messages
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages.map((msg, idx) => ({
            id: idx,
            sender: msg.sender,
            text: msg.text,
            timestamp: new Date(msg.timestamp),
            intent: msg.intent,
            sentiment: msg.sentiment
          })));
        }
      }
    } catch (err) {
      console.warn('Could not load conversation history:', err);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Initialize chat
  useEffect(() => {
    if (isOpen && messages.length === 0 && sessionId) {
      const initialMessages = [
        { 
          id: 1,
          sender: 'bot', 
          text: 'Hello 👋 I\'m ISAC, your AI assistant powered by advanced NLP and machine learning. How can I help you today?',
          timestamp: new Date(),
          type: 'greeting'
        },
        { 
          id: 2,
          sender: 'bot', 
          text: 'I can answer questions about our services, guide you through the website, or escalate urgent concerns to our human support team.' ,
          timestamp: new Date(),
          type: 'greeting'
        }
      ];
      setMessages(initialMessages);
      if (sessionId) {
        loadConversationHistory(sessionId);
      }
    }
  }, [isOpen, sessionId]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setShowFeedback(false);
    setShowHistory(false);
  };

  // Fetch chatbot reply with advanced processing
  const fetchChatbotReply = async (userMessage) => {
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          return {
            text: data.reply,
            cta: data.cta || null,
            shouldEscalate: data.shouldEscalate || false,
            suggestions: data.suggestions || [],
            metadata: data.metadata || {},
            sessionId: data.sessionId
          };
        }
      }
      console.warn('Chatbot backend returned unexpected response:', res.status);
    } catch (err) {
      console.warn('Chatbot backend request failed:', err);
    }

    return { 
      text: "Our AI model is currently processing. Please try again.", 
      cta: null,
      suggestions: []
    };
  };

  // Send message
  const handleSend = async (messageToSend = null, isQuickAction = false) => {
    const userMessage = messageToSend || userInput.trim();
    if (!userMessage) return;

    const newMessageId = messages.length + 1;
    const userMsg = {
      id: newMessageId,
      sender: 'user',
      text: userMessage,
      timestamp: new Date(),
      type: 'user_message'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!isQuickAction) {
      setUserInput('');
    }
    setIsTyping(true);
    setShowSuggestions(false);
    setSuggestions([]);

    // Simulate thinking time with random delay for natural feel
    setTimeout(async () => {
      let response = { text: '', cta: null, suggestions: [] };

      if (isQuickAction) {
        switch (userMessage) {
          case 'Website Guide':
            response = {
              text: 'Great! I can guide you through our website features. Would you like to explore our services, talent pool, or pricing options?',
              cta: { label: 'Explore Services', link: '/services' },
              suggestions: [
                { question: 'What services do you offer?' },
                { question: 'How to join as talent?'},
                { question: 'Team-up request process'}
              ]
            };
            break;
          case 'FAQs':
            response = {
              text: 'I can help with FAQs about verification, payments, NDAs, support, and more. What category are you interested in?',
              cta: { label: 'View All FAQs', link: '/faqs' },
              suggestions: [
                { question: 'How to verify my account?' },
                { question: 'What are the payment methods?'},
                { question: 'Do you have NDAs?'}
              ]
            };
            break;
          case 'Customer Care':
            response = {
              text: 'I can connect you with our support team. We\'re available 24/7 to help. Would you like to escalate your concern?',
              cta: { label: 'Contact Support', link: '/contact' },
              suggestions: []
            };
            break;
          case 'Schedule Demo':
            response = {
              text: 'Scheduling a demo is a great way to see our platform in action! Our team will get back to you within 24 hours.',
              cta: { label: 'Schedule Now', link: '/contact' },
              suggestions: []
            };
            break;
          default:
            response = await fetchChatbotReply(userMessage);
        }
      } else {
        response = await fetchChatbotReply(userMessage);
      }

      setShouldEscalate(response.shouldEscalate || false);
      setSuggestions(response.suggestions || []);
      
      const botMsg = {
        id: newMessageId + 1,
        sender: 'bot',
        text: response.text,
        cta: response.cta,
        timestamp: new Date(),
        type: 'bot_message',
        suggestions: response.suggestions || [],
        shouldEscalate: response.shouldEscalate || false,
        metadata: response.metadata || {}
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      
      // Auto-show feedback after 3 bot messages
      if (messages.filter(m => m.sender === 'bot').length >= 3 && !feedbackSubmitted) {
        setTimeout(() => setShowFeedback(true), 1000);
      }
    }, 800 + Math.random() * 200);
  };

  // Handle Quick Actions
  const handleQuickAction = (action) => {
    const label = quickActions.find(qa => qa.action === action)?.label;
    if (label) {
      handleSend(label, true);
    }
  };

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    if (feedbackRating === 0) return;

    try {
      const res = await fetch('/api/chatbot/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          rating: feedbackRating,
          feedback: feedbackText,
          wasHelpful: feedbackRating >= 4
        })
      });

      if (res.ok) {
        setFeedbackSubmitted(true);
        setShowFeedback(false);
        setFeedbackRating(0);
        setFeedbackText('');
        
        // Add confirmation message
        const confirmMsg = {
          id: messages.length + 1,
          sender: 'bot',
          text: 'Thank you for your feedback! It helps us improve ISAC. Is there anything else I can help you with?',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, confirmMsg]);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  // Handle escalation
  const handleEscalate = async () => {
    try {
      const res = await fetch('/api/chatbot/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (res.ok) {
        const escalateMsg = {
          id: messages.length + 1,
          sender: 'bot',
          text: 'I\'ve escalated your concern to our support team. A human representative will contact you shortly via your preferred communication method.',
          timestamp: new Date(),
          cta: { label: 'Contact Support', link: '/contact' }
        };
        setMessages(prev => [...prev, escalateMsg]);
        setShouldEscalate(false);
      }
    } catch (err) {
      console.error('Error escalating:', err);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion.question);
  };

  // Copy message to clipboard
  const copyToClipboard = (text, messageId) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Keyboard shortcut
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: "Website Guide", action: "tour" },
    { label: "FAQs", action: "faqs" },
    { label: "Customer Care", action: "customer-care" },
    { label: "Schedule Demo", action: "demo" }
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-8 right-8 p-4 rounded-full shadow-lg z-50 transition-all"
        style={{
          background: "#060640",
          boxShadow: "0 0 15px rgba(64, 224, 208, 0.5)",
        }}
        onClick={handleOpen}
        initial={{ scale: 1, x: 0 }}
        whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(64, 224, 208, 0.7)" }}
        animate={isOpen ? { scale: 0, x: 100 } : { scale: 1, x: 0 }}
      >
        <Bot size={32} color="#40E0D0" />
      </motion.button>

      {/* Chat Window */}
        <AnimatePresence>
        {isOpen && (
        <motion.div
         className="fixed bottom-8 right-8 w-[360px] h-[70vh] max-h-[600px] flex flex-col rounded-3xl shadow-2xl z-50 backdrop-blur-xl border border-[#1b1b2f]"
         style={{
         background: "linear-gradient(145deg, #060009, #09091b)",
         boxShadow: "0 0 40px rgba(64, 224, 208, 0.3)",
          }}
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
          >         
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray">
             <div className="flex items-center gap-2">
              <Bot size={20} className="text-teal-400" />
               <div>
                <h2 className="text-lg font-semibold text-[#40E0D0] tracking-wide">ISAC</h2>
                  <p className="text-xs text-gray-400">AI Assistantt</p>
              </div>
            </div>

             <button onClick={handleClose} className="text-gray-400 hover:text-gray-700">
               <X size={20} />
              </button>
            </div>

            {/* Main Content Area */}
            {showFeedback ? (
              // Feedback Form
              <div className="flex-1 p-4 flex flex-col justify-between text-white">
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: "#40E0D0" }}>How helpful was this conversation?</h3>
                  <div className="flex gap-2 mb-6 justify-center">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFeedbackRating(rating)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          fill={rating <= feedbackRating ? "#40E0D0" : "none"}
                          color={rating <= feedbackRating ? "#40E0D0" : "#666"}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Any additional feedback? (optional)"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#40E0D0] resize-none"
                    rows="3"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={feedbackRating === 0}
                    className="flex-1 px-4 py-2 rounded-lg text-black font-semibold transition disabled:opacity-50"
                    style={{ background: "#40E0D0" }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="chat-scroll flex-1 p-4 overflow-y-auto space-y-4 text-sm text-[#F5F5F5]">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`p-3 rounded-lg max-w-[85%] text-left ${msg.sender === "user"
                          ? "bg-[#40E0D0] text-black"
                          : "bg-gray-800/70 text-gray-100 border border-gray-700"
                        }`}
                      >
                        {msg.text}
                        
                        {/* CTA Button */}
                        {msg.cta && msg.sender === 'bot' && (
                          <button
                            onClick={() => {
                              navigate(msg.cta.link);
                              handleClose();
                            }}
                            className="mt-2 px-3 py-2 rounded bg-[#40E0D0] text-black font-semibold text-sm hover:bg-cyan-400 transition w-full"
                          >
                            {msg.cta.label || msg.cta.text}
                          </button>
                        )}

                        {/* Actions for bot messages */}
                        {msg.sender === 'bot' && (
                          <div className="flex gap-2 mt-2 text-xs">
                            <button
                              onClick={() => copyToClipboard(msg.text, msg.id)}
                              className="p-1 hover:bg-gray-700 rounded transition"
                              title="Copy message"
                            >
                              {copiedMessageId === msg.id ? (
                                <Check size={16} color="#40E0D0" />
                              ) : (
                                <Copy size={16} color="#999" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="p-3 rounded-lg bg-gray-800/70 text-gray-400 border border-gray-700">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-[#40E0D0] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="h-2 w-2 bg-[#40E0D0] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="h-2 w-2 bg-[#40E0D0] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {suggestions.length > 0 && !isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-gray-400"
                    >
                      <p className="mb-2" style={{ color: "#40E0D0" }}>💡 Suggested follow-ups:</p>
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left p-2 rounded hover:bg-gray-700 transition mb-1 text-gray-300 hover:text-white"
                        >
                          → {suggestion.question}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Escalation Alert */}
                  {shouldEscalate && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 rounded-lg bg-orange-900/30 border border-orange-700 text-orange-200 text-sm flex gap-2 items-start"
                    >
                      <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Need human assistance?</p>
                        <p className="text-xs mt-1">Our support team can help with your specific situation.</p>
                        <button
                          onClick={handleEscalate}
                          className="mt-2 px-3 py-1 rounded bg-orange-600 hover:bg-orange-700 transition text-white text-xs font-semibold"
                        >
                          Connect with Agent
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="p-4 flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.label}
                      onClick={() => handleQuickAction(action.action)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-2 py-1 rounded-sm font-semibold text-white text-sm transition-all"
                      style={{ background: "#061a40", boxShadow: "0 0 8px rgba(64, 224, 208, 0.4)" }}
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </div>

                {/* Input Area */}
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-black flex items-center gap-2 bg-gray-900">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-[#060009] border border-[#068330] rounded-lg px-4 py-2 mr-2 text-white focus:outline-none focus:ring-1 focus:ring-[#068330]"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg text-white transition-all disabled:opacity-50"
                    style={{ background: "#080683", boxShadow: "0 0 10px rgba(64, 224, 219, 0.5)" }}
                    disabled={isTyping || !userInput.trim()}
                  >
                    <Send size={20} />
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdvancedChatbot;
