# 🌤️ AirScope - Real-Time Weather & Air Quality Dashboard

A responsive and lightweight telemetry dashboard that fetches and renders real-time weather metrics alongside Air Quality Index (AQI) data for cities worldwide.

---

## 🚀 Live Demo
🔗 **[View Live Project](https://shahwar-alijafri.github.io/weather-check-dashboard/)**
---

## ✨ Features
- **Live Weather Telemetry:** Real-time extraction of temperature, apparent feels-like reading, relative humidity, wind velocity, and surface pressure.
- **Air Quality Monitoring:** Integrated European AQI calculation with dynamic color-coded health advisories.
- **Concurrent API Requests:** Uses `Promise.all` for parallel fetching of geospatial coordinates, meteorological data, and atmospheric quality metrics.
- **Dynamic State Management:** Handles user input, asynchronous loading indicators, and graceful error handling for invalid queries.
- **Modern UI/UX:** Styled using a frosted-glass (glassmorphism) responsive layout optimized for mobile and desktop viewports.

---

## 🛠️ Tech Stack
- **Frontend:** Semantic HTML5, Modern CSS3 (Flexbox & CSS Grid)
- **Logic:** Vanilla JavaScript (ES6+, Async/Await, Fetch API)
- **Data Source:** [Open-Meteo APIs](https://open-meteo.com/) (Geocoding, Forecast, and Air Quality Endpoints)

---

## 📂 Project Structure
```text
weather-aqi-dashboard/
│-- index.html      # DOM structure and component layout
│-- style.css       # Glassmorphism styling and responsive states
│-- app.js          # API calls, error parsing, and UI updates
│-- README.md       # Project documentation