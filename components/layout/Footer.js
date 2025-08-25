import React from 'react';
import Link from 'next/link';
import { FOOTER_NAV_ITEMS } from '../../utils/routes';
import { useState, useEffect } from 'react';


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
        <div className="footer-top">
          <div className="logo-section">
            <h3 className="logo-title">
              <img src={isDarkMode ? '/loggd.svg' : '/loggd.svg'} alt="EventMappr Logo" className="logo" />
            </h3>
            <p className="description">
              Your hub for finding and sharing local events.
            </p>
          </div>
          <div className="links-section">
            <div className="nav-group">
              <h4 className="link-title">Site Map</h4>
              <ul className="link-list">
                {FOOTER_NAV_ITEMS.map((item, index) => (
                  <li key={index} className="footer-link">
                    <Link href={item.path}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav-and-social-group">
              <div className="nav-group">
                <h4 className="link-title">Legal</h4>
                <ul className="link-list">
                  <li className="footer-link">
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                  <li className="footer-link">
                    <Link href="/terms">Terms of Service</Link>
                  </li>
                  <li className="footer-link">
                    <Link href="/cookies">Cookie Policy</Link>
                  </li>
                </ul>
              </div>
              <div className="social-group">
                <h4 className="link-title">Connect</h4>
                <div className="social-links">
                  <a href="https://twitter.com/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="X">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1227" width="20" height="20" fill="currentColor">
                      <path d="M1134 0L703 509l497 718H785l-321-468L126 1227H0l454-542L0 0h427l290 423L949 0h185z" />
                    </svg>
                  </a>
                  <a href="https://facebook.com/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>

                  {/* adding a new instagram logo with smooth animations, hover changes color to pink and slightly darker */}
                  <a href="https://instagram.com/eventmappr"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram">
                    <svg className="size-6 text-pink-500 hover:text-pink-600 transition-colors"
                      xmlns="http://www.w3.org/2000/svg"
                      width="1.2em" height="1.2em"
                      viewBox="0 0 24 24">
                      <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                    </svg>
                  </a>
                  <a href="https://github.com/Bhavya1352/eventmappr" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} EventMappr. All rights reserved.</p>
          <p>Made with ❤️ for local communities</p>
        </div>
      </div>

      <style jsx>{`
      
        .footer-link {
            position: relative;
            color: #f6f4f3ff; 
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .footer-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px; /* thickness of the underline */
            bottom: 0;
            left: 0;
            background-color: #d2691e; /* same as text color */
            transition: width 0.3s ease;
          }

          .footer-link:hover {
            color: #b85c1b; /* optional: change text color on hover */
          }

          .footer-link:hover::after {
            width: 100%;
          }

        .footer {
          background-color: #0d1117;
          color: #e6e6e6;
          padding: 4rem 0 2rem;
          margin-top: 5rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          padding-bottom: 3rem;
          border-bottom: 1px solid #2e343d;
          margin-bottom: 2rem;
        }

        .logo-section {
          flex-basis: 30%;
          min-width: 200px;
        }

        .logo {
          width: 200px;
          height: auto;
          margin-bottom: 1rem;
        }
          .logo {
  filter: brightness(0) invert(1);
}


        .description {
          font-size: 0.9rem;
          color: #9ca3af;
          line-height: 1.6;
        }

        .links-section {
          display: flex;
          gap: 4rem;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .nav-and-social-group {
          display: flex;
          gap: 4rem;
        }

        .link-title {
          font-size: 1.1rem;
          color: #ffffff;
          margin-bottom: 1.25rem;
          font-weight: 600;
          position: relative;
        }
        
        .link-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 30px;
          height: 2px;
          background-color: #6366f1;
        }

        .link-list {
          list-style: none;
          padding: 0;
        }

        .link-list li {
          margin-bottom: 0.75rem;
        }

        .link-list a, .social-links a {
          color: #9ca3af;
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .link-list a:hover {
          color: #ffffff;
          transform: translateX(5px);
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #4b5563;
          background-color: transparent;
          color: #e6e6e6;
        }

        .social-links a:hover {
          background-color: #6366f1;
          border-color: #6366f1;
          color: #fff;
          transform: translateY(-3px) scale(1.1);
        }
        
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .logo-section, .links-section {
            margin-bottom: 2rem;
          }

          .links-section {
            flex-direction: column;
            gap: 2rem;
            align-items: center;
          }

          .nav-and-social-group {
            flex-direction: column;
            gap: 2rem;
          }

          .link-title::after {
            left: 50%;
            transform: translateX(-50%);
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          
        }
      `}</style>
    </footer>
  );
};

export default Footer;