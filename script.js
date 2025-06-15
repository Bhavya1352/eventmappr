const events = [
  {
    name: "Community Cleanup",
    type: "Volunteering",
    lat: 28.604047,
    lng: 77.227003,
  },
  { name: "Local Music Night", type: "Music", lat: 28.626646, lng: 77.190096 },
  { name: "Tech Meetup", type: "Technology", lat: 28.613999, lng: 77.226603 },
  { name: "Farmers Market", type: "Market", lat: 28.616373, lng: 77.204582 },
  { name: "Art & Craft Fair", type: "Art", lat: 28.601078, lng: 77.208121 },
];

// Load dynamic events from localStorage
function loadDynamicEvents() {
  const dynamicEvents = JSON.parse(localStorage.getItem("dynamicEvents") || "{}");
  Object.values(dynamicEvents).forEach((event) => {
    const exists = events.find((e) => e.name === event.name);
    if (!exists) {
      events.push(event);
    }
  });
}

loadDynamicEvents();

let map = L.map("map").setView([28.6139, 77.209], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markerGroup = L.layerGroup().addTo(map);

function renderMarkers(filteredEvents) {
  markerGroup.clearLayers();
  filteredEvents.forEach((event) => {
    const marker = L.marker([event.lat, event.lng]).addTo(markerGroup);
    const popupContent = `
      <div style="text-align: center; min-width: 250px; padding: 5px; font-family: 'Poppins', sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px; border-radius: 15px 15px 0 0; margin: -5px -5px 10px -5px;">
          <strong style="font-size: 18px; font-weight: 600;">${event.name}</strong>
        </div>
        <div style="padding: 0 10px;">
          <div style="display: inline-block; background: rgba(102, 126, 234, 0.1); color: #667eea; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 500; margin-bottom: 15px;">
            ${event.type}
          </div><br>
          Date: ${event.date || "N/A"}<br>
          Time: ${event.time || "N/A"}<br><br>
          <a href="event-details.html?event=${encodeURIComponent(event.name)}" 
             style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 10px 20px; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: 500; display: inline-block; margin-top: 5px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);"
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)';">
            <i class="fas fa-info-circle" style="margin-right: 5px;"></i>View Details
          </a>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent, { maxWidth: 300, className: "custom-popup" });
  });
}

renderMarkers(events);

document.getElementById("eventForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const controls = document.querySelector(".controls");
  const name = document.getElementById("eventName").value;
  const type = document.getElementById("eventType").value;
  const date = document.getElementById("eventDate").value;
  const time = document.getElementById("eventTime").value;

  const locationmsg = document.createElement("div");
  locationmsg.style = `
    padding: 12px 24px;
    background: linear-gradient(135deg, rgba(21, 21, 65, 0.85), rgba(52, 12, 87, 0.7));
    z-index: 1000;
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4);
    color: #e4d4ff;
    font-weight: 500;
    border-radius: 8px;
    overflow: hidden;
    opacity: 1;
    transition: opacity 1s ease-in-out;
  `;
  locationmsg.textContent = "📍 Now click on the map to select the event location.";
  const progressBar = document.createElement("div");
  progressBar.style = `
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background: linear-gradient(90deg, #a64eff, #da5cff);
    width: 100%;
    animation: shrink 4s linear backwards;
  `;
  const style = document.createElement("style");
  style.innerHTML = `@keyframes shrink { from { width: 100%; } to { width: 0; } }`;
  document.head.appendChild(style);
  locationmsg.appendChild(progressBar);
  controls.appendChild(locationmsg);
  setTimeout(() => locationmsg.remove(), 4000);

  map.once("click", function (event) {
    const { lat, lng } = event.latlng;
    const newEvent = { name, type, date, time, lat, lng };
    events.push(newEvent);

    const dynamicEvents = JSON.parse(localStorage.getItem("dynamicEvents") || "{}");
    dynamicEvents[name] = newEvent;
    localStorage.setItem("dynamicEvents", JSON.stringify(dynamicEvents));

    renderMarkers(events);

    const toast = document.createElement("div");
    toast.textContent = "🎉 Event added successfully!";
    toast.style = `
      position: fixed;
      bottom: 40px;
      left: 80%;
      transform: translateX(-50%) translateY(30px);
      padding: 12px 24px;
      background: linear-gradient(135deg, #5b2be0, #ae31d9);
      color: white;
      font-weight: 600;
      border-radius: 8px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      opacity: 0;
      z-index: 9999;
      transition: opacity 0.5s ease, transform 0.5s ease;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translate(-50%) translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(100px)";
      setTimeout(() => toast.remove(), 1000);
    }, 4000);

    const viewDetails = document.createElement("div");
    viewDetails.innerHTML = `
      <p style="margin-bottom:12px">Event added successfully!<br>Would you like to view the event details and add photos?</p>
      <div style="display:flex;justify-content:center;gap:12px">
        <button id="yes-btn" style="padding:8px 16px;background:linear-gradient(135deg,rgb(241, 79, 253),rgb(97, 0, 166));border:none;border-radius:6px;color:white;cursor:pointer;font-weight:600;">YES</button>
        <button id="no-btn" style="padding:8px 16px;background: linear-gradient(135deg,rgb(76, 0, 229),rgb(37, 2, 48)); border:none;border-radius:6px;color:white;cursor:pointer;font-weight:600;">NO</button>
      </div>
    `;
    viewDetails.style = `
      padding: 18px 25px;
      z-index: 1000;
      position: fixed;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      backdrop-filter: blur(10px);
      background: hsla(271,73%,44%,1);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      color: white;
      font-weight: 500;
      border-radius: 10px;
      max-width: 90%;
      min-width: 280px;
      text-align: center;
    `;
    document.body.appendChild(viewDetails);

    document.getElementById("yes-btn").addEventListener("click", () => {
      window.location.href = `event-details.html?event=${encodeURIComponent(name)}`;
    });
    document.getElementById("no-btn").addEventListener("click", () => {
      document.getElementById("eventForm").reset();
      viewDetails.remove();
    });
  });
});

document.getElementById("filterType").addEventListener("change", function () {
  const selected = this.value;
  if (selected === "All") {
    renderMarkers(events);
  } else {
    const filtered = events.filter((e) => e.type === selected);
    renderMarkers(filtered);
  }
});

document.getElementById("locateBtn").addEventListener("click", function () {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      map.setView([userLat, userLng], 14);

      const nearbyEvents = events.filter((e) => {
        const distance = getDistance(userLat, userLng, e.lat, e.lng);
        return distance <= 2; // within 2km
      });

      renderMarkers(nearbyEvents);
      alert(`Found ${nearbyEvents.length} nearby events within 2km.`);
    },
    () => {
      alert("Unable to retrieve your location.");
    }
  );
});

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
