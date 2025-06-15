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
  const dynamicEvents = JSON.parse(
    localStorage.getItem("dynamicEvents") || "{}"
  );
  Object.values(dynamicEvents).forEach((event) => {
    // Check if event already exists to avoid duplicates
    const exists = events.find((e) => e.name === event.name);
    if (!exists) {
      events.push(event);
    }
  });
}

// Load dynamic events when page loads
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

    // Create enhanced popup content with better styling
    const popupContent = `
      <div style="
        text-align: center; 
        min-width: 250px; 
        padding: 5px;
        font-family: 'Poppins', sans-serif;
      ">
        <div style="
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 15px;
          border-radius: 15px 15px 0 0;
          margin: -5px -5px 10px -5px;
        ">
          <strong style="font-size: 18px; font-weight: 600;">${event.name
      }</strong>
        </div>
        <div style="padding: 0 10px;">
          <div style="
            display: inline-block;
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 500;
            margin-bottom: 15px;
          ">
            ${event.type}
          </div>
          <div style="font-size: 13px; margin-top: 8px; color: #555;">
  📅 ${event.dateTime || "Not specified"}
</div>

          <br>
          <a href="event-details.html?event=${encodeURIComponent(event.name)}" 
             style="
               background: linear-gradient(135deg, #667eea, #764ba2);
               color: white; 
               padding: 10px 20px; 
               text-decoration: none; 
               border-radius: 25px; 
               font-size: 14px; 
               font-weight: 500;
               display: inline-block; 
               margin-top: 5px; 
               transition: all 0.3s ease;
               box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
             "
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)';"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)';"
          >
            <i class="fas fa-info-circle" style="margin-right: 5px;"></i>
            View Details
          </a
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, {
      maxWidth: 300,
      className: "custom-popup",
    });

    // Remove the automatic redirect - only popup will show
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


  map.once("click", function (event) {
    const { lat, lng } = event.latlng;
    const newEvent = {
      name,
      type,
      lat,
      lng,
      // Add additional details for new events
      description: `A ${type.toLowerCase()} event. More details coming soon!`,
      address: "Location details to be announced",
      dateTime: `${date} ${time}`,
      organizer: "Event Organizer",
      contact: "Contact information to be announced",
      photos: [], // Initialize empty photos array
    };
    events.push(newEvent);

    // Save to localStorage for persistence
    const dynamicEvents = JSON.parse(
      localStorage.getItem("dynamicEvents") || "{}"
    );
    dynamicEvents[name] = newEvent;
    localStorage.setItem("dynamicEvents", JSON.stringify(dynamicEvents));

    renderMarkers(events);

    //popup for confirmation of event added successfully
    const toast = document.createElement("div");
    toast.textContent = "🎉 Event added successfully!";
    toast.style.position = "fixed";
    toast.style.bottom = "40px";
    toast.style.left = "80%";
    toast.style.transform = "translateX(-50%) translateY(30px)";
    toast.style.padding = "12px 24px";
    toast.style.background = "linear-gradient(135deg, #5b2be0, #ae31d9)";
    toast.style.color = "#fff";
    toast.style.fontWeight = "600";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.3)";
    toast.style.backdropFilter = "blur(10px)";
    toast.style.opacity = "0";
    toast.style.zIndex = "9999";
    toast.style.transition =
      "opacity 0.5s ease, transform 0.5s  ease";
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = " translate(-50%) translateY(0)";
    });
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(100px)";
      setTimeout(() => toast.remove(), 1000);
    }, 4000);

    // Show success message with option to view details
    const viewDetails = document.createElement("div");
    viewDetails.style.padding = "18px 25px";
    viewDetails.style.zIndex = "1000";
    viewDetails.style.position = "fixed";
    viewDetails.style.top = "100px";
    viewDetails.style.left = "50%";
    viewDetails.style.transform = "translateX(-50%)";
    viewDetails.style.backdropFilter = "blur(10px)";
    viewDetails.style.backgroundColor = "hsla(271,73%,44%,1)";
    viewDetails.style.backgroundImage = `
  radial-gradient(at 40% 40%, hsla(277, 80%, 50%, 0.5) 0px, transparent 60%),
  radial-gradient(at 10% 20%, hsla(268, 100%, 45%, 0.5) 0px, transparent 55%),
  radial-gradient(at 90% 85%, hsla(222, 100%, 50%, 0.5) 0px, transparent 60%)
`;

    viewDetails.style.border = "1px solid rgba(255, 255, 255, 0.3)";
    viewDetails.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
    viewDetails.style.color = "#fff";
    viewDetails.style.fontWeight = "500";
    viewDetails.style.borderRadius = "10px";
    viewDetails.style.maxWidth = "90%";
    viewDetails.style.minWidth = "280px";
    viewDetails.style.textAlign = "center";
    viewDetails.innerHTML = `
    <p style="margin-bottom:12px">Event added successfully!<br> Would you like to view the event details and add photos?
    <div style="display:flex;justify-content:center;gap:12px">
    <button id="yes-btn" style="padding:8px 16px;background:linear-gradient(135deg,rgb(241, 79, 253),rgb(97, 0, 166));border:none;border-radius:6px;color:white;cursor:pointer;font-weight:600;  box-shadow: 0 4px 10px rgba(241, 79, 253, 0.35), 0 0 10px rgba(97, 0, 166, 0.4);transition: transform 0.2s ease, box-shadow 0.3s ease;">YES</button>

    <button id="no-btn" style="padding:8px 16px;background: linear-gradient(135deg,rgb(76, 0, 229),rgb(37, 2, 48)); border:none;border-radius:6px;color:white;cursor:pointer;font-weight:600;  box-shadow: 0 4px 10px rgba(76, 0, 229, 0.35), 0 0 10px rgba(37, 2, 48, 0.5);transition: transform 0.2s ease, box-shadow 0.3s ease;">NO</button>
    </div>
    </p>
    `;
    document.body.appendChild(viewDetails);
    document.getElementById("yes-btn").addEventListener("click", () => {
      window.location.href = `event-details.html?event=${encodeURIComponent(
        name
      )}`;
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
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
