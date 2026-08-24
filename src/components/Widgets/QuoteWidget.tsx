import React, { useState, useEffect } from 'react';
import { QUOTES } from '../../constants';

export const QuoteWidget: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const nextQuote = () => {
    setQuoteIndex(prev => (prev + 1) % QUOTES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextQuote();
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const currentQuote = QUOTES[quoteIndex];

  return (
    <div className="widget-chip quote-widget" id="quote-widget">
      <span id="quote-text">"{currentQuote.quote}"</span>
      <span className="quote-author" id="quote-author">
        — {currentQuote.author}
      </span>
      <button
        className="quote-refresh-btn"
        id="quote-refresh-btn"
        title="Next Quote"
        aria-label="Next Quote"
        onClick={nextQuote}
      >
        ↻
      </button>
    </div>
  );
};
