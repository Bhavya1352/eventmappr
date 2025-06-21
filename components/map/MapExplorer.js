import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EVENT_CATEGORIES } from '../../utils/routes';
import GpsButton from '../ui/GpsButton'

const MapExplorer = ({ events = [], onEventAdded, onEventDeleted, isAuthenticated }) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    organizer: '',
    contact: '',
    lat: null,
    lng: null,
  });
  
  const [filters, setFilters] = useState({
    Music: true,
    Tech: true,
    Volunteering: true,
    Market: true,
    Art: true,
    Sports: true,
    Education: true,
  });
  
  const [showForm, setShowForm] = useState(false);
  const [mapView, setMapView] = useState('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  // Fix Leaflet default icon issue
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Handle map creation and setup click handler
  const handleMapCreated = (map) => {
    mapRef.current = map;
    
    // Add click handler directly to the map
    map.on('click', (e) => {
      if (!isAuthenticated) {
        alert('Please sign in to add events');
        return;
      }
      
      const { lat, lng } = e.latlng;
      setNewEvent(prev => ({
        ...prev,
        lat: lat,
        lng: lng
      }));
      setShowForm(true);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (category) => {
    setFilters(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!newEvent.title || !newEvent.category || !newEvent.lat || !newEvent.lng) {
      alert('Please fill in all required fields and select a location on the map.');
      return;
    }
    
    const event = {
      id: Date.now().toString(),
      ...newEvent,
      createdAt: new Date().toISOString(),
    };
    
    onEventAdded(event);
    
    // Reset form
    setNewEvent({
      title: '',
      description: '',
      category: '',
      date: '',
      time: '',
      organizer: '',
      contact: '',
      lat: null,
      lng: null,
    });
    
    setShowForm(false);
  };

  const findNearby = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        if (mapRef.current) {
          mapRef.current.setView([userLat, userLng], 13);
        }
      },
      () => {
        alert("Unable to retrieve your location. Please check your browser permissions.");
      }
    );
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      onEventDeleted(eventId);
    }
  };

  const changeMapView = (view) => {
    setMapView(view);
    
    if (mapRef.current) {
      // Change the tile layer based on the selected view
      const tileLayer = document.querySelector('.leaflet-tile-pane');
      if (tileLayer) {
        tileLayer.style.filter = view === 'satellite' ? 'contrast(1.1) saturate(1.1)' : 'none';
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Custom icon creator function
  const createIcon = (category) => {
    const iconMapping = {
      Tech: { color: '#38BDF8', emoji: '💻' },
      Music: { color: '#FF6B6B', emoji: '🎵' },
      Volunteering: { color: '#4CAF50', emoji: '🤝' },
      Market: { color: '#FACC15', emoji: '🛍️' },
      Art: { color: '#9C27B0', emoji: '🎨' },
      Sports: { color: '#FF9800', emoji: '🏆' },
      Education: { color: '#3F51B5', emoji: '📚' },
    };
    
    const iconInfo = iconMapping[category] || { color: '#333333', emoji: '📌' };
    
    return L.divIcon({
      html: `<div style="background-color: ${iconInfo.color}; color: white; border-radius: 50%; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 14px;">${iconInfo.emoji}</div>`,
      className: `event-marker ${category.toLowerCase()}-marker`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15],
    });
  };

  // Filter events based on category filters and search query
  const filteredEvents = events
    .filter(event => filters[event.category])
    .filter(event => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.organizer?.toLowerCase().includes(query)
      );
    });

  // Category colors for filter tags
  const categoryColors = {
    Music: '#FF6B6B',
    Tech: '#38BDF8',
    Volunteering: '#4CAF50',
    Market: '#FACC15',
    Art: '#9C27B0',
    Sports: '#FF9800',
    Education: '#3F51B5'
  };

  return (
    <div className="map-explorer">
      <div className="map-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <button className="btn-nearby" onClick={findNearby}>
            <span className="btn-icon">📍</span>
            <span className="btn-text">Find Nearby</span>
          </button>
        </div>
        
        <div className="filter-controls">
          <div className="filter-title">Filter by category:</div>
          <div className="filter-options">
            {Object.keys(filters).map(category => (
              <button
                key={category}
                className={`filter-tag ${filters[category] ? 'active' : 'inactive'}`}
                onClick={() => handleFilterChange(category)}
                style={{
                  '--category-color': categoryColors[category] || '#333333'
                }}
              >
                <span className="filter-icon">
                  {category === 'Music' && '🎵'}
                  {category === 'Tech' && '💻'}
                  {category === 'Volunteering' && '🤝'}
                  {category === 'Market' && '🛍️'}
                  {category === 'Art' && '🎨'}
                  {category === 'Sports' && '🏆'}
                  {category === 'Education' && '📚'}
                </span>
                <span className="filter-name">{category}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="map-view-controls">
          <div className="view-title">Map Style:</div>
          <div className="view-options">
            <button 
              className={`view-option ${mapView === 'standard' ? 'active' : ''}`}
              onClick={() => changeMapView('standard')}
            >
              Standard
            </button>
            <button 
              className={`view-option ${mapView === 'satellite' ? 'active' : ''}`}
              onClick={() => changeMapView('satellite')}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>
      
      <div className="map-container">
        <MapContainer 
          center={[40.7128, -74.0060]} 
          zoom={13} 
          style={{ height: "100%", width: "100%" }}
          whenCreated={handleMapCreated}
        >
          <TileLayer
            url={mapView === 'satellite' 
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
            attribution={mapView === 'satellite'
              ? 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          />
          
          {filteredEvents.map(event => (
            <Marker 
              key={event.id} 
              position={[event.lat, event.lng]}
              icon={createIcon(event.category)}
            >
              <Popup>
                <div className="event-popup">
                  <h3 className="event-title">{event.title}</h3>
                  <span className={`event-category ${event.category.toLowerCase()}`}>
                    {event.category}
                  </span>
                  
                  {event.date && (
                    <div className="event-date">
                      <span className="popup-label">Date:</span> {event.date}
                      {event.time && <span> at {event.time}</span>}
                    </div>
                  )}
                  
                  <p className="event-description">{event.description}</p>
                  
                  {event.organizer && (
                    <div className="event-organizer">
                      <span className="popup-label">Organizer:</span> {event.organizer}
                    </div>
                  )}
                  
                  {event.contact && (
                    <div className="event-contact">
                      <span className="popup-label">Contact:</span> {event.contact}
                    </div>
                  )}
                  
                  <div className="event-actions">
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          <GpsButton/>

        </MapContainer>
      </div>
      
      {showForm && (
        <div className="event-form-overlay">
          <div className="event-form-container">
            <h2>Add New Event</h2>
            <form onSubmit={handleFormSubmit} className="event-form">
              <div className="form-group">
                <label htmlFor="title">Event Title *</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={newEvent.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select 
                  id="category" 
                  name="category" 
                  value={newEvent.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Music">Music</option>
                  <option value="Tech">Tech</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Market">Market</option>
                  <option value="Art">Art</option>
                  <option value="Sports">Sports</option>
                  <option value="Education">Education</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    value={newEvent.date}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input 
                    type="time" 
                    id="time" 
                    name="time" 
                    value={newEvent.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={newEvent.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="organizer">Organizer</label>
                  <input 
                    type="text" 
                    id="organizer" 
                    name="organizer" 
                    value={newEvent.organizer}
                    onChange={handleInputChange}
                    placeholder="Event organizer"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contact">Contact</label>
                  <input 
                    type="text" 
                    id="contact" 
                    name="contact" 
                    value={newEvent.contact}
                    onChange={handleInputChange}
                    placeholder="Contact information"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .map-explorer {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 60px);
          position: relative;
        }
        
        .map-controls {
          background-color: var(--background);
          padding: 1rem;
          border-bottom: 1px solid var(--border);
          z-index: 10;
        }
        
        .search-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 30px;
          font-size: 0.95rem;
          background-color: var(--background-alt);
          color: var(--text);
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
        }
        
        .btn-nearby {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.25rem;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        
        .btn-nearby:hover {
          background-color: var(--primary-dark);
          transform: translateY(-2px);
        }
        
        .btn-icon {
          margin-right: 0.5rem;
        }
        
        .filter-controls {
          margin-bottom: 1rem;
        }
        
        .filter-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .filter-tag {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background-color: var(--background-alt);
          color: var(--text);
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .filter-tag.active {
          background-color: var(--category-color);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .filter-tag.inactive {
          opacity: 0.7;
        }
        
        .filter-tag:hover {
          transform: translateY(-2px);
        }
        
        .filter-icon {
          margin-right: 0.5rem;
          font-size: 1rem;
        }
        
        .map-view-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .view-title {
          font-weight: 600;
          color: var(--text);
        }
        
        .view-options {
          display: flex;
          gap: 0.5rem;
        }
        
        .view-option {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--border);
          background-color: var(--background-alt);
          color: var(--text);
          font-size: 0.9rem;
        }
        
        .view-option.active {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }
        
        .map-container {
          flex: 1;
          position: relative;
        }
        
        .event-popup {
          min-width: 200px;
          max-width: 300px;
        }
        
        .event-title {
          margin-top: 0;
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }
        
        .event-category {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: white;
        }
        
        .event-category.music {
          background-color: #FF6B6B;
        }
        
        .event-category.tech {
          background-color: #38BDF8;
        }
        
        .event-category.volunteering {
          background-color: #4CAF50;
        }
        
        .event-category.market {
          background-color: #FACC15;
        }
        
        .event-category.art {
          background-color: #9C27B0;
        }
        
        .event-category.sports {
          background-color: #FF9800;
        }
        
        .event-category.education {
          background-color: #3F51B5;
        }
        
        .event-description {
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }
        
        .event-date,
        .event-organizer,
        .event-contact {
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        
        .popup-label {
          font-weight: 600;
        }
        
        .event-actions {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }
        
        .btn-delete {
          padding: 0.35rem 0.75rem;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-delete:hover {
          background-color: #dc2626;
        }
        
        .event-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .event-form-container {
          background-color: var(--background);
          border-radius: 12px;
          padding: 2rem;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .event-form-container h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .event-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .event-form label {
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .event-form input,
        .event-form select,
        .event-form textarea {
          padding: 0.75rem;
          border: 1px solid var(--border);
          border-radius: 6px;
          background-color: var(--background-alt);
          color: var(--text);
          font-size: 0.95rem;
        }
        
        .event-form input:focus,
        .event-form select:focus,
        .event-form textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background-color: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-cancel:hover {
          background-color: var(--background-alt);
        }
        
        .btn-submit {
          padding: 0.75rem 1.5rem;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-submit:hover {
          background-color: var(--primary-dark);
        }
        
        @media (max-width: 768px) {
          .search-bar {
            flex-direction: column;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .btn-nearby {
            width: 100%;
            justify-content: center;
          }
          
          .map-view-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .view-options {
            width: 100%;
          }
          
          .view-option {
            flex: 1;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MapExplorer; 