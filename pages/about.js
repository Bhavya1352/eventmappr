import React, { useEffect, useState, useState } from "react";
import Head from "next/head";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  MapPin,
  Navigation,
  Filter,
  Save,
  Smartphone,
  FileText,
  Map,
  Cloud,
  Camera,
  RotateCcw,
  Moon,
  Sun,
} from "lucide-react";

  const features = [
    { icon: <MapPin size={28} />, label: "Add to Map – Drop a pin, add title, date & more" },
    { icon: <Navigation size={28} />, label: "Find Nearby – Use Geolocation API" },
    { icon: <Filter size={28} />, label: "Filter by Category – Music, Tech, Volunteering..." },
    { icon: <Save size={28} />, label: "Persistent Storage – localStorage support" },
    { icon: <Smartphone size={28} />, label: "Interactive UI – Popups, animations, responsive" },
    { icon: <FileText size={28} />, label: "NEW: Detailed Event Pages" },
    { icon: <Map size={28} />, label: "NEW: Mini Maps on Event Detail" },
    {
      icon: <Cloud size={28} />,
      label: "NEW: Weather Planner (5-day forecast)",
    },
    {
      icon: <Camera size={28} />,
      label: "NEW: Event Gallery – user shared photos",
    },
    {
      icon: <RotateCcw size={28} />,
      label: "NEW: Modular Routing with Next.js",
    },
  ];

  // Main About Page Component
  const AboutPage = () => {
    const [heroGifError, setHeroGifError] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
  
    useEffect(() => {
      // Check localStorage for theme first
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
      // Persist theme to localStorage
      if (isDarkMode) {
        localStorage.setItem('theme', 'dark');
      } else {
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
        <title>About Us | EventMappr</title>
        <meta name="description" content="Learn more about EventMappr's mission and features." />
      </Head>

      {/* Theme variables (GLOBAL) */}
      <style jsx global>{`
        :root {
          color-scheme: light;
          --page-grad-1: #fafbff;
          --page-grad-2: #f1f5ff;

          --headline-grad-start: #1e293b;
          --headline-grad-end: #3b82f6;

          --text: #111827;
          --heading: #1f2937;
          --muted: #64748b;

          --surface: #ffffff;
          --surface-2: #f8fafc;

          --card-bg: #ffffff;
          --card-border: #e2e8f0;

          --icon-bg-start: #dbeafe;
          --icon-bg-end: #eff6ff;

          --accent: #3b82f6;
          --accent-2: #8b5cf6;

          --shadow: rgba(59, 130, 246, 0.1);
        }

        html.dark {
          color-scheme: dark;
          --page-grad-1: #0f172a;
          --page-grad-2: #1e293b;

          --headline-grad-start: #f8fafc;
          --headline-grad-end: #60a5fa;

          --text: #e5e7eb;
          --heading: #f1f5f9;
          --muted: #cbd5e1;

          --surface: #1e293b;
          --surface-2: #0f172a;

          --card-bg: #334155;
          --card-border: #475569;

          --icon-bg-start: #1f2937;
          --icon-bg-end: #0f172a;

          --accent: #60a5fa;
          --accent-2: #a78bfa;

          --shadow: rgba(2, 6, 23, 0.45);
        }
      `}</style>

      <div className={`about-page${isDarkMode ? " dark" : ""}`}>
       
        <section className="hero-section" data-aos="fade-down">
          <div className="hero-content">
            <h1 data-aos="fade-up" data-aos-delay="300">About EventMappr</h1>
            <p data-aos="fade-up" data-aos-delay="400">
              EventMappr is a lightweight, open-source community event mapping web app. Users can
              discover, add, and explore local events pinned on an interactive map. It's a
              user-friendly frontend tool for discovering and cataloging community happenings.
            </p>
            <div className="hero-stats" data-aos="fade-up" data-aos-delay="500">
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Features</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Open Source</span>
              </div>
              <div className="stat">
                <span className="stat-number">MIT</span>
                <span className="stat-label">License</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section">
          <div className="features-container">
            <div className="section-header" data-aos="fade-up">
              <h2>✨ Powerful Features</h2>
              <p>Everything you need to discover and share local events</p>
            </div>

            <div className="features-grid">
              {features.map((item, idx) => (
                <div className="feature-card" key={idx} data-aos="fade-up" data-aos-delay={idx * 80}>
                  <div className="feature-icon">{item.icon}</div>
                  <p className="feature-text">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="stats-section" data-aos="fade-up">
          <div className="stats-container">
            <h3>Project Stats</h3>
            <div className="badges-grid">
              <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
              <img src="https://img.shields.io/github/stars/Bhavya1352/eventmappr?style=social" alt="GitHub stars" />
              <img src="https://img.shields.io/github/forks/Bhavya1352/eventmappr?style=social" alt="GitHub forks" />
              <img src="https://img.shields.io/github/issues/Bhavya1352/eventmappr" alt="GitHub issues" />
              <img src="https://img.shields.io/github/contributors/Bhavya1352/eventmappr?color=green" alt="Contributors" />
            </div>
          </div>
        </section>
      </div>
    
      <style jsx global>{`
        .about-page {
      {/* Removed global style block for maintainability. Use only scoped <style jsx> below. */}
        .about-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #fafbff 0%, #f1f5ff 100%);
        }

        .about-page.dark {
          background: linear-gradient(180deg, #1e293b 0%, #3b82f6 100%);
        }

        /* Hero Section */
        .hero-section {
          padding: 6rem 2rem 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-section::before {
          content: '';
          position: absolute;
          inset: 0 0 auto 0;
          height: 100%;
          background: radial-gradient(ellipse 800px 600px at 50% -20%, rgba(59, 130, 246, 0.10) 0%, transparent 55%);
          pointer-events: none;
        }
        .hero-content { max-width: 800px; margin: 0 auto; position: relative; z-index: 2; }

        .hero-section h1 {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin: 0 0 1.5rem;
          background: linear-gradient(135deg, var(--headline-grad-start) 0%, var(--headline-grad-end) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .about-page .hero-section p {
          font-size: 1.25rem;
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 3rem;
        }
        .about-page.dark .hero-section p {
          color: #fff;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 0.25rem;
        }

        .about-page .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }
        

        /* Features Section */
        .about-page. .features-section {
          padding: 4rem 2rem;
          background: white;
          position: relative;
        }
        .about-page.dark .features-section {
          background: #1e293b;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .about-page.dark .features-section .features-container .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }
        .about-page.dark .section-header h2 {
          color: #93c5fd;
        }

        .about-page .section-header p {
          font-size: 1.125rem;
          color: #64748b;
        }
        .about-page.dark .section-header p {
          color: #fff;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px var(--shadow);
          border-color: var(--accent);
        }
        .feature-card:hover::before { transform: translateX(0); }

        .feature-icon {
          display: flex; align-items: center; justify-content: center;
          width: 56px; height: 56px;
          background: linear-gradient(135deg, var(--icon-bg-start), var(--icon-bg-end));
          border-radius: 12px; margin-bottom: 1rem; color: var(--accent);
          transition: all 0.3s ease;
        }
        .feature-card:hover .feature-icon {
          background: linear-gradient(135deg, var(--accent), #2563eb);
          color: #fff; transform: scale(1.05);
        }
        

        .feature-text {
          font-size: 1rem;
          color: #374151;
          line-height: 1.6;
          margin: 0;
          font-weight: 500;
        }
    


        /* Stats Section */
        .about-page .stats-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        
        .about-page.dark .stats-section {
          background: #1e293b;
        }

        .stats-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }
        

        .stats-section h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .badges-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; }
        .badges-grid img { height: 32px; border-radius: 6px; transition: transform 0.2s ease; }
        .badges-grid img:hover { transform: translateY(-2px); }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-section h1 { font-size: 2.5rem; }
          .hero-section p { font-size: 1.125rem; }
          .hero-stats { gap: 2rem; }
          .features-grid { grid-template-columns: 1fr; }
          .feature-card { padding: 1.5rem; }
          .section-header h2 { font-size: 2rem; }
        }
        @media (max-width: 480px) {
          .hero-section { padding: 4rem 1rem 3rem; }
          .hero-section h1 { font-size: 2rem; }
          .features-section { padding: 3rem 1rem; }
          .stats-section { padding: 3rem 1rem; }
        }
      `}</style>
    </>
  );
};
export default AboutPage;