import React, { useState, useRef, useEffect } from 'react';

const ChatBotFAQ = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi there! 👋 I'm your EventMappr Help Bot. How can I assist you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef(null);

  const FAQS = [
    { keywords: ['add', 'create', 'event'], answer: "To add an event: Click on the map → fill in title, category, date/time → Save. (Login required)." },
    { keywords: ['near', 'nearby', 'location'], answer: "Click the 'Find Nearby' button to center the map on events around you." },
    { keywords: ['filter', 'category', 'explore'], answer: "Use category filters (Music, Tech, Market, etc.) to explore events easily." },
    { keywords: ['delete', 'remove', 'edit'], answer: "If logged in, you can edit or delete events you’ve added from the event cards." },
    { keywords: ['mobile', 'phone', 'responsive'], answer: "EventMappr is fully mobile-friendly. All features work on phones and tablets." },
    { keywords: ['contact', 'support', 'help'], answer: "For support, email us at hello@eventmappr.com or call +1 (555) 123-4567." },
    { keywords: ['about', 'what', 'eventmappr'], answer: "EventMappr helps you discover and share local events pinned on an interactive map." },
    { keywords: ['tourist', 'places'], answer: "Explore our 'Tourist Places' section from the menu to discover attractions near you." },
    { keywords: ['currency', 'converter'], answer: "Use the 'Currency Converter' in the navigation bar to check real-time exchange rates." }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const findAnswer = (question) => {
    const q = question.toLowerCase();
    if (['hi', 'hello', 'hey'].some(greet => q.includes(greet))) {
      return "Hello! How can I help you with EventMappr today?";
    }
    for (const faq of FAQS) {
      if (faq.keywords.some(word => q.includes(word))) return faq.answer;
    }
    return "I can help with adding events, exploring maps, finding nearby spots, tourist info, or other EventMappr features. What would you like to know?";
  };

  const sendMessage = (text) => {
    setHasStarted(true);
    const userMsg = { text, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      const botMsg = { text: findAnswer(text), isBot: true };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className={`chatbot ${isOpen ? 'open' : ''}`}>
      <button className="chatbot-toggle" onClick={toggleChat} aria-label={isOpen ? "Close chat" : "Open chat"}>
        {isOpen ? '✕' : <span className="chat-icon">🗺️</span>}
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span className="chat-header-icon">🗺️</span>
            <h3>EventMappr Help Bot</h3>
            <span className="chatbot-status">Online</span>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                {msg.text}
              </div>
            ))}

            {!hasStarted && (
              <div className="suggestions">
                <p>Find answers to the most common questions about using EventMappr</p>
                <button onClick={() => sendMessage('How do I add an event?')}>How do I add an event?</button>
                <button onClick={() => sendMessage('Where can I find tourist places?')}>Where can I find tourist places?</button>
                <button onClick={() => sendMessage('How can I use the currency converter?')}>How can I use the currency converter?</button>
              </div>
            )}

            {isTyping && (
              <div className="message bot typing">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ask me something..."
            />
            <button type="submit" aria-label="Send">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="white" fill="none">
                <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .chatbot { position: fixed; bottom: 20px; right: 20px; z-index: 1000; }
        .chatbot-toggle {
          width: 60px; height: 60px; border-radius: 50%; border: none;
          background: #5e6eff; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer; transition: 0.3s;
          font-size: 1.5rem; color: white;
        }
        .chatbot-toggle:hover { transform: scale(1.05); background: #3b4eff; }
        .chatbot-container {
          position: absolute; bottom: 80px; right: 0; width: 340px; height: 500px;
          background: white; border-radius: 20px; display: flex; flex-direction: column;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slideUp 0.3s ease;
        }
        @keyframes slideUp { from {opacity:0; transform:translateY(20px);} to {opacity:1; transform:translateY(0);} }
        .chatbot-header {
          background: linear-gradient(135deg, #5e6eff, #3b4eff); color: white;
          display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 1rem;
          border-top-left-radius: 20px; border-top-right-radius: 20px;
        }
        .chat-header-icon { font-size: 1.2rem; }
        .chatbot-header h3 { margin: 0; font-size: 1rem; flex: 1; text-align: center; }
        .chatbot-status::before { content:''; width:8px; height:8px; background:#4CAF50; border-radius:50%; margin-right:5px; }
        .chatbot-messages { flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.8rem; }
        .message { padding: 0.7rem 1rem; border-radius: 18px; max-width: 80%; word-break: break-word; }
        .message.bot { background: #f0f0f5; color: #333; align-self: flex-start; }
        .message.user { background: #5e6eff; color: white; align-self: flex-end; }
        .suggestions { background:#fafafa; border-radius: 10px; padding: 0.5rem; display:flex; flex-direction:column; gap:0.5rem; }
        .suggestions p { font-size: 0.85rem; margin: 0 0 0.5rem 0; text-align: center; color:#555; }
        .suggestions button { background: #5e6eff; color: white; border:none; border-radius: 15px; padding: 0.5rem; cursor:pointer; font-size: 0.8rem; }
        .suggestions button:hover { background:#3b4eff; }
        .chatbot-input { display: flex; padding: 0.8rem; border-top: 1px solid #ddd; }
        .chatbot-input input { flex: 1; padding: 0.7rem; border: 1px solid #ccc; border-radius: 20px; font-size: 0.9rem; }
        .chatbot-input button { background:#5e6eff; border:none; border-radius:50%; width:40px; height:40px; margin-left:0.5rem; cursor:pointer; }
        @media(max-width:576px){ .chatbot-container{width:calc(100vw - 40px);} .chatbot-toggle{width:50px; height:50px;} }
      `}</style>
    </div>
  );
};

export default ChatBotFAQ;
