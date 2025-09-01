import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NAV_ITEMS, ROUTES } from "../../utils/routes";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    if (!localStorage.getItem("theme")) localStorage.setItem("theme", "dark");

    // Check for saved theme preference
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        setIsDarkMode(true);
        document.documentElement.setAttribute("data-theme", "dark");
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      } else {
        setIsDarkMode(false);
        document.documentElement.setAttribute("data-theme", "light");
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      }
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Initial scroll position check
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    // Ensure navbar is visible by forcing a reflow
    const navbarElement = document.querySelector(".navbar");
    if (navbarElement) {
      // Force a reflow
      void navbarElement.offsetHeight;

      // Add a class to ensure visibility
      navbarElement.classList.add("navbar-visible");
    }

    // Check if Firebase is initialized
    try {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
        unsubscribe();
      };
    } catch (error) {
      console.error("Firebase auth not initialized yet");
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    
    // Set both data-theme attribute and classList for compatibility
    document.documentElement.setAttribute("data-theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    
    localStorage.setItem("theme", newTheme);
  };

  const handleSignIn = () => {
    router.push(ROUTES.AUTH);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  // Don't render until after client-side hydration
  if (!mounted) {
    return null;
  }

  return (
    <nav
      className={`navbar ${isScrolled ? "scrolled" : ""} ${isDarkMode ? "dark" : ""
        }`}
    >
      <div className="navbar-blur"></div>
      <div className="container navbar-container">
        <Link href={ROUTES.HOME} legacyBehavior>
          <a href="/" className="logo">
            <img
              src={isDarkMode ? "/loggd.svg" : "/logg.svg"}
              alt="EventMappr Logo"
              className="logo-image"
            />
          </a>
        </Link>

        <div
          className={`mobile-toggle ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          {NAV_ITEMS.map((item, index) => (
            <li key={index}>
              <Link href={item.path} legacyBehavior>
                <a className={router.pathname === item.path ? "active" : ""}>
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/currency-converter" legacyBehavior>
              <a
                className={
                  router.pathname === "/currency-converter" ? "active" : ""
                }
              >
                <i className="fas fa-coins" />
                Currency Converter
              </a>
            </Link>
          </li>
          <li>
            <Link href="/nearby" legacyBehavior>
              <a className={router.pathname === "/nearby" ? "active" : ""}>
                Nearby
              </a>
            </Link>
          </li>
          <li className="theme-toggle">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="theme-btn"
            >
              {isDarkMode ? (
                <Sun size={20} color="#fbbf24" /> // light yellow
              ) : (
                <Moon size={20} color="#1e3a8a" /> // dark blue
              )}
            </button>
          </li>
          {user ? (
            <>
              <li className="profile-link">
                <Link href={ROUTES.PROFILE} legacyBehavior>
                  <a
                    className={
                      router.pathname === ROUTES.PROFILE ? "active" : ""
                    }
                  >
                    Profile
                  </a>
                </Link>
              </li>
              <li>
                <button onClick={handleSignOut} className="btn-sign-out">
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li className="auth-link">
              <button onClick={handleSignIn} className="btn-sign-in">
                <span className="btn-text">Sign In</span>
                <span className="btn-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                </span>
              </button>
            </li>
          )}
        </ul>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: auto;
          min-height: 70px;
          z-index: 1000;
          padding: 1rem 0;
          transition: all 0.3s ease;
          will-change: transform;
          opacity: 1;
          visibility: visible;
        }

        .navbar-blur {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          background: ${isDarkMode
          ? "linear-gradient(to bottom, rgba(18, 18, 24, 0.75), rgba(18, 18, 24, 0.65))"
          : "linear-gradient(to bottom, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.65))"};
          border-bottom: 1px solid
            ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
          z-index: -1;
        }

        .navbar.scrolled {
          padding: 0.75rem 0;
          min-height: 60px;
        }

        .navbar.scrolled .navbar-blur {
          box-shadow: 0 4px 30px
            ${isDarkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)"};
          background: ${isDarkMode
          ? "linear-gradient(to bottom, rgba(18, 18, 24, 0.85), rgba(18, 18, 24, 0.8))"
          : "linear-gradient(to bottom, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.8))"};
        }

        .navbar-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          height: 100%;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content:flex-start;
          cursor: pointer;
          position: relative;
          z-index: 2;
          text-decoration: none;
          padding: 0.5rem 0;
          margin-left: -1rem;
        }

     .logo-image {
          height: 32px;
          width: auto;
          max-width: 200px;
          transition: transform 0.3s ease;
          display: block;
       }             
        .logo:hover .logo-image {
          transform: scale(1.05);
        }

        .nav-links {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          position: relative;
          z-index: 2;
          gap: 0;
        }

        .nav-links li {
          margin: 0;
          padding: 0 1rem;
          position: relative;
        }

        .nav-links li:first-child {
          padding-left: 0;
        }

        .nav-links li:last-child {
          padding-right: 0;
        }

        .nav-links li a {
          color: var(--text);
          font-weight: 500;
          transition: all 0.2s ease;
          padding: 0.75rem 0.5rem;
          position: relative;
          text-decoration: none;
          display: flex;
          align-items: center;
          white-space: nowrap;
          border-radius: 6px;
        }

        .nav-links li a i {
          margin-right: 0.5rem;
          font-size: 0.9em;
        }

        .nav-links li a::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(
            to right,
            var(--primary),
            var(--primary-light)
          );
          transition: all 0.3s ease;
          border-radius: 2px;
          transform: translateX(-50%);
        }

        .nav-links li a:hover,
        .nav-links li a.active {
          color: var(--primary);
          background-color: ${isDarkMode
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0, 0, 0, 0.03)"};
        }

        .nav-links li a:hover::after,
        .nav-links li a.active::after {
          width: 80%;
        }

        .navbar.dark .nav-links li a {
          color: #fff;
        }

        .navbar.dark .nav-links li a:hover,
        .navbar.dark .nav-links li a.active {
          color: var(--primary-light);
        }

        .theme-toggle {
          display: flex;
          align-items: center;
          margin: 0 0.5rem;
        }

        .theme-btn {
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          background-color: ${isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)"};
          width: 40px;
          height: 40px;
        }

        .theme-btn:hover {
          transform: rotate(15deg) scale(1.1);
          background-color: ${isDarkMode
          ? "rgba(255, 255, 255, 0.2)"
          : "rgba(0, 0, 0, 0.1)"};
        }

        .btn-sign-in {
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          background: linear-gradient(
            135deg,
            var(--primary),
            var(--primary-dark)
          );
          color: white;
          padding: 0.6rem 1.5rem;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          margin-left: 0.5rem;
        }

        .btn-sign-in::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0) 50%
          );
          transform: translateX(-100%) rotate(45deg);
          transition: transform 0.6s ease;
        }

        .btn-sign-in:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(var(--primary-rgb), 0.4);
        }

        .btn-sign-in:hover::before {
          transform: translateX(100%) rotate(45deg);
        }

        .btn-text {
          margin-right: 0.5rem;
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .btn-sign-in:hover .btn-icon {
          transform: translateX(2px);
        }

        .btn-sign-out {
          background: none;
          border: 1px solid
            ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"};
          color: var(--text);
          padding: 0.6rem 1.5rem;
          border-radius: 25px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          margin-left: 0.5rem;
        }

        .navbar.dark .btn-sign-out {
          color: #fff;
        }

        .btn-sign-out:hover {
          background-color: ${isDarkMode
          ? "rgba(255, 255, 255, 0.1)"
          : "rgba(0, 0, 0, 0.05)"};
          transform: translateY(-1px);
        }

        .mobile-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 28px;
          height: 20px;
          cursor: pointer;
          z-index: 10;
          padding: 0.25rem;
        }

        .mobile-toggle span {
          display: block;
          width: 100%;
          height: 3px;
          background-color: var(--text);
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        .navbar.dark .mobile-toggle span {
          background-color: #fff;
        }

        @media (max-width: 1024px) {
          .navbar-container {
            padding: 0 1.5rem;
          }

          .nav-links li {
            padding: 0 0.75rem;
          }
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 1rem;
          }

          .mobile-toggle {
            display: flex;
          }

          .nav-links {
            position: fixed;
            top: 0;
            right: -100%;
            width: 85%;
            max-width: 320px;
            height: 100vh;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            background: ${isDarkMode
          ? "rgba(18, 18, 24, 0.95)"
          : "rgba(255, 255, 255, 0.95)"};
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 6rem 2rem 2rem 2rem;
            transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15);
            gap: 0.5rem;
          }

          .nav-links.active {
            right: 0;
          }

          .nav-links li {
            margin: 0;
            padding: 0;
            width: 100%;
          }

          .nav-links li a {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 1rem 1.5rem;
            width: 100%;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 500;
          }

          .nav-links li a::after {
            display: none;
          }

          .theme-toggle {
            margin: 1rem 0;
            justify-content: center;
          }

          .theme-btn {
            width: 50px;
            height: 50px;
            font-size: 1.3rem;
          }

          .btn-sign-in,
          .btn-sign-out {
            width: 100%;
            margin: 1rem 0 0 0;
            justify-content: center;
            padding: 1rem 1.5rem;
            font-size: 1rem;
          }

          .mobile-toggle.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
          }

          .mobile-toggle.active span:nth-child(2) {
            opacity: 0;
            transform: translateX(20px);
          }

          .mobile-toggle.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
          }
        }

        @media (max-width: 480px) {
          .navbar-container {
            padding: 0 1rem;
          }

          .logo-image {
            max-width: 150px;
            height: 28px;
          }

          .nav-links {
            width: 90%;
            padding: 5rem 1.5rem 2rem 1.5rem;
          }

          .nav-links li a {
            padding: 0.75rem 1rem;
            font-size: 0.95rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
