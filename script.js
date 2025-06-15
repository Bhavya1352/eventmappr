// ---------- Shared Event Data ----------
const events = [
    { name: "Community Cleanup", type: "Volunteering", lat: 28.604047, lng: 77.227003 },
    { name: "Local Music Night", type: "Music", lat: 28.626646, lng: 77.190096 },
    { name: "Tech Meetup", type: "Technology", lat: 28.613999, lng: 77.226603 },
    { name: "Farmers Market", type: "Market", lat: 28.616373, lng: 77.204582 },
    { name: "Art & Craft Fair", type: "Art", lat: 28.601078, lng: 77.208121 },
];

// ---------- Map Page Logic ----------
if (document.getElementById("map")) {
    let map = L.map("map").setView([28.6139, 77.2090], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);

    function renderMarkers(filteredEvents) {
        markerGroup.clearLayers();
        filteredEvents.forEach(event => {
            L.marker([event.lat, event.lng])
                .addTo(markerGroup)
                .bindPopup(`<strong>${event.name}</strong><br>Type: ${event.type}`);
        });
    }

    renderMarkers(events);

    document.getElementById("eventForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("eventName").value;
        const type = document.getElementById("eventType").value;

        map.once("click", function(event) {
            const { lat, lng } = event.latlng;
            const newEvent = { name, type, lat, lng };
            events.push(newEvent);
            renderMarkers(events);
            alert("Event added at clicked location!");
            document.getElementById("eventForm").reset();
        });

        alert("Now click on the map to place your event.");
    });

    document.getElementById("filterType").addEventListener("change", function() {
        const selected = this.value;
        if (selected === "All") {
            renderMarkers(events);
        } else {
            const filtered = events.filter(e => e.type === selected);
            renderMarkers(filtered);
        }
    });

    document.getElementById("locateBtn").addEventListener("click", function() {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                map.setView([userLat, userLng], 14);

                const nearbyEvents = events.filter(e => {
                    const distance = getDistance(userLat, userLng, e.lat, e.lng);
                    return distance <= 2;
                });

                renderMarkers(nearbyEvents);
                alert(`Found ${nearbyEvents.length} nearby events within 2km.`);
            },
            () => {
                alert("Unable to retrieve your location.");
            }
        );
    });
}

// ---------- Event List Page Logic ----------
if (document.getElementById("eventList")) {
    function renderEventList(eventsToRender) {
        const ul = document.getElementById("eventList");
        ul.innerHTML = "";

        eventsToRender.forEach(e => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${e.name}</strong> – ${e.type}<br>
        <small>📍 Lat: ${e.lat.toFixed(4)}, Lng: ${e.lng.toFixed(4)}</small>`;
            ul.appendChild(li);
        });
    }

    renderEventList(events);

    document.getElementById("sortOption").addEventListener("change", function() {
        if (this.value === "location") {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported.");
                return;
            }

            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;

                const sorted = [...events].sort((a, b) => {
                    return getDistance(latitude, longitude, a.lat, a.lng) -
                        getDistance(latitude, longitude, b.lat, b.lng);
                });

                renderEventList(sorted);
            }, () => {
                alert("Unable to access location.");
            });
        } else {
            renderEventList(events);
        }
    });
}

// ---------- Utility Functions ----------
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}