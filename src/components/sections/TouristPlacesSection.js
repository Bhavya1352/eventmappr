"use client";

import { useState, useRef, useEffect } from "react";
import { FiLoader, FiAlertCircle, FiCompass, FiMapPin, FiExternalLink } from "react-icons/fi";
import dynamic from "next/dynamic";

const TouristPlacesMap = dynamic(() => import("./TouristPlacesMap"), { ssr: false });

export default function TouristPlacesSection() {
  const [loading, setLoading] = useState(false);
  const [attractions, setAttractions] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Click the button to find historical places near you.");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleFindAttractions = () => {
    setLoading(true);
    setError(null);
    setAttractions([]);
    setSelectedPlace(null);

    if (!navigator.geolocation) {
      setStatus("Geolocation not supported.");
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    setStatus("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = [latitude, longitude];
        setUserLocation(location);
        setStatus(`Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        fetchAttractions(latitude, longitude);
      },
      (err) => {
        setError("Unable to retrieve your location. Please enable location permissions.");
        setStatus("Location error: " + err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const fetchAttractions = async (lat, lon) => {
    const query = `[out:json][timeout:25];(node["historic"](around:5000,${lat},${lon}););out body;>;out skel qt;`;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) throw new Error(`Network response was not ok (${response.status})`);

      const data = await response.json();
      const formatted = data.elements
        .filter((e) => e.tags && e.tags.name)
        .map((e) => ({
          id: e.id,
          name: e.tags.name,
          position: [e.lat, e.lon],
          type: e.tags.historic || "Historic Site",
          description: e.tags.description || e.tags.wikipedia || null,
          website: e.tags.website || null,
          address: e.tags["addr:street"] || null,
        }))
        .slice(0, 20); // Increased to 20 results

      setAttractions(formatted);
      setStatus(formatted.length > 0 ? `Found ${formatted.length} historical places` : "No historical places found within 5km.");
    } catch (err) {
      setError("Failed to fetch attractions. The service might be temporarily unavailable.");
      setStatus("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Animation state for header
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef(null);
  useEffect(() => {
    // Animate top heading on scroll
    const animateHeading = () => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const screenPosition = window.innerHeight / 1.3;
      if (rect.top < screenPosition) {
        headerRef.current.classList.add('animate');
      }
    };
    window.addEventListener('scroll', animateHeading);
    animateHeading(); // Initial check

    // Enhanced scroll-based animations with staggered effects
    const animateOnScroll = () => {
      const elementsToAnimate = [
        { selector: '.tourist-places-container', threshold: 1.3 },
        { selector: '.tp-sidebar', threshold: 1.3 },
        { selector: '.tp-list-grid', threshold: 1.3 },
        { selector: '.tp-list-card', threshold: 1.3 }
      ];

      elementsToAnimate.forEach(element => {
        const els = document.querySelectorAll(element.selector);
        els.forEach((el, index) => {
          const elementPosition = el.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / element.threshold;

          if (elementPosition < screenPosition) {
            // Add staggered delay for list items
            const delay = element.selector === '.tp-list-card' ? index * 100 : 0;
            setTimeout(() => {
              el.classList.add('animate');
            }, delay);
          }
        });
      });
    };

    // Add a small delay before adding scroll listener to ensure content is visible
    setTimeout(() => {
      window.addEventListener('scroll', animateOnScroll, { passive: true });
      animateOnScroll(); // Run once on load
    }, 200);

    return () => {
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);

  return (
    <div className="main-content font-sans bg-white overflow-x-hidden" style={{ position: 'relative' }}>
      {/* Video background for header */}
      <style jsx>{`
        .main-content {
          min-height: 100vh;
          display: flex;
          background: #f8fafc;
          min-weight: 100vh;
          flex-direction: column;
          alignItems: center;
          justifyContent: center;
        }

        .tourist-places-container {
          display: flex;
          flex-wrap: wrap;
          max-width: 100%;
          margin: 0 auto; /* optional centering */
          
          justifyContent: center;
          alignItems: center;
          padding: 2rem;
          background: #f8fafc;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tourist-places-container.animate {
          opacity: 1;
          transform: translateY(0);
        }

        .tp-sidebar {
    height: 100%;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .list-places {
    flex: 1;
    overflow-y: auto;
    width: 500px;
    padding: 16px;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }

  .list-places::-webkit-scrollbar {
    width: 0px;
  }

  .list-places::-webkit-scrollbar-track {
    background: transparent;
  }

  .list-places::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 3px;
  }

  .list-places::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
  }

  .tp-list-grid {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .tp-list-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    background: linear-gradient(135deg, #f8fafc 0%, #e0ecff 100%);
    border: 1px solid #e2e8f0;
    border-left: 4px solid #60a5fa;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(96, 165, 250, 0.08);
    position: relative;
    overflow: hidden;
  }

  .tp-list-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(96, 165, 250, 0.02) 0%, rgba(59, 130, 246, 0.04) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tp-list-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(96, 165, 250, 0.15);
    border-left-color: #3b82f6;
  }

  .tp-list-card:hover::before {
    opacity: 1;
  }

  .tp-list-card.selected {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-left-color: #2563eb;
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.2);
    transform: translateY(-1px);
  }

  .tp-list-card.selected::before {
    opacity: 1;
    background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(59, 130, 246, 0.08) 100%);
  }

  .place-map-container {
    position: relative;
    flex: 0 0 70px;
    width: 70px;
    height: 70px;
    border-radius: 10px;
    overflow: hidden;
    background: #f1f5f9;
    border: 2px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
  }

  .tp-list-card:hover .place-map-container {
    border-color: #60a5fa;
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
  }

  .place-map-container iframe {
    border: 0;
    width: 100%;
    height: 100%;
    display: block;
    border-radius: 8px;
  }

  .map-pin-icon {
    position: absolute;
    bottom: 6px;
    right: 6px;
    color: #2563eb;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
  }

  .tp-list-card:hover .map-pin-icon {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
  }

  .place-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .place-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

  }
    .btn-near-me {
    padding: 0.5rem 1.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
      }

  .place-title {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  .place-type-badge {
    color: #2563eb;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 8px;
    text-transform: capitalize;
    white-space: nowrap;
    
    transition: all 0.3s ease;
  }

  .tp-list-card:hover .place-type-badge {
    background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
    border-color: #a5b4fc;
  }

  .place-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px;
  }

  .directions-link {
    color: #2563eb;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 0.875rem;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-weight: 500;
    gap: 6px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
  }

  .directions-link:hover {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-color: #93c5fd;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }

  .directions-link:active {
    transform: translateY(0);
  }

  /* Add map area styles */
  .tp-map-area {
    flex: 1;
    min-height: 600px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: 0.2s;
  }

  .tp-map-area.animate {
    opacity: 1;
    transform: translateY(0);
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .tourist-places-container {
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
    }
    
    .tp-sidebar {
      width: 100%;
      max-width: 500px;
      margin-bottom: 2rem;
    }
      .list-places{
      width: 100%;
      }
    
    .tp-map-area {
      width: 100%;
      max-width: 800px;
    }
  }
@media (max-width: 768px) {
  .tp-sidebar,
  .tp-map-area {
    width: 100% !important;
    max-width: 100% !important;
    flex: 1 1 100%;
  }
}
    
    .list-places {
      padding: 12px;
    }
    
    .tp-list-grid {
      gap: 10px;
    }
    
    .tp-list-card {
      padding: 10px;
      gap: 12px;
    }
    
    .place-map-container {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;
    }
    
    .place-title {
      font-size: 1rem;
    }
    
    .place-type-badge {
      font-size: 0.7rem;
      padding: 2px 6px;
    }
    
    .directions-link {
      font-size: 0.8rem;
      padding: 5px 8px;
    }
  }

  @media (max-width: 480px) {
    .tp-list-card {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    
    .place-map-container {
      align-self: center;
    }
    
    .place-info {
      width: 100%;
    }
    
    .place-header {
      justify-content: space-between;
    }
    
    .place-title {
      white-space: normal;
      overflow: visible;
      text-overflow: unset;
    }
  }

  /* Loading and Empty States */
  .loading-state,
  .empty-state {
    padding: 24px 16px;
    text-align: center;
    color: #64748b;
    font-size: 0.9rem;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 12px;
    border: 1px dashed #cbd5e1;
    margin: 12px 0;
  }

  /* Error State Styles */
  .error-alert {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    border: 1px solid #fecaca;
    border-left: 4px solid #ef4444;
      `}</style>
      <div style={{ position: 'relative', width: '100%', minHeight: '390px' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(0.6)'
          }}
        >
          <source src="https://videos.pexels.com/video-files/5243307/5243307-hd_1280_720_25fps.mp4" type="video/mp4" />
        </video>
        {/* Overlayed header content */}
        <div
          ref={headerRef}
          className="tp-heading"
          style={{
            maxWidth: '700px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '56px 0 40px 0',
            marginTop: '90px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <div style={{ background: 'rgba(30, 41, 59, 0.82)', borderRadius: 24, padding: '38px 32px 32px 32px', boxShadow: '0 8px 32px 0 rgba(30,41,59,0.22)', textAlign: 'center', width: '100%', maxWidth: 600 }}>
            <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: '-1px', textShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>Historical Places Explorer</h1>
            <p style={{ color: '#e0e7ef', fontSize: '1.18rem', marginBottom: 28, textAlign: 'center', maxWidth: 500, textShadow: '0 1px 8px rgba(0,0,0,0.13)' }}>
              Find and explore historical places near you. Click on a place to see it on the map.
            </p>
            <button
              onClick={handleFindAttractions}
              disabled={loading}
              className="btn-near-me w-full bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors hover:bg-blue-700 disabled:bg-slate-400"
              style={{ marginBottom: 0, maxWidth: 260, boxShadow: '0 2px 12px 0 rgba(56,189,248,0.13)', marginLeft: 'auto', marginRight: 'auto' }}
            >
              {loading ? <FiLoader className="animate-spin" /> : <FiCompass />}
              <span>{loading ? 'Searching...' : 'Find Places Near Me'}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="tourist-places-container flex flex-wrap max-w-full">
        {/* Sidebar */}
        <aside className="tp-sidebar">
          {error && (
            <div className="p-3 mb-3 bg-red-100 text-red-700 text-sm flex items-center gap-2 rounded error-alert">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <div className="list-places">
            {loading && attractions.length === 0 && (
              <div className="loading-state">Loading nearby places...</div>
            )}
            {!loading && attractions.length === 0 && !error && (
              <div className="empty-state">No places found. Try searching!</div>
            )}

            <ul className="tp-list-grid">
              {attractions.map((place) => (
                <li key={place.id}>
                  <div
                    className={`tp-list-card${selectedPlace?.id === place.id ? ' selected' : ''}`}
                    onClick={() => setSelectedPlace(place)}
                  >
                    <div className="place-map-container">
                      <iframe
                        title={place.name}
                        width="70"
                        height="70"
                        frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.position[1] - 0.005}%2C${place.position[0] - 0.005}%2C${place.position[1] + 0.005}%2C${place.position[0] + 0.005}&layer=mapnik&marker=${place.position[0]}%2C${place.position[1]}`}
                        allowFullScreen=""
                        loading="lazy"
                      />
                      <span className="map-pin-icon">
                        <FiMapPin size={18} />
                      </span>
                    </div>
                    <div className="place-info">
                      <div className="place-header">
                        <h3 className="place-title">{place.name}</h3>
                        <span className="place-type-badge">
                          {place.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="place-actions">
                        <a
                          className="directions-link"
                          href={`https://www.google.com/maps/search/?api=1&query=${place.position[0]},${place.position[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FiExternalLink size={15} />
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="tp-map-area">
          <TouristPlacesMap
            attractions={attractions}
            userLocation={userLocation}
            selectedPlace={selectedPlace}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>
    </div>
  );
}
