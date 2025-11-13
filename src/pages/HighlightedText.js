import React from 'react';

const categories = {
  "ai": {
    name: "Core AI terms",
    keywords: ["AI", "Artificial Intelligence", "ML", "Machine Learning", "Machine-Learning", "DL", "Deep Learning", "Deep-Learning", 
              "NLP", "natural language processing", "LLM", "large language model", "RL", 
              "reinforcement learning"],
    color: "#00c1e8"
  },
  "decision": {
    name: "Decision terms",
    keywords: ["decision", "decide", "decid"],
    color: "#eb4034"
  },
  "network": {
    name: "Other AI terms",
    keywords: ["neural network", "SVM", "support vector machine", "decision tree", "LSTM", 'GPT', "adversarial network", "ANN", "CNN", "DNN", "BERT", 'RNN', 'transformer', 'language model'],
    color: "#52d9de"
  },
  "technical": {
    name: "Technical terms",
    keywords: ["clinical", "patient", "diagnosis", "treatment", "therapy", "medical", "healthcare", "physician", "cancer", "tumor", "loan", "hiring"],
    color: "#51941eff"
  },
  "method": {
    name: "Method terms",
    keywords: ["model","algorithm", "survey", "review", "tutorial"],
    color: "#f5cb42"
  }
};

function HighlightedText({ text }) {
  const highlightText = (inputText) => {
    if (!inputText) return null;

    // Create a map of positions to highlight
    const highlights = [];
    const textLower = inputText.toLowerCase();

    // Sort keywords by length (longest first) to match longer phrases first
    const allKeywords = [];
    Object.entries(categories).forEach(([categoryKey, category]) => {
      category.keywords.forEach(keyword => {
        allKeywords.push({ keyword, category: categoryKey, color: category.color });
      });
    });
    allKeywords.sort((a, b) => b.keyword.length - a.keyword.length);

    // Find all matches
    allKeywords.forEach(({ keyword, category, color }) => {
      const keywordLower = keyword.toLowerCase();
      let index = 0;
      
      while ((index = textLower.indexOf(keywordLower, index)) !== -1) {
        const end = index + keyword.length;
        
        // Check if this position is already highlighted
        const overlaps = highlights.some(h => 
          (index >= h.start && index < h.end) || 
          (end > h.start && end <= h.end) ||
          (index <= h.start && end >= h.end)
        );
        
        if (!overlaps) {
          highlights.push({ start: index, end, color, keyword });
        }
        
        index = end;
      }
    });

    // Sort highlights by start position
    highlights.sort((a, b) => a.start - b.start);

    // Build the result
    const result = [];
    let lastIndex = 0;

    highlights.forEach((highlight, idx) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {inputText.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      result.push(
        <span
          key={`highlight-${idx}`}
          style={{
            color: highlight.color,
            fontWeight: '500',
            // backgroundColor: highlight.color+'66',
            // padding: '2px 4px',
            // borderRadius: '3px',
            // margin: '0 1px'
          }}
        >
          {inputText.substring(highlight.start, highlight.end)}
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining text
    if (lastIndex < inputText.length) {
      result.push(
        <span key="text-end">
          {inputText.substring(lastIndex)}
        </span>
      );
    }

    return result;
  };

  return <div>{highlightText(text)}</div>;
}

export default HighlightedText;