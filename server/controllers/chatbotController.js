const chatbotData = require("../chatbotData");

exports.getChatbotReply = (req, res) => {
  try {
    console.log('[Chatbot Controller DEBUG] === Request received ===' );
    console.log('[Chatbot Controller DEBUG] Method:', req.method);
    console.log('[Chatbot Controller DEBUG] URL:', req.originalUrl);
    console.log('[Chatbot Controller DEBUG] Headers:', req.headers);
    console.log('[Chatbot Controller DEBUG] Body received:', req.body);

    if (!req.body || typeof req.body.message !== 'string') {
      console.error('[Chatbot Controller DEBUG] Invalid request format. Body:', req.body);
      return res.status(400).json({ reply: 'Invalid request format' });
    }

    const userMessage = req.body.message.toLowerCase().trim();
    console.log('[Chatbot Controller DEBUG] Processed message:', userMessage);

    if (userMessage === '') {
      console.log('[Chatbot Controller DEBUG] Empty message received');
      return res.json({
        reply: "Please type a question so I can assist you."
      });
    }

    let bestMatch = null;
    let maxScore = 0;

    const words = userMessage.split(/\W+/);
    console.log('[Chatbot Controller DEBUG] Extracted words:', words);
    console.log('[Chatbot Controller DEBUG] Total chatbot FAQ entries:', chatbotData.length);

    chatbotData.forEach((item, index) => {
      const question = item.q.toLowerCase();
      let score = 0;

      words.forEach(word => {
        if (question.includes(word)) {
          score++;
        }
      });

      if (score > maxScore) {
        console.log('[Chatbot Controller DEBUG] Better match found at index', index, '- FAQ:', item.q, '- Score:', score);
        maxScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch) {
      console.log('[Chatbot Controller DEBUG] Best match found:', bestMatch.q);
      console.log('[Chatbot Controller DEBUG] Sending response with reply and CTA');
      const response = {
        reply: bestMatch.a,
        cta: bestMatch.cta || null
      };
      console.log('[Chatbot Controller DEBUG] Final response:', response);
      return res.json(response);
    }

    console.log('[Chatbot Controller DEBUG] No match found. Sending fallback message');
    const fallbackResponse = {
      reply: "I'm sorry, I couldn't understand that. Please contact our support team."
    };
    console.log('[Chatbot Controller DEBUG] Fallback response:', fallbackResponse);
    res.json(fallbackResponse);

  } catch (error) {
    console.error('[Chatbot Controller ERROR] Exception caught:', error);
    console.error('[Chatbot Controller ERROR] Error name:', error.name);
    console.error('[Chatbot Controller ERROR] Error message:', error.message);
    console.error('[Chatbot Controller ERROR] Error stack:', error.stack);
    res.status(500).json({ error: "Chatbot server error" });
  }
};