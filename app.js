const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const statusMsg = document.getElementById('status-msg');
const weatherCard = document.getElementById('weather-card');

const cityNameEl = document.getElementById('city-name');
const weatherDescEl = document.getElementById('weather-desc');
const tempValEl = document.getElementById('temp-val');
const feelsLikeEl = document.getElementById('feels-like');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');
const pressureEl = document.getElementById('pressure');
const aqiBadge = document.getElementById('aqi-badge');
const aqiAdvice = document.getElementById('aqi-health-advice');

// Helper to show status
function showStatus(text, type) {
  statusMsg.textContent = text;
  statusMsg.className = `status-msg ${type}`;
}

function clearStatus() {
  statusMsg.className = 'status-msg hidden';
}

// Convert Open-Meteo weather code to readable text
function interpretWeatherCode(code) {
  if (code === 0) return 'Clear Sky';
  if ([1, 2, 3].includes(code)) return 'Partly Cloudy';
  if ([45, 48].includes(code)) return 'Foggy / Haze';
  if ([51, 53, 55, 61, 63, 65].includes(code)) return 'Rainy';
  if ([71, 73, 75].includes(code)) return 'Snowfall';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Overcast';
}

// Map European AQI index to health status
function interpretAQI(aqi) {
  if (aqi <= 20) {
    return { label: 'Good', class: 'good', advice: 'Air quality is excellent. Ideal for outdoor activities.' };
  } else if (aqi <= 40) {
    return { label: 'Moderate', class: 'moderate', advice: 'Air quality is acceptable for healthy individuals.' };
  } else if (aqi <= 60) {
    return { label: 'Poor', class: 'poor', advice: 'Sensitive groups should reduce prolonged outdoor exertion.' };
  } else {
    return { label: 'Very Poor', class: 'very-poor', advice: 'Health alert: increased risk of respiratory irritation.' };
  }
}

// Main Fetch Function
async function fetchWeatherData(city) {
  try {
    showStatus(`Fetching live telemetry for ${city}...`, 'loading');
    weatherCard.classList.add('hidden');

    // 1. Geocoding API: Get Latitude & Longitude from City Name
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found. Please verify the spelling.');
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Weather & Air Quality API call concurrently
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,wind_speed_10m,weather_code`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi`)
    ]);

    const weatherData = await weatherRes.json();
    const aqiData = await aqiRes.json();

    // 3. Render Data to UI
    cityNameEl.textContent = `${name}, ${country || ''}`;
    weatherDescEl.textContent = interpretWeatherCode(weatherData.current.weather_code);
    tempValEl.textContent = Math.round(weatherData.current.temperature_2m);
    feelsLikeEl.textContent = `${Math.round(weatherData.current.apparent_temperature)}°C`;
    humidityEl.textContent = `${weatherData.current.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${weatherData.current.wind_speed_10m} km/h`;
    pressureEl.textContent = `${Math.round(weatherData.current.surface_pressure)} hPa`;

    // AQI rendering
    const aqiVal = aqiData.current ? aqiData.current.european_aqi : 25;
    const aqiInfo = interpretAQI(aqiVal);
    aqiBadge.textContent = aqiInfo.label;
    aqiBadge.className = `aqi-badge ${aqiInfo.class}`;
    aqiAdvice.textContent = aqiInfo.advice;

    clearStatus();
    weatherCard.classList.remove('hidden');

  } catch (error) {
    showStatus(error.message || 'Unable to fetch weather data.', 'error');
  }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeatherData(city);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) fetchWeatherData(city);
  }
});

// Default Load
fetchWeatherData('Delhi');