import React, { useState, useEffect, useCallback, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';
import Navbar from '../components/layout/Navbar';


export default function NearbyPage() {
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [isThemeDark, setIsThemeDark] = useState(false);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const radius = 2000;
  const initMap = useCallback(async (lat, lon, label = 'Selected Location') => {
    const L = (await import('leaflet')).default;

    if (leafletMap.current) {
      leafletMap.current = null;

      if (mapRef.current && mapRef.current.parentNode) {
        const oldContainer = mapRef.current;
        const newContainer = oldContainer.cloneNode(false);
        oldContainer.parentNode.replaceChild(newContainer, oldContainer);
        mapRef.current = newContainer;
      }
    }

    leafletMap.current = L.map(mapRef.current).setView([lat, lon], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(leafletMap.current);

    const redIcon = L.icon({
      iconUrl: icon.src,
      shadowUrl: shadow.src,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([lat, lon], { icon: redIcon })
      .addTo(leafletMap.current)
      .bindPopup(label)
      .openPopup();

    L.circle([lat, lon], {
      radius: radius,
      color: "#3b82f6",
      fillColor: "#60a5fa",
      fillOpacity: 0.15,
      weight: 2,
    }).addTo(leafletMap.current);
  }, [radius]);

  const getRestaurants = useCallback(async (lat, lon) => {
    const L = (await import('leaflet')).default;
    setLoading(true);
    const query = `
      [out:json];
      (
    node["amenity"="restaurant"](around:${radius},${lat},${lon});
    way["amenity"="restaurant"](around:${radius},${lat},${lon});
    relation["amenity"="restaurant"](around:${radius},${lat},${lon});
    node["amenity"="cafe"](around:${radius},${lat},${lon});
    way["amenity"="cafe"](around:${radius},${lat},${lon});
    relation["amenity"="cafe"](around:${radius},${lat},${lon});
    node["amenity"="fast_food"](around:${radius},${lat},${lon});
    way["amenity"="fast_food"](around:${radius},${lat},${lon});
    relation["amenity"="fast_food"](around:${radius},${lat},${lon});
    node["tourism"="hotel"](around:${radius},${lat},${lon});
    way["tourism"="hotel"](around:${radius},${lat},${lon});
    relation["tourism"="hotel"](around:${radius},${lat},${lon});
    node["tourism"="guest_house"](around:${radius},${lat},${lon});
    way["tourism"="guest_house"](around:${radius},${lat},${lon});
    relation["tourism"="guest_house"](around:${radius},${lat},${lon});
    node["amenity"="bar"](around:${radius},${lat},${lon});
    way["amenity"="bar"](around:${radius},${lat},${lon});
    relation["amenity"="bar"](around:${radius},${lat},${lon});
      );
      out center;
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ data: query }).toString(),
      });
      const data = await response.json();

      if (leafletMap.current) {
        leafletMap.current.eachLayer(layer => {
          if (layer instanceof L.Marker &&
            !layer.getPopup()?.getContent()?.includes("Selected Location") && !layer.getPopup()?.getContent()?.includes("You are here")) {
            leafletMap.current.removeLayer(layer);
          }
        });
      }

      const foundPlaces = data.elements
        .map((el) => {
          const elLat = el.lat || el.center?.lat;
          const elLon = el.lon || el.center?.lon;
          const name = el.tags?.name || "";
          const isCafe = el.tags?.amenity === "cafe";
          return elLat && elLon && (!(isCafe && !name)) ? { ...el, lat: elLat, lon: elLon, tags: el.tags || {}, name } : null;
        })
        .filter(Boolean)
        .slice(0, 20);

      setPlaces(foundPlaces);

      if (!leafletMap.current) {
        console.warn('Map is not initialized; cannot add markers.');
        return;
      }
      
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetina.src,
        iconUrl: icon.src,
        shadowUrl: shadow.src,
      });

      const defaultIcon = new L.Icon.Default();
      foundPlaces.forEach(place => {
        L.marker([place.lat, place.lon], { icon: defaultIcon })
          .addTo(leafletMap.current)
          .bindPopup(`<b>${place.tags?.name || "Unnamed"}</b>`);
      });

      setLoading(false);

      if (foundPlaces.length === 0) {
      }
    } catch (err) {
      setLoading(false);
      setError("Could not fetch restaurants.");
      console.error("Failed to load restaurant data:", err);
    }
  }, [radius]);

  useEffect(() => {
    if (userLocation) {
      setError('');
      setLoading(false);
      initMap(userLocation.lat, userLocation.lng, userLocation.label || "You are here");
      getRestaurants(userLocation.lat, userLocation.lng);
    }
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
      }
    };
  }, [userLocation, getRestaurants]);

  useEffect(() => {
    const animateOnScroll = () => {
      const elementsToAnimate = [
        { selector: '.nearby-page', threshold: 1.3 },
        { selector: '.btn-find', threshold: 1.3 },
        { selector: '.nearby-places-list', threshold: 1.3 }
      ];
      elementsToAnimate.forEach(element => {
        const el = document.querySelector(element.selector);
        if (el) {
          const elementPosition = el.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / element.threshold;
          if (elementPosition < screenPosition) {
            el.classList.add('animate');
          }
        }
      });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  // Theme detection useEffect
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsThemeDark(isDark);
    };

    // Check initial theme
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "You are here"
        });
        setError('');
      },
      (err) => {
        setLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    const location = e.target.locationInput.value;
    if (!location) {
      setError('Please enter a location.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);
      const data = await res.json();
      if (data.length === 0) {
        setError("Location not found.");
        setLoading(false);
        return;
      }
      setUserLocation({
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        label: `Search: ${location}`
      });
      setError('');
    } catch (err) {
      setLoading(false);
      setError('Could not find location.');
    }
  };

  const handleRetry = () => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      setRetryCount(prev => prev + 1);
      getRestaurants(userLocation.lat, userLocation.lng);
    }
  };

  const getPlaceIcon = (type) => {
    const icons = {
      restaurant: '🍽️',
      cafe: '☕',
      fast_food: '🍔',
      hotel: '🏨',
      guest_house: '🏠',
      bar: '🍻'
    };
    return icons[type] || '📍';
  };

  const getPlaceTypeLabel = (type) => {
    const labels = {
      restaurant: 'Restaurant',
      cafe: 'Café',
      fast_food: 'Fast Food',
      hotel: 'Hotel',
      guest_house: 'Guest House',
      bar: 'Bar'
    };
    return labels[type] || 'Place';
  };

  // Styles object like currency-converter
  const containerStyles = {
    light: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      transition: 'all 0.3s ease'
    },
    dark: {
      minHeight: '100vh',
      background: '#000000',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <>
      <Navbar />
      <div style={isThemeDark ? containerStyles.dark : containerStyles.light}>
      <div className="nearby-page">
        <div className="page-header">
          <div className="header-content">
            <div className="header-icon">📍</div>
            <h1>Discover Nearby</h1>
            <p className="page-description">
              Find restaurants, cafés, hotels and more around you
            </p>
          </div>
          <div className="header-bg-pattern"></div>
        </div>

        <div className="action-section">
          <div className="search-controls">
            <button
              className="btn-find"
              onClick={handleFindNearby}
              disabled={loading}
            >
              <span className="btn-icon">
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                )}
              </span>
              {loading ? 'Locating...' : (userLocation ? 'Update Location' : 'Use My Location')}
            </button>
            
            <div className="divider">
              <span>or</span>
            </div>
            
            <form className="location-search-form" onSubmit={handleSearchLocation}>
              <div className="search-input-wrapper">
                <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <input
                  type="text"
                  name="locationInput"
                  placeholder="Search by city, address, or landmark"
                  className="search-input"
                />
                <button type="submit" className="search-btn" disabled={loading}>
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="map-container">
            <div id="map" ref={mapRef} className="map"></div>
            {userLocation && (
              <div className="location-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
                <span>Showing places within 2km radius</span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>{error}</span>
            </div>
            {retryCount < 3 && userLocation && (
              <button onClick={handleRetry} className="retry-btn">
                Try Again
              </button>
            )}
          </div>
        )}

        {!loading && !error && userLocation && (
          <div className="results-section">
            {places.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No places found nearby</h3>
                <p>Try searching in a different area or check your location settings.</p>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <h2>Found {places.length} places nearby</h2>
                  <p>Discover great spots within walking distance</p>
                </div>
                <div className="places-grid">
                  {places.map((place, index) => (
                    <div
                      key={`${place.id}-${index}`}
                      className="place-card"
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className="place-header">
                        <div className="place-icon">
                          {getPlaceIcon(place.tags?.amenity || place.tags?.tourism)}
                        </div>
                        <div className="place-info">
                          <h3 className="place-name">
                            {place.tags?.name || "Unnamed Place"}
                          </h3>
                          <span className="place-type">
                            {getPlaceTypeLabel(place.tags?.amenity || place.tags?.tourism)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="place-details">
                        {place.tags?.cuisine && (
                          <div className="detail-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 2v20l18-10L3 2z" fill="currentColor"/>
                            </svg>
                            <span>{place.tags.cuisine}</span>
                          </div>
                        )}
                        {place.tags?.['addr:street'] && (
                          <div className="detail-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                            <span>
                              {place.tags['addr:street']}
                              {place.tags['addr:city'] && `, ${place.tags['addr:city']}`}
                            </span>
                          </div>
                        )}
                        {place.tags?.phone && (
                          <div className="detail-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                            <a href={`tel:${place.tags.phone}`}>{place.tags.phone}</a>
                          </div>
                        )}
                      </div>
                      
                      <div className="place-actions">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-map-btn"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" fill="none"/>
                            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                          </svg>
                          View on Map
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>

     <style jsx>{`
        /* CSS Variables for Theme Management */
        :global(:root) {
          --bg-primary: #f8fbff;
          --bg-secondary: #e3f2fd;
          --text-primary: #1565c0;
          --text-secondary: #546e7a;
          --border-color: #e3f2fd;
          --card-bg: #ffffff;
          --shadow: rgba(25, 118, 210, 0.1);
        }

        :global(.dark-theme) {
          --bg-primary: #000000;
          --bg-secondary: #000000;
          --text-primary: #ffffff;
          --text-secondary: #cccccc;
          --border-color: #333333;
          --card-bg: #111111;
          --shadow: rgba(255, 255, 255, 0.1);
        }

        /* Nearby Places Component Styles - Theme Responsive */

.nearby-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}

.nearby-page.animate {
  opacity: 1;
  transform: translateY(0);
}

/* Header Section */
.page-header {
  position: relative;
  text-align: center;
  padding: 60px 0 40px;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 2;
}

.header-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  display: inline-block;
  background: ${isThemeDark ? 'linear-gradient(135deg, #ffffff, #cccccc)' : 'linear-gradient(135deg, #1976d2, #42a5f5)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: background 0.3s ease;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: ${isThemeDark ? '#ffffff' : '#1565c0'};
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

.page-description {
  font-size: 1.1rem;
  color: ${isThemeDark ? '#cccccc' : '#546e7a'};
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
  transition: color 0.3s ease;
}

.header-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: ${isThemeDark ? 
    'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)' :
    'radial-gradient(circle at 20% 80%, rgba(25, 118, 210, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)'};
  pointer-events: none;
  transition: background-image 0.3s ease;
}

/* Action Section */
.action-section {
  margin-bottom: 40px;
}

.search-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

/* Find Button */
.btn-find {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  border: none;
  padding: 16px 32px;
  margin-top: 30px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(25, 118, 210, 0.3);
  transform: translateY(0);
  opacity: 0;
  animation: fadeInUp 0.6s ease-out 0.2s forwards;
}

.btn-find:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(25, 118, 210, 0.4);
  background: linear-gradient(135deg, #1565c0, #0d47a1);
}

.btn-find:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${isThemeDark ? '#aaaaaa' : '#78909c'};
  font-size: 0.9rem;
  width: 100%;
  max-width: 400px;
  transition: color 0.3s ease;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: ${isThemeDark ? 'linear-gradient(90deg, transparent, #555555, transparent)' : 'linear-gradient(90deg, transparent, #b0bec5, transparent)'};
}

/* Search Form */
.location-search-form {
  width: 100%;
  max-width: 500px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  background: ${isThemeDark ? '#222222' : 'white'};
  border-radius: 50px;
  box-shadow: 0 4px 20px ${isThemeDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(25, 118, 210, 0.1)'};
  border: 2px solid ${isThemeDark ? '#444444' : '#e3f2fd'};
  transition: all 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: ${isThemeDark ? '#666666' : '#1976d2'};
  box-shadow: 0 4px 25px ${isThemeDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(25, 118, 210, 0.2)'};
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: ${isThemeDark ? '#aaaaaa' : '#78909c'};
  pointer-events: none;
  transition: color 0.3s ease;
}

.search-input {
  flex: 1;
  border: none;
  padding: 16px 20px 16px 52px;
  border-radius: 50px 0 0 50px;
  font-size: 1rem;
  outline: none;
  background: transparent;
  color: ${isThemeDark ? '#ffffff' : '#37474f'};
  transition: color 0.3s ease;
}

.search-input::placeholder {
  color: ${isThemeDark ? '#888888' : '#90a4ae'};
}

.search-btn {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  border: none;
  padding: 16px 28px;
  border-radius: 0 50px 50px 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Map Container */
.map-container {
  position: relative;
  margin: 32px 0;
}

.map {
  width: 100%;
  height: 400px;
  border-radius: 16px;
  box-shadow: 0 8px 32px ${isThemeDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(25, 118, 210, 0.15)'};
  border: 2px solid ${isThemeDark ? '#444444' : '#e3f2fd'};
  background: ${isThemeDark ? '#222222' : '#f8fbff'};
  transition: all 0.3s ease;
}

.location-badge {
  position: absolute;
  bottom: 16px;
  left: 16px;
  background: ${isThemeDark ? 'rgba(34, 34, 34, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: ${isThemeDark ? '#ffffff' : 'inherit'};
  border: 1px solid ${isThemeDark ? '#555555' : 'transparent'};
  transition: all 0.3s ease;
  color: #1565c0;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);
  border: 1px solid rgba(25, 118, 210, 0.1);
}

/* Error Message */
.error-message {
  background: ${isThemeDark ? 'linear-gradient(135deg, #2d1b1b, #3d2020)' : 'linear-gradient(135deg, #ffebee, #fce4ec)'};
  border: 1px solid ${isThemeDark ? '#555555' : '#f8bbd9'};
  border-radius: 12px;
  padding: 16px 20px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.3s ease;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${isThemeDark ? '#ff6b6b' : '#c62828'};
  flex: 1;
  transition: color 0.3s ease;
}

.retry-btn {
  background: ${isThemeDark ? '#333333' : '#e3f2fd'};
  color: ${isThemeDark ? '#ffffff' : '#1976d2'};
  border: 1px solid ${isThemeDark ? '#555555' : '#bbdefb'};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: ${isThemeDark ? '#444444' : '#bbdefb'};
}

/* Results Section */
.results-section {
  animation: fadeInUp 0.6s ease-out;
}

.results-header {
  text-align: center;
  margin-bottom: 32px;
}

.results-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: ${isThemeDark ? '#ffffff' : '#1565c0'};
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
}

.results-header p {
  color: ${isThemeDark ? '#cccccc' : '#546e7a'};
  font-size: 1rem;
  margin: 0;
  transition: color 0.3s ease;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: ${isThemeDark ? '#cccccc' : '#546e7a'};
  transition: color 0.3s ease;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.7;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: ${isThemeDark ? '#ffffff' : '#37474f'};
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
}

.empty-state p {
  font-size: 1rem;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
  color: ${isThemeDark ? '#cccccc' : 'inherit'};
  transition: color 0.3s ease;
}

/* Places Grid */
.places-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.place-card {
  background: ${isThemeDark ? '#111111' : 'white'};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px ${isThemeDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(25, 118, 210, 0.08)'};
  border: 1px solid ${isThemeDark ? '#333333' : '#e3f2fd'};
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.6s ease-out forwards;
}

.place-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px ${isThemeDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(25, 118, 210, 0.15)'};
  border-color: ${isThemeDark ? '#555555' : '#bbdefb'};
}

.place-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.place-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.place-info {
  flex: 1;
}

.place-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: ${isThemeDark ? '#ffffff' : '#1565c0'};
  margin: 0 0 4px 0;
  line-height: 1.2;
  transition: color 0.3s ease;
}

.place-type {
  display: inline-block;
  background: ${isThemeDark ? 'linear-gradient(135deg, #333333, #555555)' : 'linear-gradient(135deg, #e3f2fd, #bbdefb)'};
  color: ${isThemeDark ? '#ffffff' : '#1976d2'};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

/* Place Details */
.place-details {
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${isThemeDark ? '#cccccc' : '#546e7a'};
  transition: color 0.3s ease;
}

.detail-item svg {
  color: ${isThemeDark ? '#aaaaaa' : '#78909c'};
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.detail-item a {
  color: ${isThemeDark ? '#ffffff' : '#1976d2'};
  text-decoration: none;
  transition: color 0.2s ease;
}

.detail-item a:hover {
  color: #1565c0;
  text-decoration: underline;
}

/* Place Actions */
.place-actions {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid ${isThemeDark ? '#444444' : '#e3f2fd'};
  transition: border-color 0.3s ease;
}

.view-map-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${isThemeDark ? 'linear-gradient(135deg, #333333, #555555)' : 'linear-gradient(135deg, #e3f2fd, #bbdefb)'};
  color: ${isThemeDark ? '#ffffff' : '#1976d2'};
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid ${isThemeDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(25, 118, 210, 0.2)'};
}

.view-map-btn:hover {
  background: ${isThemeDark ? 'linear-gradient(135deg, #444444, #666666)' : 'linear-gradient(135deg, #bbdefb, #90caf9)'};
  transform: translateY(-1px);
  box-shadow: 0 4px 12px ${isThemeDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(25, 118, 210, 0.2)'};
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nearby-container {
    padding: 0 16px;
  }
  
  .page-header {
    padding: 40px 0 30px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .search-controls {
    gap: 20px;
  }
  
  .btn-find {
    padding: 14px 24px;
    font-size: 0.9rem;
  }
  
  .search-input-wrapper {
    flex-direction: column;
    border-radius: 12px;
  }
  
  .search-input {
    border-radius: 12px 12px 0 0;
    padding: 14px 20px 14px 52px;
  }
  
  .search-btn {
    border-radius: 0 0 12px 12px;
    padding: 14px 20px;
  }
  
  .map {
    height: 300px;
    border-radius: 12px;
  }
  
  .places-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .place-card {
    padding: 20px;
    border-radius: 12px;
  }
  
  .location-badge {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.75rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .btn-find {
    width: 100%;
    max-width: 280px;
    justify-content: center;
  }
  
  .place-header {
    gap: 12px;
  }
  
  .place-icon {
    width: 45px;
    height: 45px;
    font-size: 1.5rem;
  }
  
  .place-name {
    font-size: 1.1rem;
  }
}
      `}</style>
    </>
  );
}