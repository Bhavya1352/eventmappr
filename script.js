console.log("script.js loaded");
const events = [{
        name: "Community Cleanup",
        type: "Volunteering",
        lat: 28.604047,
        lng: 77.227003,
    },
    { name: "Local Music Night", type: "Music", lat: 28.626646, lng: 77.190096 },
    { name: "Tech Meetup", type: "Technology", lat: 28.613999, lng: 77.226603 },
    { name: "Farmers Market", type: "Market", lat: 28.616373, lng: 77.204582 },
    { name: "Art & Craft Fair", type: "Art", lat: 28.601078, lng: 77.208121 },
    { name: "Startup Showcase Pune", type: "Technology", lat: 18.5204, lng: 73.8567 },
    { name: "Pune Food Carnival", type: "Food", lat: 18.5293, lng: 73.8560 },
    { name: "Live Music Pune", type: "Music", lat: 18.5246, lng: 73.8553 },
    { name: "Volunteer Day Pune", type: "Volunteering", lat: 18.5167, lng: 73.8562 },
];

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

// Function to save map position
function saveMapPosition() {
    const position = {
        lat: map.getCenter().lat,
        lng: map.getCenter().lng,
        zoom: map.getZoom()
    };
    localStorage.setItem('mapPosition', JSON.stringify(position));
}

// Function to get saved map position
function getSavedMapPosition() {
    const saved = localStorage.getItem('mapPosition');
    if (saved) {
        return JSON.parse(saved);
    }
    // Default position (Delhi)
    return { lat: 28.6139, lng: 77.209, zoom: 13 };
}

// Get saved position or use default
const savedPosition = getSavedMapPosition();

// Initialize map with saved position
let map = L.map("map").setView([savedPosition.lat, savedPosition.lng], savedPosition.zoom);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Save position when map moves
map.on('moveend', saveMapPosition);

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
          <a href="event-details.html?event=${encodeURIComponent(event.name)}" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 10px 20px; text-decoration: none; border-radius: 25px; font-size: 14px; font-weight: 500; display: inline-block; margin-top: 5px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            <i class="fas fa-info-circle" style="margin-right: 5px;"></i> View Details
          </a>
        </div>
      </div>
    `;

        marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: "custom-popup",
        });

        if (event.type) {
            const prefs = JSON.parse(localStorage.getItem("eventPreferences") || "{}");
            prefs[event.type] = (prefs[event.type] || 0) + 1;
            localStorage.setItem("eventPreferences", JSON.stringify(prefs));
        }
    });
}

renderMarkers(events);

function checkAuth() {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            resolve(user);
        });
    });
}

document.getElementById("eventForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const user = await checkAuth();
    if (!user) {
        const loginPrompt = document.createElement("div");
        loginPrompt.style.padding = "18px 25px";
        loginPrompt.style.zIndex = "1000";
        loginPrompt.style.position = "fixed";
        loginPrompt.style.top = "50%";
        loginPrompt.style.left = "50%";
        loginPrompt.style.transform = "translate(-50%, -50%)";
        loginPrompt.style.backdropFilter = "blur(10px)";
        loginPrompt.style.backgroundColor = "hsla(271,73%,44%,1)";
        loginPrompt.style.backgroundImage = `
            radial-gradient(at 40% 40%, hsla(277, 80%, 50%, 0.5) 0px, transparent 60%),
            radial-gradient(at 10% 20%, hsla(268, 100%, 45%, 0.5) 0px, transparent 55%),
            radial-gradient(at 90% 85%, hsla(222, 100%, 50%, 0.5) 0px, transparent 60%)
        `;
        loginPrompt.style.border = "1px solid rgba(255, 255, 255, 0.3)";
        loginPrompt.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
        loginPrompt.style.color = "#fff";
        loginPrompt.style.fontWeight = "500";
        loginPrompt.style.borderRadius = "10px";
        loginPrompt.style.maxWidth = "90%";
        loginPrompt.style.minWidth = "280px";
        loginPrompt.style.textAlign = "center";
        loginPrompt.innerHTML = `
            <p style="margin-bottom:12px">Please sign in to add events</p>
            <div style="display:flex;justify-content:center;gap:12px">
                <a href="auth.html" style="padding:8px 16px;background:linear-gradient(135deg,rgb(241, 79, 253),rgb(97, 0, 166));border:none;border-radius:6px;color:white;cursor:pointer;font-weight:600;text-decoration:none;box-shadow: 0 4px 10px rgba(241, 79, 253, 0.35), 0 0 10px rgba(97, 0, 166, 0.4);transition: transform 0.2s ease, box-shadow 0.3s ease;">Sign In</a>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding:8px 16px;background: linear-gradient(135deg,rgb(76, 0, 229),rgb(37, 2, 48)); border:none;border-radius:6px;color:white;cursor:pointer;font-weight:600;box-shadow: 0 4px 10px rgba(76, 0, 229, 0.35), 0 0 10px rgba(37, 2, 48, 0.5);transition: transform 0.2s ease, box-shadow 0.3s ease;">Cancel</button>
            </div>
        `;
        document.body.appendChild(loginPrompt);
        return;
    }

    const controls = document.querySelector(".controls");
    const name = document.getElementById("eventName").value;
    const type = document.getElementById("eventType").value;
    const locationmsg = document.createElement("div");
    locationmsg.style.padding = "12px 24px";
    locationmsg.textContent =
        "📍 Now click on the map to select the event location.";
    locationmsg.style.background =
        "linear-gradient(135deg, rgba(21, 21, 65, 0.85), rgba(52, 12, 87, 0.7))";
    locationmsg.style.zIndex = "1000";
    locationmsg.style.position = "fixed";
    locationmsg.style.top = "100px";
    locationmsg.style.left = "50%";
    locationmsg.style.transform = "translateX(-50%)";
    locationmsg.style.backdropFilter = "blur(12px)";
    locationmsg.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    locationmsg.style.boxShadow = "0 8px 22px rgba(0, 0, 0, 0.4)";
    locationmsg.style.color = "#e4d4ff";
    locationmsg.style.fontWeight = "500";
    locationmsg.style.opacity = "1";
    locationmsg.style.transition = "opacity 1s ease-in-out all";
    locationmsg.style.borderRadius = "8px";
    locationmsg.style.overflow = "hidden";
    const progeressBar = document.createElement("div");
    progeressBar.style.position = "absolute";
    progeressBar.style.bottom = "0";
    progeressBar.style.left = "0";
    progeressBar.style.height = "4px";
    progeressBar.style.background = "linear-gradient(90deg, #a64eff, #da5cff)";
    progeressBar.style.width = "100%";
    progeressBar.style.animation = "shrink 4s linear backwards";
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes shrink{
    from{width:100%;}
    to{width:0;}
    }
    `;
    document.head.appendChild(style);
    locationmsg.appendChild(progeressBar);
    controls.appendChild(locationmsg);
    setTimeout(() => {
        locationmsg.style.opacity = "0";
        locationmsg.remove();
    }, 4000);

    map.once("click", function(event) {
        const { lat, lng } = event.latlng;
        const newEvent = {
            name,
            type,
            lat,
            lng,
            description: `A ${type.toLowerCase()} event. More details coming soon!`,
            address: "Location details to be announced",
            dateTime: "Date and time to be announced",
            organizer: "Event Organizer",
            contact: "Contact information to be announced",
            photos: [], // Initialize empty photos array
        };
        events.push(newEvent);

        const dynamicEvents = JSON.parse(
            localStorage.getItem("dynamicEvents") || "{}"
        );
        dynamicEvents[name] = newEvent;
        localStorage.setItem("dynamicEvents", JSON.stringify(dynamicEvents));

        renderMarkers(events);

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

const locateBtn = document.getElementById('locateBtn');
locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) return alert('Not supported.');
    locateBtn.textContent = 'Locating...';

    navigator.geolocation.getCurrentPosition(
        pos => {
            const { latitude, longitude } = pos.coords;
            map.setView([latitude, longitude], 13);
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup('You are here!').openPopup();
            locateBtn.textContent = 'Find Nearby 📍';
        },
        () => {
            alert('Could not locate.');
            locateBtn.textContent = 'Find Nearby 📍';
        }
    );
});

window.addEventListener('load', () => {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const now = new Date();
    const valid = events.filter(ev => new Date(`${ev.date}T${ev.time}`) >= now);
    localStorage.setItem('events', JSON.stringify(valid));

    valid.forEach(ev => {
        L.marker([ev.lat, ev.lng]).addTo(map)
            .bindPopup(`<strong>${ev.name}</strong><br>Type: ${ev.type}<br>Date: ${ev.date} ${ev.time}<br>Location: ${ev.address}`);
    });
});

const themeToggleBtn = document.getElementById('themeToggleBtn');

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggleBtn.textContent = '☀️';
}

themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  if (isDark) {
    localStorage.setItem('theme', 'dark');
    themeToggleBtn.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    themeToggleBtn.textContent = '🌙';
  }
});

firebase.auth().onAuthStateChanged((user) => {
    const eventForm = document.getElementById("eventForm");
    const authStatus = document.getElementById("authStatus");
    
    if (user) {
        if (eventForm) eventForm.style.display = "flex";
        if (authStatus) authStatus.style.display = "none";
    } else {
        if (eventForm) eventForm.style.display = "none";
        if (authStatus) authStatus.style.display = "block";
    }
});
