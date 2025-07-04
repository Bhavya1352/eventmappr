import React, { useState } from 'react';
import Link from 'next/link';

const FAQSection = () => {
  const faqs = [
    {
      question: "What is EventMappr?",
      answer: "EventMappr is an interactive map-based platform that helps you discover and share local community events happening around you."
    },
    {
      question: "How do I add an event to the map?",
      answer: "Simply click on the location on the map where your event will take place, and fill out the event details in the form that appears."
    },
    {
      question: "Is EventMappr free to use?",
      answer: "Yes, EventMappr is completely free for both event organizers and attendees."
    },
    {
      question: "Can I filter events by category?",
      answer: "Absolutely! You can filter events by various categories like Music, Tech, Volunteering, Markets, and Art events."
    },
    {
      question: "Does EventMappr work on mobile devices?",
      answer: "Yes, EventMappr is fully responsive and works great on smartphones, tablets, and desktop computers."
    },
    {
      question: "How accurate is the location data?",
      answer: "Our location data is based on OpenStreetMap, providing accurate geolocation for all events. You can also manually adjust the pin location when adding an event."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <h2 className="section-title" data-aos="fade-up">Frequently Asked Questions</h2>
        <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
          Find answers to common questions about EventMappr
        </p>
        
        <div className="faq-container" data-aos="fade-up" data-aos-delay="200">
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div 
                className={`faq-item ${activeIndex === index ? 'active' : ''}`} 
                key={index}
                data-aos="fade-up"
                data-aos-delay={100 + (index * 50)}
              >
                <div 
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="question-text">{faq.question}</span>
                  <span className="faq-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d={activeIndex === index ? "M4 8H12" : "M4 8H12M8 4V12"} 
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="faq-cta" data-aos="fade-up" data-aos-delay="400">
          <p>Still have questions?</p>
          <Link href="/contact" legacyBehavior>
            <a className="bubble-btn primary-bubble">
              <span className="btn-icon">📧</span>
              <span className="btn-text">Contact Us</span>
            </a>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          padding: 5rem 0;
          background-color: var(--background);
          position: relative;
          overflow: hidden;
        }
        
        .section-title {
          text-align: center;
          margin-bottom: 1rem;
          font-size: 2.2rem;
          position: relative;
          color: var(--text);
        }
        
        .section-title:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--primary-light));
          border-radius: 2px;
        }
        
        .section-subtitle {
          text-align: center;
          max-width: 600px;
          margin: 1.5rem auto 3rem;
          color: var(--text-light);
        }
        
        .faq-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
        }
        
        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }
        
        .faq-item {
          background-color: var(--background);
          max-height: calc(1lh + 2rem);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          border: 1px solid rgba(var(--primary-rgb), 0.08);
        }
        
        .faq-item:hover {
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
        
        .faq-item.active {
          box-shadow: 0 8px 30px rgba(var(--primary-rgb), 0.15);
          border-color: rgba(var(--primary-rgb), 0.2);
          max-height: unset
        }
        
        .faq-question {
          padding: 1rem 1.25rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s ease;
          color: var(--text);
          position: relative;
          z-index: 2;
        }
        
        .faq-item.active .faq-question {
          color: var(--primary);
          background-color: rgba(var(--primary-rgb), 0.05);
        }
        
        .question-text {
          font-size: 1rem;
          padding-right: 1rem;
        }
        
        .faq-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          transition: transform 0.3s ease;
        }
        
        .faq-item.active .faq-icon {
          transform: rotate(180deg);
        }
        
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }
        
        .faq-item.active .faq-answer {
          max-height: 200px;
          padding: 0.75rem 1.25rem 1.25rem;
        }
        
        .faq-answer p {
          margin: 0;
          color: var(--text-light);
          line-height: 1.6;
          font-size: 0.95rem;
        }
        
        .faq-cta {
          text-align: center;
          margin-top: 3rem;
        }
        
        .faq-cta p {
          margin-bottom: 1rem;
          font-size: 1.1rem;
          color: var(--text-light);
        }
        
        .bubble-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1.25rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          z-index: 1;
          text-decoration: none;
          border: none;
        }
        
        .primary-bubble {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.3);
        }
        
        .bubble-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
          transform: translateX(-100%) rotate(45deg);
          transition: transform 0.6s ease;
          z-index: -1;
        }
        
        .bubble-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(var(--primary-rgb), 0.4);
        }
        
        .bubble-btn:hover::before {
          transform: translateX(100%) rotate(45deg);
        }
        
        .btn-icon {
          margin-right: 0.8rem;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }
        
        .bubble-btn:hover .btn-icon {
          transform: scale(1.2);
        }
        
        .btn-text {
          position: relative;
        }
        
        .btn-text::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: currentColor;
          transition: width 0.3s ease;
        }
        
        .bubble-btn:hover .btn-text::after {
          width: 100%;
        }
        
        @media (max-width: 768px) {
          .faq-grid {
            grid-template-columns: 1fr;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FAQSection; 