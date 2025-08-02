<h1 align="center"> 🗺 EventMappr</h1> 

**EventMappr** is a lightweight, open-source community event mapping web app. Users can discover, add, and explore local events pinned on an interactive map.
Interactive, frontend web app for discovering and cataloging community events on a map.

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

<p align="center">
<a href="https://eventmappr.vercel.app/"><strong>🚀 Live Demo</strong></a>
[🔝 Back to Top](#-eventmappr)

---

<details>
  <summary><strong>📑 Table of Contents</strong></summary>

  - [🚀 Features](#-features)
  - [📱 How to Use](#-how-to-use)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development](#development)
    - [Building for Production](#building-for-production)
  - [📜 Available Scripts](#-available-scripts)
  - [📁 Project Structure Overview](#-project-structure-overview)
  - [📌 Usage Guide](#-usage-guide)
  - [🧑‍💻 Contributing](#-contributing)
    - [📌 How to Contribute](#-how-to-contribute)
    - [📋 Contribution Guidelines](#-contribution-guidelines)
  - [💡 Feature Ideas & Roadmap](#-feature-ideas--roadmap)
  - [🙌 Acknowledgements](#-acknowledgements)
  - [🌟 Awesome Contributors](#-awesome-contributors)
  - [📄 License](#-license)

  </details>
  [🔝 Back to Top](#-eventmappr)

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
- 🔄 **NEW: Modular Routing** - Enhanced navigation with react-router-dom for better user experience
- [🔝 Back to Top](#-eventmappr)

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
   - [🔝 Back to Top](#-eventmappr)

---

## 🛠️ Tech Stack
- **Next.js** - React framework for production-grade applications
- **React** - Modern UI library for component-based architecture
- **React Router DOM** - Declarative routing for React applications
- **React Leaflet** - React components for Leaflet maps
- **HTML5 & CSS3** – Semantic markup and responsive design  
- **Leaflet.js** – Open-source mapping library  
- **OpenStreetMap** – Free map tile provider  
- **localStorage** – Lightweight, in-browser persistence
- [🔝 Back to Top](#-eventmappr)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/eventmappr.git
cd eventmappr
```

2. Install dependencies
```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

The application will open in your default browser at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```
[🔝 Back to Top](#-eventmappr)
---

## 📜 Available Scripts

- `npm run dev` - Starts the development server on port 3000
- `npm run build` - Creates a production build
- `npm start` - Starts the production server
- `npm run lint` - Runs ESLint to check code quality
- `npm run clean` - Cleans build artifacts
[🔝 Back to Top](#-eventmappr)
---

## 📁 Project Structure Overview

```text
├── components/          # React components
│   ├── layout/          # Layout components (Navbar, etc.)
│   ├── sections/        # Page section components
│   └── ui/              # Reusable UI components
├── pages/               # Next.js pages
│   ├── _app.js          # Custom App component
│   ├── _document.js     # Custom Document component
│   ├── index.js         # Home page
│   ├── explore.js       # Explore page
│   └── auth.js          # Authentication page
├── public/              # Static assets
│   └── images/          # Image assets
├── styles/              # CSS files
├── utils/               # Utility functions
│   └── router.js        # React Router DOM integration utilities
├── next.config.js       # Next.js configuration
└── package.json         # Project dependencies and scripts
```
[🔝 Back to Top](#-eventmappr)
---

## 📌 Usage Guide

1. **View events** — Load the app to see all events pinned on the map

2. **Add event** — Click on map, fill in the form (title, category, datetime, contact), and hit Save

3. **Filter** — Select categories via checkboxes to hide/show specific events

4. **Find nearby** — Click "📍 Find Nearby" to center map at your current position

5. **View details** — Click any marker to view full event information
[🔝 Back to Top](#-eventmappr)
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
[🔝 Back to Top](#-eventmappr)
---

## 💡 Feature Ideas & Roadmap

- ✅ Local persistent storage
- ✅ Event detail pages
- ✅ Event time/date input
- ✅ React component architecture
- ✅ Next.js migration
- ✅ React Router integration
- 🔜 Map marker clustering
- 🔜 Dark mode toggle
- 🔜 Search bar for event titles/descriptions
- 🔜 Shareable event links
- 🔜 User authentication (e.g., via Firebase)
- 🔜 Category tags and filtering UX improvements
[🔝 Back to Top](#-eventmappr)
---
## 🙌 Acknowledgements

- [Next.js](https://nextjs.org) - for the React framework
- [React Router DOM](https://reactrouter.com) - for declarative routing
- [React Leaflet](https://react-leaflet.js.org) - for React components for Leaflet maps
- [Leaflet.js](https://leafletjs.com) – for the interactive mapping library  
- [OpenStreetMap](https://www.openstreetmap.org) – for free and open map tiles  
- [React](https://reactjs.org) - for the UI component library
- Community inspiration from local engagement and open-source mapping initiatives
- [🔝 Back to Top](#-eventmappr)
---

## 🌟 Awesome Contributors

<a href="https://github.com/Bhavya1352/eventmappr/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Bhavya1352/eventmappr" />
</a>

---
## 📄 License

Released under the [MIT License](LICENSE).

---

> Built with ❤️ by [Bhavya1352](https://github.com/Bhavya1352) and the open-source community.
>
> [🔝 Back to Top](#-eventmappr)

---
