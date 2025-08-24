import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Reusable Button Component for better modularity
const Button = ({ children, onClick, type = 'submit', className = '' }) => (
  <button type={type} onClick={onClick} className={`btn ${className}`}>
    {children}
    <style jsx>{`
      .btn {
        background: linear-gradient(135deg, #4c66f5 0%, #3a0ca3 100%);
        color: white;
        padding: 0.875rem 2.25rem;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
        box-shadow: 0 8px 25px rgba(76, 102, 245, 0.3);
      }
      .btn:hover {
        background: linear-gradient(135deg, #3a0ca3 0%, #4c66f5 100%);

        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(76, 102, 245, 0.45);
      }
      .btn:active {
        transform: translateY(1px);
        box-shadow: 4px 4px 15px rgba(76, 102, 245, 0.2);
      }
      .btn-ghost {
        background: none;
        color: #4c66f5;
        border: 2px solid #4c66f5;
        box-shadow: none;
        transition: color 0.3s ease, background 0.3s ease;
      }
      .btn-ghost:hover {
        color: white;
        background: #4c66f5;
      }
    `}</style>
  </button>
);

// A simple but effective Contact form component
const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Add your form submission logic here (e.g., API call)
    alert('Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
      </div>
      <div className="input-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
      </div>
      <Button>Send Message</Button>
      <style jsx>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2.5rem;
          background-color: #1a1a2e; /* Darker form background for contrast */
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); /* Stronger shadow */
          transition: background-color 0.5s ease;
          border: 1px solid rgba(76, 102, 245, 0.2);
        }
        .input-group {
          display: flex;
          flex-direction: column;
        }
        label {
          font-weight: 600;
          color: #b0b0b0; /* Lighter label color */
          margin-bottom: 0.5rem;
          transition: color 0.5s ease;
        }
        input, textarea {
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #3b3b50; /* Darker border */
          font-size: 1rem;
          background-color: #2b2b40; /* Darker input background */
          color: white; /* White text color */
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.5s ease, color 0.5s ease;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #5a7eff; /* Brighter focus color */
          box-shadow: 0 0 0 3px rgba(90, 126, 255, 0.3); /* More vibrant focus shadow */
        }
      `}</style>
    </form>
  );
};

// Main Contact Page Component
const ContactPage = () => {
  const [heroGifError, setHeroGifError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 1000,
      easing: 'ease-out-quart',
      delay: 50,
    });
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      <Head>
        <title>Contact Us | EventMappr</title>
        <meta name="description" content="Get in touch with the EventMappr team. We'd love to hear from you!" />
      </Head>

      <div className="contact-page">
        <section className="hero-section">
          <div className="hero-grid container">
            <div className="hero-content" data-aos="fade-up" data-aos-delay="50">
              <h1 className="hero-heading">
                Let's <span className="highlight">Connect</span>
              </h1>
              <p className="hero-subtitle">
                We're thrilled to hear from you. Whether you have questions about our platform, partnership opportunities, or just want to say hello, our team is ready to assist.
              </p>
              <div className="hero-cta-group">
                <Button className="btn-primary">Get Started</Button>
                <Button className="btn-ghost">Learn More</Button>
              </div>
            </div>
            <div className="hero-visual" data-aos="fade-left" data-aos-delay="250">
              <div className="shape-1" data-aos="zoom-in" data-aos-delay="500"></div>
              <div className="shape-2" data-aos="zoom-in" data-aos-delay="700"></div>
              <div className="shape-3" data-aos="zoom-in" data-aos-delay="900"></div>
              {!heroGifError ? (
                <img
                  src="https://cdn.dribbble.com/userupload/25500553/file/original-9498b0fb08338f80b0a9309185407115.gif"
                  alt="Contact Us GIF"
                  className="featured-image hero-gif"
                  onError={() => setHeroGifError(true)}
                />
              ) : (
                <div className="hero-gif-placeholder">
                  <span>GIF not available</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <main className="content-wrapper container">
          <section className="contact-section grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-6 md:px-12 py-16">
  {/* Left Info Column */}
  <div className="info-column space-y-8" data-aos="fade-right">
    <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
      Contact Information
    </h2>
    <p className="section-subtitle text-lg text-gray-600 dark:text-gray-400">
      Find the best way to get in touch with us. We're here to help!
    </p>

    <ul className="info-list space-y-6">
      {/* Email */}
      <li className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md hover:shadow-lg transition" data-aos="fade-right" data-aos-delay="100">
        <div className="icon-circle flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Email Address</h4>
          <p className="text-gray-600 dark:text-gray-400">hello@eventmappr.com</p>
        </div>
      </li>

      {/* Phone */}
      <li className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md hover:shadow-lg transition" data-aos="fade-right" data-aos-delay="200">
        <div className="icon-circle flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2.06A19.85 19.85 0 0 1 1.84 2.82 2.18 2.18 0 0 1 4 2h3a2 2 0 0 1 2 2v3.18a3 3 0 0 1-1 2.22l-1.6 1.6a15.02 15.02 0 0 0 8.6 8.6l1.6-1.6a3 3 0 0 1 2.22-1H19a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Phone Number</h4>
          <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
        </div>
      </li>

      {/* Location */}
      <li className="flex items-center gap-4 bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-md hover:shadow-lg transition" data-aos="fade-right" data-aos-delay="300">
        <div className="icon-circle flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Our Location</h4>
          <p className="text-gray-600 dark:text-gray-400">123 Event Ave, Suite 456, Mappr City, MC 90210</p>
        </div>
      </li>
    </ul>
  </div>

  {/* Right Form Column */}
  <div className="form-column bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md hover:shadow-lg transition" data-aos="fade-left">
    <ContactForm />
  </div>
</section>

        </main>
      </div>

      <style jsx global>{`
        /* Global & Reset Styles for both themes */
        html, body {
          padding: 0;
          margin: 0;
          font-family: 'Poppins', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
          background-color: #0f0f1a; /* Dark background */
          color: #ffffff;
          transition: background-color 0.5s ease, color 0.5s ease;
        }
        * {
          box-sizing: border-box;
        }
        h1, h2, h3, h4, h5, h6 {
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.5px;
          margin: 0 0 1rem;
        }
        p {
          line-height: 1.7;
          font-weight: 400;
          margin: 0 0 1.5rem;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
        }

        /* --- Dark Mode Styles - Global Scoped --- */
        html.dark-mode {
          background-color: #0f0f1a;
          color: #ffffff;
        }

        html.dark-mode .contact-page .hero-section {
          background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
        }
        html.dark-mode .hero-section:before {
          background: radial-gradient(circle at top right, rgba(90, 126, 255, 0.05), transparent 60%);
        }
        html.dark-mode .theme-toggle {
          color: rgba(255, 255, 255, 0.7);
        }
        html.dark-mode .theme-toggle:hover {
          color: #5a7eff;
        }
        html.dark-mode .hero-heading {
          color: white;
        }
        html.dark-mode .highlight {
          color: #5a7eff;
        }
        html.dark-mode .highlight:after {
          background: rgba(90, 126, 255, 0.2);
        }
        html.dark-mode .hero-subtitle {
          color: rgba(255, 255, 255, 0.8);
        }
        html.dark-mode .content-wrapper {
          background: #1a1a2e;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
        }
        html.dark-mode .info-column h2 {
          color: white;
        }
        html.dark-mode .section-subtitle, html.dark-mode .info-list p {
          color: rgba(255, 255, 255, 0.7);
        }
        html.dark-mode .icon-circle {
          background-color: rgba(90, 126, 255, 0.15);
          color: #5a7eff;
        }
        html.dark-mode .info-list h4 {
          color: white;
        }
        html.dark-mode .contact-form {
          background-color: #1a1a2e;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        html.dark-mode .contact-form label {
          color: rgba(255, 255, 255, 0.8);
        }
        html.dark-mode .contact-form input,
        html.dark-mode .contact-form textarea {
          background-color: #2b2b40;
          border-color: #3b3b50;
          color: white;
        }
        html.dark-mode .contact-form input:focus,
        html.dark-mode .contact-form textarea:focus {
          border-color: #5a7eff;
          box-shadow: 0 0 0 3px rgba(90, 126, 255, 0.2);
        }
        html.dark-mode .btn {
          background: linear-gradient(135deg, #5a7eff 0%, #4361ee 100%);
          box-shadow: 0 8px 25px rgba(90, 126, 255, 0.25);
        }
        html.dark-mode .btn:hover {
          box-shadow: 0 12px 35px rgba(90, 126, 255, 0.4);
        }
        html.dark-mode .btn-ghost {
          background: transparent;
          color: #5a7eff;
          border-color: #5a7eff;
        }

        html.dark-mode .btn-ghost:hover {
          background: #4c66f5;
          color: #ffffff;
          border-color : transparent
        }
      `}</style>

      <style jsx>{`
        .contact-page {
          min-height: 100vh;
          overflow: hidden;
          position: relative;
        }
        /* The hero section background is now handled globally */
        .hero-section {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 90vh;
          position: relative;
          background: linear-gradient(135deg, #f8f9ff 0%, #eef3ff 100%);
          overflow: hidden;
          padding: 8rem 0;
          transition: background 0.5s ease;
        }
        .hero-section:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at top right, rgba(76, 102, 245, 0.05), transparent 60%);
          pointer-events: none;
          transition: background 0.5s ease;
        }
        .theme-toggle {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #4a4a6a;
          transition: color 0.3s ease;
        }
        .theme-toggle:hover {
          color: #4c66f5;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          align-items: center;
          gap: 3rem;
        }
        .hero-content {
          max-width: 600px;
          position: relative;
          z-index: 10;
        }
        .hero-heading {
          font-size: 3.8rem;
          font-weight: 800;
          line-height: 1.1;
          color: #1a1a2e;
          margin-bottom: 1.2rem;
          transition: color 0.5s ease;
        }
        .highlight {
          color: #4c66f5;
          position: relative;
          display: inline-block;
          transition: color 0.5s ease;
        }
        .highlight:after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 10px;
          background: rgba(76, 102, 245, 0.2);
          z-index: -1;
          transform: skew(-15deg);
          transition: background 0.5s ease;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: #4a4a6a;
          max-width: 500px;
          margin-bottom: 2.5rem;
          transition: color 0.5s ease;
        }
        .hero-cta-group {
          display: flex;
          gap: 1.5rem;
        }
        .hero-visual {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          min-height: 360px;
        }
        .hero-gif-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: #b16cea;
          border-radius: 24px;
          border: 2px solid #e0e7ef;
          box-shadow: 0 8px 40px rgba(25, 118, 210, 0.13);
          min-width: 320px;
          min-height: 240px;
          font-size: 1.25rem;
          font-weight: 600;
          transition: background 0.4s, border-color 0.4s;
        }
        html.dark-mode .hero-gif-placeholder {
          background: #181c2a;
          color: #5a7eff;
          border: 2px solid #323353;
        }
        .featured-image {
          max-width: 600px;
          width: 100%;
          height: auto;
          position: relative;
          z-index: 2;
        }
        .hero-gif {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(25, 118, 210, 0.13);
          padding: 0.75rem;
          border: 2px solid #e0e7ef;
          transition: background 0.4s, border-color 0.4s;
        }
        html.dark-mode .hero-gif {
          background: #181c2a;
          border: 2px solid #323353;
        }
        .shape-1, .shape-2, .shape-3 {
          position: absolute;
          background: linear-gradient(45deg, #4c66f5, #3a0ca3);
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          z-index: 0;
        }
        .shape-1 { top: 20%; left: 10%; width: 100px; height: 100px; }
        .shape-2 { bottom: 10%; right: 5%; width: 150px; height: 150px; }
        .shape-3 { top: 50%; left: 45%; width: 80px; height: 80px; }
        
        /* --- Main Content Section --- */
        .content-wrapper {
          position: relative;
          z-index: 20;
          margin: 4rem auto 5rem;
          padding: 3rem;
          background: linear-gradient(135deg, #b5d0fce7, #ffffff);
          border-radius: 24px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
          transition: background 0.5s ease, box-shadow 0.5s ease;
        }
        .contact-section {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 4rem;
        }
        .info-column h2 {
          font-size: 2.5rem;
          color: #1a1a2e;
          margin-bottom: 0.5rem;
          transition: color 0.5s ease;
          text-align: center;
        }
        .section-subtitle {
          font-size: 0.9rem;
          color: #6a6a80;
          margin-bottom: 3rem;
          transition: color 0.5s ease;
        }
        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .info-list li {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
        }
        .icon-circle {
          background-color: rgba(76, 102, 245, 0.1);
          color: #4c66f5;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.5s ease, color 0.5s ease;
        }
        .info-list h4 {
          font-size: 1.1rem;
          margin: 0;
          color: #1a1a2e;
          transition: color 0.5s ease;
        }
        .info-list p {
          font-size: 1rem;
          color: #6a6a80;
          margin: 0;
          transition: color 0.5s ease;
        }
        /* --- Responsive Styles --- */
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 5rem 2rem 3rem;
            gap: 2rem;
          }
          .hero-content {
            max-width: 100%;
          }
          .hero-cta-group {
            justify-content: center;
          }
          .hero-visual {
            padding: 2rem 0 0;
            max-width: 600px;
          }
          .content-wrapper {
            margin: 3rem auto;
            padding: 2rem;
          }
          .contact-section {
            grid-template-columns: 1fr;
            padding: 1rem;
            gap: 3rem;
          }
          .info-column, .form-column {
            text-align: center;
          }
          .info-list {
            align-items: center;
          }
          .info-list li {
            flex-direction: column;
            text-align: center;
            align-items: center;
          }
        }
        @media (max-width: 768px) {
          .hero-heading {
            font-size: 2.5rem;
          }
          .hero-subtitle {
            font-size: 1.1rem;
          }
          .content-wrapper {
            padding: 2rem 1.5rem 3rem;
          }
          .hero-cta-group {
            flex-direction: column;
          }
          .btn {
            width: 100%;
          }
          .contact-section {
            gap: 2rem;
          }
          .info-column h2, .form-column h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
};


export default ContactPage;