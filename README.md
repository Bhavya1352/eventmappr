# 🗺 EventMappr 

**EventMappr** is a lightweight, open-source community event mapping web app. Users can discover, add, and explore local events pinned on an interactive map.
Interactive, frontend‑only web app for discovering and cataloging community events on a map.

<p align="center">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT">
  </a>
  <a href="https://github.com/Bhavya1352/eventmappr/stargazers">
    <img src="https://img.shields.io/github/stars/Bhavya1352/eventmappr?style=social" alt="GitHub stars">
  </a>
  <a href="https://github.com/Bhavya1352/eventmappr/fork">
    <img src="https://img.shields.io/github/forks/Bhavya1352/eventmappr?style=social" alt="GitHub forks">
  </a>
  <a href="https://github.com/Bhavya1352/eventmappr/issues">
    <img src="https://img.shields.io/github/issues/Bhavya1352/eventmappr" alt="Open Issues">
  </a>
  <a href="https://github.com/Bhavya1352/eventmappr/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Bhavya1352/eventmappr" alt="Contributors">
  </a>
  <a href="https://github.com/Bhavya1352/eventmappr/commits/main">

  </a>
</p>


Live demo: **https://eventmappr.vercel.app/**

---

## 🚀 Features

- 🗺️ **Add events to map** – Click anywhere to drop a pin and add title, category, date/time, and organizer info  
- 🧭 **Find Nearby** – Centers the map on your current location using the Geolocation API  
- 🎛️ **Filter events** – Narrow down events by category (🎵 Music, 💻 Tech, 🤝 Volunteering, 🛍️ Market, 🎨 Art)  
- 💾 **Persistent storage** – Uses `localStorage` so your events remain across browser sessions  
- 📱 **Interactive UI** – Responsive layout with popups, animations, and dynamic filtering  
- 📄 **NEW: Detailed event pages** - Click on any marker to view comprehensive event information
- 💾 **NEW: Persistent storage** - Events are saved locally and persist across sessions
- 🗺️ **NEW: Mini maps** - Each event page includes a map showing the exact location
- ☁️ **NEW: Weather Planner** - Users can check 5-day weather forecasts for any city to help plan suitable dates for events
- 📸 **NEW: Event Gallery** - A dedicated page displaying user-shared images from past events, fostering community engagement
- 💡 **NEW: Suggest an Event** – Share your ideas to shape upcoming community experiences right from your browser!

---

## 📱 How to Use

1. **View Events**: Open the app to see events marked on the map
2. **Click Markers**: Click on any event marker to view detailed information
3. **Add Events**: Fill out the form and click on the map to add new events
4. **Find Nearby**: Use the "Find Nearby" button to locate events close to you
5. **View Details**: Each event has a dedicated page with:
   - Event description and details
   - Location information with coordinates
   - Mini map showing exact location
   - Organizer and contact information
   - Date and time details

---

## 🛠️ Tech Stack
 **HTML5 & CSS3** – semantic markup and responsive design  
- **Vanilla JavaScript** – app logic, map interactivity, and data handling  
- **[Leaflet.js](https://leafletjs.com/)** – open-source mapping library  
- **OpenStreetMap** – free map tile provider  
- **localStorage** – lightweight, in-browser persistence  

---

## 🧩 Getting Started

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/EventMappr.git
cd EventMappr
```

### 2. Run locally

You can open the app directly in your browser:

```bash
open index.html
```

Or use a live server extension (e.g. in VS Code) for live reloading.

Or use npm:

```bash
npm install
npm start
```
---

📁 Project Structure Overview

```text
Copy
Edit
├── index.html           # Main UI + map + add-event form  
├── event-details.html   # Dedicated event details page  
├── script.js            # Map setup, event logic, storage handlers  
├── event-details.js     # Loads data & renders detail view  
├── style.css            # Global and responsive CSS  
├── package.json         # (Optional) npm meta + scripts  
├── LICENSE.md           # MIT License  
├── CONTRIBUTING.md      # Guidelines for contributing  
└── CODE_OF_CONDUCT.md / SECURITY.md
```

---
## 📌 Usage Guide

1. **View events** — Load the app to see all events pinned on the map

1. **Add event** — Click on map, fill in the form (title, category, datetime, contact), and hit Save

1. **Filter** — Select categories via checkboxes to hide/show specific events

1. **Find nearby** — Click “📍 Find Nearby” to center map at your current position

1. **View details** — Click any marker → opens event-details.html with full info and mini-map

---

## 🧑‍💻 Contributing

We welcome contributions to improve EventMappr!

### 📌 How to Contribute

1. Fork this repository
2. Clone your forked repo:
   ```bash
   git clone https://github.com/your-username/EventMappr.git
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes and commit:
   ```bash
   git commit -m "Add your message here"
   ```
5. Push to your fork and submit a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

### 📋 Contribution Guidelines

- Keep PRs focused and concise
- Use consistent code formatting
- Test features before submitting
- Be respectful and collaborative in reviews

---

## 💡 Feature Ideas & Roadmap

- ✅ Local persistent storage
- ✅ Event detail pages
- ✅ Event time/date input
- 🔜 Map marker clustering
- 🔜 Dark mode toggle
- 🔜 Search bar for event titles/descriptions
- 🔜 Shareable event links
- 🔜 User authentication (e.g., via Firebase)
- 🔜 Category tags and filtering UX improvements

---
## 🙌 Acknowledgements

- [Leaflet.js](https://leafletjs.com) – for the interactive mapping library  
- [OpenStreetMap](https://www.openstreetmap.org) – for free and open map tiles  
- Community inspiration from local engagement and open-source mapping initiatives
---

### 🌟 Awesome Contributors

<a href="https://github.com/Bhavya1352/eventmappr/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Bhavya1352/eventmappr" />
</a>

---
## 📄 License

Released under the [MIT License](LICENSE).

---

> Built with ❤️ by [Bhavya1352](https://github.com/Bhavya1352) and the open-source community.
