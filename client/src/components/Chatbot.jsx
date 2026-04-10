import React, { useState, useRef, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import chatbotData from "../assets/chatbotData";

// This function finds the best matching answer from the pre-filled data.
const getAnswerFromData = (query) => {
  const normalizedQuery = query.toLowerCase().trim();

  const inputWords = normalizedQuery.split(/\W+/).filter(Boolean);
  let maxScore = 0;
  let bestMatch = null;

  for (const item of chatbotData) {
    const qText = item.q.toLowerCase();
    let score = 0;
    inputWords.forEach(word => {
      if (qText.includes(word)) {
        score++;
      }
    });

    if (score > maxScore) {
      maxScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && maxScore > 0) {
    return bestMatch;
  }

  return { a: "I'm sorry, I couldn't find an answer to that question. Could you please rephrase or contact our support team?" };
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();  
  const chatEndRef = useRef(null);
  

  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { sender: 'bot', text: 'Hello 👋 I’m ISAC your AI assistant. How can I help you today?' },
        { sender: 'bot', text: 'I can give you a quick tour, answer common questions, or redirect you to our forms.' }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const fetchChatbotReply = async (userMessage) => {
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          return { text: data.reply, cta: data.cta || null };
        }
      }
      console.warn('Chatbot backend returned unexpected response:', res.status);
    } catch (err) {
      console.warn('Chatbot backend request failed:', err);
    }

    const local = getAnswerFromData(userMessage);
    return { text: local.a, cta: local.cta || null };
  };

  const handleSend = async (messageToSend, isQuickAction = false) => {
    const userMessage = messageToSend || userInput.trim();
    if (!userMessage) return;

    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    if (!isQuickAction) {
      setUserInput('');
    }
    setIsTyping(true);

    setTimeout(async () => {
      let response = { text: '', cta: null };

      if (isQuickAction) {
        switch (userMessage) {
          case 'Website Guide':
            response = {
              text: 'I can provide a step-by-step guided walkthrough on how to use the website and its core functions. Would you like to start?',
              cta: { label: 'Start Tour', link: '/services' }
            };
            break;
          case 'FAQs':
            response = {
              text: 'I can provide answers to common questions about our services for both clients and gig workers. What category are you interested in? (e.g., Verification, Payments, NDAs, etc.)',
              cta: { label: 'View FAQs', link: '/faqs' }
            };
            break;
          case 'Customer Care':
            response = {
              text: 'Our support team is available 24/7. Please provide your email address, and I will forward your request to a human representative.',
              cta: { label: 'Contact Page', link: '/contact' }
            };
            break;
          default:
            const local = getAnswerFromData(userMessage);
            response = { text: local.a, cta: local.cta || null };
        }
      } else {
        response = await fetchChatbotReply(userMessage);
      }

      setMessages(prev => [...prev, { sender: 'bot', text: response.text, cta: response.cta }]);
      setIsTyping(false);
    }, 600);
  };

  const handleQuickAction = (action) => {
    // Pass the label directly to handleSend
    const label = quickActions.find(qa => qa.action === action)?.label;
    if (label) {
      handleSend(label, true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: "Website Guide", action: "tour" },
    { label: "Customer Care", action: "customer-care" },
    { label: "FAQs", action: "faqs" },
  ];

  return (
    <>
      {/* Collapsed State (Floating Button) */}
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

      {/* Expanded State (Chat Window) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-8 right-8 max-w-xs h-[70vh] max-h-[600px] flex flex-col rounded-2xl shadow-2xl z-50 backdrop-blur-md"
            style={{
              background: "rgba(6, 0, 9, 0.9)",
              boxShadow: "0 0 30px rgba(64, 224, 208, 0.5)",
            }}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold" style={{ color: "#40E0D0" }}>ISAC</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-[#40E0D0] transition">
                <X size={24} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-[#F5F5F5]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] text-left ${msg.sender === "user"
                        ? "bg-white text-black"
                        : "bg-gray-800/50 text-[#40E0D0] border border-[#060640]"
                      }`}
                  >
                    {msg.text}
                    {msg.cta && msg.sender === 'bot' && (
                      <button
                        onClick={() => navigate(msg.cta.link)}
                        className="mt-2 px-3 py-1 rounded bg-[#40E0D0] text-black font-semibold text-sm hover:bg-[#2E8B57]"
                      >
                        {msg.cta.label}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-lg bg-gray-800/50 text-gray-400">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-[#40E0D0] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="h-2 w-2 bg-[#40E0D0] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-2 w-2 bg-[#40E0D0] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Buttons */}
            <div className="p-4 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.action)}
                  className="px-4 py-2 rounded-md font-semibold text-white transition-all"
                  style={{ background: "#060640", boxShadow: "0 0 8px rgba(64, 224, 208, 0.4)" }}
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Footer - User Input */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-gray-700 flex items-center">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1 bg-[#060009] border border-[#068330] rounded-lg px-4 py-2 mr-2 text-white focus:outline-none focus:ring-1 focus:ring-[#068330]"
              />
              <button
                type="submit"
                className="bg-[#060640] p-3 rounded-lg text-white"
                style={{ boxShadow: "0 0 10px #068330" }}
                disabled={isTyping || !userInput.trim()}
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;