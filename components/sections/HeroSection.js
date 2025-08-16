import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '../../utils/routes';
import AOS from 'aos';
import { initAOS } from '../../utils/aos-config';

const HeroSection = () => {
  const [typedText, setTypedText] = useState('');
  const headingText = "Discover Local Events on the Map";
  const typingSpeed = 70; // Adjust typing speed in milliseconds

  useEffect(() => {
    // 1. Initialize the AOS library for fade-in animations
    initAOS();

    // 2. Animate the number stats
    const animateNumbers = () => {
      const statElements = document.querySelectorAll('.stat-value');

      statElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let currentCount = 0;
        const duration = 2000;
        const increment = target / (duration / 10);

        const counter = setInterval(() => {
          currentCount += increment;
          if (currentCount >= target) {
            clearInterval(counter);
            currentCount = target;
          }

          const formattedCount = Math.floor(currentCount).toLocaleString() + '+';
          el.textContent = formattedCount;
        }, 10);
      });
    };

    // 3. The typing animation for the heading
    let charIndex = 0;
    const type = () => {
      if (charIndex <= headingText.length) {
        setTypedText(headingText.substring(0, charIndex));
        charIndex++;
        setTimeout(type, typingSpeed);
      }
    };
    
    // Start the typing and number animation after a slight delay
    const animationTimeout = setTimeout(() => {
      type();
      animateNumbers();
    }, 500);

    // Cleanup function to clear timeouts
    return () => {
      clearTimeout(animationTimeout);
      // You may also want to clear intervals from the number animation if the component unmounts early
    };

  }, []); // The empty dependency array ensures this runs only once on mount

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-shape shape-1"></div>
        <div className="hero-shape shape-2"></div>
        <div className="hero-shape shape-3"></div>
      </div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">{typedText}</h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="400">
            Find and share community events happening around you. 
            Connect with people who share your interests and never miss out on what's happening nearby.
          </p>
          <div className="hero-buttons" data-aos="fade-up" data-aos-delay="600">
            <Link href={ROUTES.MAP}>
              <span className="glass-btn primary-glass">
                <span className="btn-text">Explore Map</span>
              </span>
            </Link>
            <Link href={ROUTES.ABOUT}>
              <span className="glass-btn secondary-glass">
                <span className="btn-text">Learn More</span>
              </span>
            </Link>
          </div>
          
          <div className="hero-stats" data-aos="fade-up" data-aos-delay="800">
            <div className="stat-item">
              <span className="stat-value" data-target="500">0+</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" data-target="10000">0+</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" data-target="50">0+</span>
              <span className="stat-label">Cities</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image">
          <div className="hero-image-wrapper">
            <Image 
              src="/images/heropage.jpg" 
              alt="Map with event pins showing local events" 
              width={600} 
              height={450}
              priority
              className="hero-img"
            />
            <div className="floating-event">
              <div className="event-pin"></div>
              <div className="event-card event-card-primary">
                <div className="event-title">Community Event</div>
                <div className="event-details">Today • 6:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .hero-section {
          padding: 8rem 0 4rem;
          background: linear-gradient(135deg, var(--background), var(--background-alt));
          position: relative;
          overflow: hidden;
          min-height: 90vh;
          display: flex;
          align-items: center;
        }
        
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
        }
        
        .hero-shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--primary-rgb), 0.05) 100%);
        }
        
        .shape-1 {
          width: 400px;
          height: 400px;
          top: -200px;
          left: -100px;
          animation: float 8s ease-in-out infinite;
        }
        
        .shape-2 {
          width: 300px;
          height: 300px;
          bottom: -150px;
          right: 10%;
          animation: float 12s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .shape-3 {
          width: 200px;
          height: 200px;
          top: 20%;
          right: -50px;
          animation: float 10s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .hero-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          position: relative;
          z-index: 1;
          width: 100%;
        }
        
        .hero-content {
          flex: 1;
          max-width: 600px;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
        
        .hero-title {
          font-size: 3.5rem;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          color: var(--text);
          position: relative;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
        
        /* The blinking cursor effect */
        .hero-title::after {
          content: '|';
          font-family: monospace;
          animation: blink-caret 0.75s step-end infinite;
          font-size: 1.2em;
          margin-left: 5px;
          color: var(--primary);
        }
        
        /* This hides the cursor when the text is complete */
        .hero-title.typing-done::after {
          content: none;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          color: var(--text-light);
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
        
        .glass-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
          overflow: hidden;
          text-decoration: none;
          letter-spacing: 0.5px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .primary-glass {

          background: rgba(var(--primary-rgb), 0.95);

          background: rgba(var(--primary-rgb), 1);

          color: white;
          box-shadow: 0 8px 32px rgba(var(--primary-rgb), 0.15);
        }
        
        .secondary-glass {
          background: rgba(255, 255, 255, 0.15);
          color: var(--text);
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
        }
        
        .glass-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: 0.6s;
        }
        
        .glass-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(var(--primary-rgb), 0.3);
        }
        
        .glass-btn:hover::before {
          left: 100%;
        }
        
        .primary-glass:hover {
          background: rgba(var(--primary-rgb), 0.8);
        }
        
        .secondary-glass:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        
        .btn-text {
          position: relative;
          z-index: 1;
        }
        
        .btn-text::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background-color: currentColor;
          transition: width 0.3s ease;
        }
        
        .glass-btn:hover .btn-text::after {
          width: 100%;
        }
        
        .hero-stats {
          display: flex;
          gap: 2.5rem;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.3rem;
          position: relative;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .hero-image {
          flex: 1;
          max-width: 600px;
          position: relative;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
        }
        
        .hero-image-wrapper {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
          transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
          transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .hero-image-wrapper:hover {
          transform: perspective(1000px) rotateY(0) rotateX(0);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
        }
        
        .hero-img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 20px;
          transition: all 0.5s ease;
          object-fit: cover;
          object-position: center;
        }
        
        .floating-event {
          position: absolute;
          top: 30%;
          right: 20%;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: floatEvent 4s ease-in-out infinite;
        }
        
        .event-pin {
          width: 16px;
          height: 16px;
          background-color: var(--primary);
          border-radius: 50%;
          margin-bottom: 5px;
          position: relative;
          box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.7);
        }
        
        .event-pin::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          background-color: rgba(var(--primary-rgb), 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .event-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 10px 15px;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          min-width: 150px;
          transform: translateY(5px);
          
        }
        
        .event-title {
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 3px;
          color: black;
        }
        
        .event-details {
          font-size: 0.75rem;
          color: red;
        }
        
        .event-card-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-radius: 1.2rem;
          font-weight: 700;
          text-align: center;
          padding: 1.1rem 1.7rem;
          box-shadow: 0 4px 16px rgba(44, 62, 80, 0.10);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 180px;
        }
        .event-card-primary .event-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.2rem;
        }
        .event-card-primary .event-details {
          font-size: 1rem;
          font-weight: 500;
          color: #fff;
        }
        
        @keyframes blink-caret {
          from, to { color: transparent; }
          50% { color: var(--primary); }
        }
        
        @keyframes floatEvent {
          0% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.8); }
          50% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.8); }
        }
        
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        
        @media (max-width: 992px) {
          .hero-container {
            flex-direction: column;
            text-align: center;
            padding-top: 2rem;
          }
          
          .hero-content {
            max-width: 100%;
            margin-bottom: 3rem;
          }
          
          .hero-title::after {
            left: 50%;
            transform: translateX(-50%);
          }
          
          .hero-buttons {
            justify-content: center;
          }
          
          .hero-stats {
            justify-content: center;
          }
          
          .hero-image {
            max-width: 100%;
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            padding: 7rem 0 3rem;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            gap: 1rem;
          }
          
          .hero-stats {
            flex-wrap: wrap;
            gap: 1.5rem;
            justify-content: space-around;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;