import '../styles/globals.css';
import 'aos/dist/aos.css';
import { useEffect, useState } from 'react';
import { initializeFirebase } from '../utils/firebase';
import AOS from 'aos'; // Import the AOS library
import Layout from '../components/layout/Layout';

import Cursor from '../components/Cursor';
function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initializeFirebase();

    // Initialize AOS here
    AOS.init({
      once: false, // This is key! Ensures animations re-run every time they enter the viewport
      duration: 800, // Animation duration
      offset: 50,    // Offset (in px) from the bottom of the window
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use dark theme if user prefers dark mode
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    
    // Listen for changes in system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      // Only apply if user hasn't manually set a preference
      if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
      <Cursor/>
    </Layout>
  );
}

export default MyApp;