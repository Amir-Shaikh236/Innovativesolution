const { calculateSimilarity, extractKeywords } = require('./nlpUtils');

// Advanced matching algorithm
const findBestMatch = (userQuery, chatbotData) => {
  const normalizedQuery = userQuery.toLowerCase().trim();
  const queryWords = extractKeywords(normalizedQuery);
  
  let bestMatch = null;
  let bestScore = 0;
  const matches = [];
  
  chatbotData.forEach((item, index) => {
    const questionText = item.q.toLowerCase();
    
    // 1. Calculate semantic similarity (Levenshtein distance)
    const similarity = calculateSimilarity(normalizedQuery, questionText);
    
    // 2. Calculate word overlap score
    const questionWords = extractKeywords(questionText);
    const matchingWords = queryWords.filter(w => questionWords.some(qw => qw.includes(w) || w.includes(qw)));
    const wordOverlapScore = matchingWords.length / Math.max(queryWords.length, questionWords.length);
    
    // 3. Weight combination
    const totalScore = (similarity * 0.4) + (wordOverlapScore * 0.6);
    
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMatch = { ...item, index, confidence: totalScore };
    }
    
    if (totalScore > 0.3) {
      matches.push({ ...item, score: totalScore });
    }
  });
  
  return {
    bestMatch: bestMatch && bestScore > 0.2 ? bestMatch : null,
    alternativeMatches: matches.sort((a, b) => b.score - a.score).slice(0, 3),
    confidence: bestScore
  };
};

// Ranked matching with multiple heuristics
const findBestMatchAdvanced = (userQuery, chatbotData) => {
  const normalizedQuery = userQuery.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\W+/).filter(w => w.length > 0);
  
  const scoredMatches = chatbotData.map((item, index) => {
    const questionText = item.q.toLowerCase();
    let score = 0;
    
    // Exact phrase match - highest priority
    if (questionText.includes(normalizedQuery)) {
      score += 100;
    }
    
    // All words match
    const questionWords = questionText.split(/\W+/);
    const allWordsMatch = queryWords.every(w => questionText.includes(w));
    if (allWordsMatch && queryWords.length > 1) {
      score += 80;
    }
    
    // Word matching with weight
    queryWords.forEach(word => {
      if (word.length > 2 && questionText.includes(word)) {
        score += 10;
      }
    });
    
    // Partial word matching
    queryWords.forEach(word => {
      const matches = questionWords.filter(qw => 
        (qw.includes(word) || word.includes(qw)) && qw.length > 0
      );
      score += matches.length * 5;
    });
    
    // Length similarity bonus (prefer similar length questions)
    const lengthDiff = Math.abs(queryWords.length - questionWords.length);
    if (lengthDiff <= 2) {
      score += 5;
    }
    
    return {
      item,
      index,
      score,
      confidence: Math.min(1, score / 100)
    };
  });
  
  const sorted = scoredMatches.sort((a, b) => b.score - a.score);
  
  return {
    bestMatch: sorted[0].score > 0 ? sorted[0].item : null,
    alternativeMatches: sorted.slice(1, 4).map(m => m.item).filter(m => m),
    confidence: sorted[0].confidence,
    allMatches: sorted
  };
};

module.exports = {
  findBestMatch,
  findBestMatchAdvanced
};
