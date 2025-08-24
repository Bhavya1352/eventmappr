import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { EVENT_CATEGORIES } from "../../utils/routes";
import GpsButton from "../ui/GpsButton";
import NearbyPlaces from "./NearbyPlaces";
import NearbyPlacesPanel from "./NearbyPlacesPanel";

const MapExplorer = ({
  events = [],
  onEventAdded,
  onEventDeleted,
  isAuthenticated,
}) => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    organizer: "",
    contact: "",
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
    // ADDED: New categories for filtering
    "Comedy & Shows": true,
    Wellness: true,
  });
  const [showForm, setShowForm] = useState(false);
  const [mapView, setMapView] = useState("standard");
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);
  // --- Nearby Places Feature ---
  const [showNearby, setShowNearby] = useState(false);
  const [showNearbyPanel, setShowNearbyPanel] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyError, setNearbyError] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [center, setCenter] = useState([40.7128, -74.006]); // Default center: NYC
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = [coords.latitude, coords.longitude];
        console.log("✔ Got GPS:", pos);
        setCenter(pos);
      },
      (err) => {
        console.error("Geo error:", err.message);
        // Fallback to default center if geolocation fails
        setCenter([40.7128, -74.006]);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const handleShowNearby = () => {
    if (!showNearby) {
      if (!navigator.geolocation) {
        setNearbyError("Geolocation is not supported by your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setShowNearby(true);
          setShowNearbyPanel(true);
          setNearbyError("");
          if (mapRef.current) {
            mapRef.current.setView(
              [position.coords.latitude, position.coords.longitude],
              14
            );
          }
        },
        () => {
          setNearbyError(
            "Unable to retrieve your location. Please check your browser permissions."
          );
        }
      );
    } else {
      setShowNearby(false);
      setShowNearbyPanel(false);
      setNearbyError("");
    }
  };

  const handleCloseNearbyPanel = () => {
    setShowNearbyPanel(false);
  };

  // Duplicate state declarations removed (already declared above)

  // Fix Leaflet default icon issue
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  // Handle map creation and setup click handler
  const handleMapCreated = (map) => {
    mapRef.current = map;
    setMapReady(true);
    // Add click handler directly to the map
    map.on("click", (e) => {
      if (!isAuthenticated) {
        alert("Please sign in to add events");
        return;
      }

      const { lat, lng } = e.latlng;
      setNewEvent((prev) => ({
        ...prev,
        lat: lat,
        lng: lng,
      }));
      setShowForm(true);
    });
  };
  console.log("start");
  useEffect(() => {
    console.log("starting soon");
    if (mapReady && mapRef.current && center && center[0] !== 40.7128) {
      console.log("it started running");
      console.log(
        "📍 Flying to user location after both map + GPS ready:",
        center
      );
      mapRef.current.flyTo(center, 13, { duration: 1.2 });
    } else {
      console.log("⏳ Waiting - Map or center not ready", {
        mapReady: !!mapRef.current,
        center,
      });
    }
  }, [mapReady, center]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (
      !newEvent.title ||
      !newEvent.category ||
      !newEvent.lat ||
      !newEvent.lng
    ) {
      alert(
        "Please fill in all required fields and select a location on the map."
      );
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
      title: "",
      description: "",
      category: "",
      date: "",
      time: "",
      organizer: "",
      contact: "",
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
        alert(
          "Unable to retrieve your location. Please check your browser permissions."
        );
      }
    );
  };

  const handleDeleteEvent = (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      onEventDeleted(eventId);
    }
  };

  const changeMapView = (view) => {
    setMapView(view);

    if (mapRef.current) {
      // Change the tile layer based on the selected view
      const tileLayer = document.querySelector(".leaflet-tile-pane");
      if (tileLayer) {
        tileLayer.style.filter =
          view === "satellite" ? "contrast(1.1) saturate(1.1)" : "none";
      }
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Custom icon creator function
  const createIcon = (category) => {
    const iconMapping = {
      Tech: { color: "#38BDF8", emoji: "💻" },
      Music: { color: "#FF6B6B", emoji: "🎵" },
      Volunteering: { color: "#4CAF50", emoji: "🤝" },
      Market: { color: "#FACC15", emoji: "🛍️" },
      Art: { color: "#9C27B0", emoji: "🎨" },
      Sports: { color: "#FF9800", emoji: "🏆" },
      Education: { color: "#3F51B5", emoji: "📚" },
      // ADDED: Map marker icons for the new categories
      "Comedy & Shows": { color: "#8e44ad", emoji: "🎭" },
      Wellness: { color: "#27ae60", emoji: "🧘" },
    };

    const iconInfo = iconMapping[category] || { color: "#333333", emoji: "📌" };

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
    .filter((event) => filters[event.category])
    .filter((event) => {
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
    Music: "#48CAE4",
    Tech: "#26637F",
    Volunteering: "#22b4a3ff",
    Market: "#023E8A",
    Art: "#03045E",
    Sports: " #417C9A ",
    Education: "#124B56",
    // ADDED: UI colors for the new filter buttons
    "Comedy & Shows": "#9b59b6",
    Wellness: "#1abc9c",
  };

  useEffect(() => {
    // Animation on scroll for filter controls and other elements
    const animateOnScroll = () => {
      const elementsToAnimate = [
        { selector: ".filter-controls", threshold: 1.3 },
        { selector: ".map-view-controls", threshold: 1.3 },
        { selector: ".search-bar", threshold: 1.3 },
        { selector: ".search-input", threshold: 1.3 },
        { selector: ".btn-nearby", threshold: 1.3 },
        { selector: ".view-option", threshold: 1.3 },
      ];

      elementsToAnimate.forEach((element) => {
        const el = document.querySelector(element.selector);
        if (el) {
          const elementPosition = el.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / element.threshold;

          if (elementPosition < screenPosition) {
            el.classList.add("animate");
          }
        }
      });
    };

    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll(); // Run once on load

    return () => {
      window.removeEventListener("scroll", animateOnScroll);
    };
  }, []);

  const MapInitializer = ({ center, onInit }) => {
    const map = useMap();

    useEffect(() => {
      console.log(" MapInitializer: map is ready");
      onInit(map);
    }, [map]);

    return null;
  };

  return (
    <div className="map-explorer">
      <div className="map-controls">
        <div className="search-parent">
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
            <button
              className={"btn-nearby" + (showNearby ? " active" : "")}
              style={{ marginLeft: "0.5rem" }}
              onClick={handleShowNearby}
            >
              <span className="btn-icon">🍽️🏨</span>
              <span className="btn-text">
                {showNearby ? "Hide" : "Show"} Nearby Restaurants & Hotels
              </span>
            </button>
            {showNearbyPanel && (
              <NearbyPlacesPanel
                userLocation={userLocation}
                onClose={handleCloseNearbyPanel}
              />
            )}
            {nearbyError && (
              <span style={{ color: "red", marginLeft: "1rem" }}>
                {nearbyError}
              </span>
            )}
          </div>
        </div>

        <div className="filter-controls">
          <div className="filter-title">Filter by category:</div>
          <div className="filter-options">
            {Object.keys(filters).map((category) => (
              <button
                key={category}
                className={`filter-tag ${
                  filters[category] ? "active" : "inactive"
                }`}
                onClick={() => handleFilterChange(category)}
                style={{
                  "--category-color": categoryColors[category] || "#333333",
                }}
              >
                <span className="filter-icon">
                  {category === "Music" && "🎵"}
                  {category === "Tech" && "💻"}
                  {category === "Volunteering" && "🤝"}
                  {category === "Market" && "🛍️"}
                  {category === "Art" && "🎨"}
                  {category === "Sports" && "🏆"}
                  {category === "Education" && "📚"}
                  {/* ADDED: Emojis for the new filter buttons */}
                  {category === "Comedy & Shows" && "🎭"}
                  {category === "Wellness" && "🧘"}
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
              className={`view-option ${
                mapView === "standard" ? "active" : ""
              }`}
              onClick={() => changeMapView("standard")}
            >
              Standard
            </button>
            <button
              className={`view-option ${
                mapView === "satellite" ? "active" : ""
              }`}
              onClick={() => changeMapView("satellite")}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          //whenCreated={handleMapCreated}
        >
          <MapInitializer
            center={center}
            onInit={(map) => {
              mapRef.current = map;
              setMapReady(true);
            }}
          />
          <TileLayer
            url={
              mapView === "satellite"
                ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={
              mapView === "satellite"
                ? "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          />
          <Marker position={center}>
            <Popup>You are here</Popup>
          </Marker>

          {filteredEvents.map((event) => (
            <Marker
              key={event.id}
              position={[event.lat, event.lng]}
              icon={createIcon(event.category)}
            >
              <Popup>
                <div className="event-popup">
                  <h3 className="event-title">{event.title}</h3>
                  <span
                    className={`event-category ${event.category.toLowerCase()}`}
                  >
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
                      <span className="popup-label">Organizer:</span>{" "}
                      {event.organizer}
                    </div>
                  )}

                  {event.contact && (
                    <div className="event-contact">
                      <span className="popup-label">Contact:</span>{" "}
                      {event.contact}
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

          <GpsButton />

          {/* Nearby Restaurants & Hotels Markers */}
          {showNearby && userLocation && (
            <NearbyPlaces userLocation={userLocation} />
          )}

          {/* Marker Legend */}
          {showNearby && (
            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                background: "#fff",
                padding: "8px 14px",
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                zIndex: 1000,
                fontSize: "0.98rem",
              }}
            >
              <span style={{ marginRight: 12 }}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3075/3075977.png"
                  alt="Restaurant"
                  style={{ width: 22, verticalAlign: "middle", marginRight: 4 }}
                />
                Restaurant
              </span>
              <span>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/139/139899.png"
                  alt="Hotel"
                  style={{ width: 22, verticalAlign: "middle", marginRight: 4 }}
                />
                Hotel
              </span>
            </div>
          )}
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
                  {/* ADDED: New categories to the form dropdown */}
                  <option value="Comedy & Shows">Comedy & Shows</option>
                  <option value="Wellness">Wellness</option>
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
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-cancel"
                >
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
    background: var(--background);
  }

  .map-controls {
    background-color: var(--background);
    padding: 1rem;
    border-bottom: 1px solid var(--border);
    z-index: 10;
    backdrop-filter: blur(6px);
  }

  /* ---------- Search Bar ---------- */
  .search-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    opacity: 0;
    transform: translateY(20px) scale(0.98);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .search-bar.animate {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: 14px;
    font-size: 0.95rem;
    background-color: var(--background-alt);
    color: var(--text);
    transition: all 0.3s ease;
  }
  .search-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.15);
  }

  .btn-nearby {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    border: none;
    border-radius: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.25s ease, filter 0.3s ease;
    white-space: nowrap;
  }
  .btn-nearby:hover {
    transform: translateY(-2px) scale(1.03);
    filter: brightness(1.1);
  }

  /* ---------- Filter Controls ---------- */
  .filter-controls {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .filter-controls.animate {
    opacity: 1;
    transform: translateY(0);
  }

  .filter-title {
    margin-top: 20px;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  .filter-options {
    display: flex;
    gap: 0.8rem;
    overflow-x: auto;
    padding-bottom: 6px;
    scrollbar-width: none;
  }
  .filter-options::-webkit-scrollbar {
    display: none;
  }

  /* ---------- Updated Filter Buttons ---------- */
  .filter-tag {
    background-color: var(--background-alt);
    color: var(--text);
    border: 1px solid var(--border);
    padding: 0.6rem 1.2rem;
    border-radius: 20px;
    font-weight: 500;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }
  .filter-tag:hover {
    background-color: rgba(var(--primary-rgb), 0.08);
    transform: translateY(-2px);
  }
  .filter-tag.active {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: #fff;
    border-color: var(--primary);
    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
  }

  /* ---------- Map View Controls ---------- */
  .map-view-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .map-view-controls.animate {
    opacity: 1;
    transform: translateY(0);
  }

  .view-title {
    padding-top: 30px;
    font-weight: 600;
    color: var(--text);
  }

  .view-options {
    display: flex;
    gap: 0.6rem;
  }

  .view-option {
    margin-top: 30px;
    padding: 0.5rem 1rem;
    border-radius: 12px;
    cursor: pointer;
    border: 1px solid var(--border);
    background-color: var(--background-alt);
    color: var(--text);
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }
  .view-option:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
  .view-option.active {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    border-color: var(--primary);
  }

  /* ---------- Map ---------- */
  .map-container {
    flex: 1;
    position: relative;
    z-index: 800;
  }

  /* ---------- Event Popup ---------- */
  .event-popup {
    min-width: 220px;
    max-width: 320px;
    font-family: 'Inter', sans-serif;
  }
  .event-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.3rem;
  }
  .event-category {
    display: inline-block;
    padding: 0.3rem 0.6rem;
    border-radius: 20px;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .event-popup hr {
    border: none;
    border-top: 1px solid var(--border);
    margin: 0.75rem 0;
  }

  /* ---------- Buttons ---------- */
  .btn-delete {
    padding: 0.4rem 0.9rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-delete:hover {
    background: #dc2626;
    transform: scale(1.05);
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 768px) {
    .search-bar {
      flex-direction: column;
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
