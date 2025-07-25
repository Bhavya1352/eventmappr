import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FOOTER_NAV_ITEMS } from '../../utils/routes';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }, []);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Branding */}
          <div className="footer-section">
            <h3 className="footer-title">
              <img
                src={isDarkMode ? '/loggd.svg' : '/logg.svg'}
                alt="EventMappr Logo"
                className="h-8 w-auto"
                style={{ width: '200px' }}
              />
            </h3>
            <p className="footer-description">
              Discover and share local events happening in your community. EventMappr helps you find and connect with events near you.
            </p>
          </div>

          {/* Site Map */}
          
          <div className="footer-section">
            <h3 className="footer-title">Site Map</h3>
            <ul className="footer-links">
              {FOOTER_NAV_ITEMS.map((item, index) => (
                <li key={index}>
                  <Link href={item.path} legacyBehavior>
                    <a>{item.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3 className="footer-title">Legal</h3>
            <ul className="footer-links">
              <li><Link href="/privacy" legacyBehavior><a>Privacy Policy</a></Link></li>
              <li><Link href="/terms" legacyBehavior><a>Terms of Service</a></Link></li>
              <li><Link href="/cookies" legacyBehavior><a>Cookie Policy</a></Link></li>
            </ul>
          </div>
        

          {/* Connect */}
          <div className="footer-section">
            <h3 className="footer-title">Connect</h3>
            <div className="social-links">
              <a href="https://twitter.com/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" width="24" height="24" fill="currentColor">
                  <path d="M1134 0L703 509l497 718H785l-321-468L126 1227H0l454-542L0 0h427l290 423L949 0h185z" />
                </svg>
              </a>

              <a href="https://facebook.com/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a href="https://instagram.com/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                </svg>
              </a>

              <a href="https://github.com/Bhavya1352/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} EventMappr. All rights reserved.</p>
          <p>Made with ❤️ for local communities</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--background-alt);
          padding: 3rem 0 1.5rem;
          margin-top: 3rem;
        }

        .footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem 2rem;
  margin-bottom: 2rem;
}

        .footer-section {
          display: flex;
          flex-direction: column;
        }

        .footer-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          position: relative;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0;
          width: 40px;
          height: 2px;
          background-color: var(--primary);
        }

        .footer-description {
          font-size: 0.9rem;
          color: var(--text-light);
          margin-top: 0.75rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 0.65rem;
        }

        .footer-links a {
          color: var(--text-light);
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--primary);
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: var(--background);
          color: var(--text-light);
          transition: all 0.2s ease;
        }

        .social-links a:hover {
          background-color: var(--primary);
          color: #fff;
        }

        .footer-bottom {
          padding-top: 1.5rem;
          border-top: 1px solid var(--border);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-light);
        }

        @media (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .footer-bottom {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
}


      `}
      </style>
    </footer>
  );
};

export default Footer;
