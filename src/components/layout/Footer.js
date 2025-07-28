import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 px-4 py-6 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 flex-wrap">
        
        {/* Logo */}
        <div className="flex items-center gap-2 text-lg font-bold text-blue-500">
          <i className="fas fa-map-marker-alt"></i>
          <span>EventMappr</span>
        </div>

        {/* Links */}
        <div className="footer-links flex flex-wrap gap-4 md:justify-start text-sm">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/community">Community Forum</Link>
          <Link to="/gallery" className="flex items-center">
            <i className="fas fa-camera mr-1 text-sky-400"></i> Gallery
          </Link>
          <Link to="/weather" className="flex items-center">
            <i className="fas fa-calendar-alt mr-1 text-yellow-400"></i> Weather Planner
          </Link>
        </div>

        {/* Social Links */}
        <div className="social-links flex gap-3">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-github text-xl"></i></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter text-xl"></i></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-6 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} EventMappr. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
