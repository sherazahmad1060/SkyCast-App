/**
 * SkyCast — Core Observatory Controller & Application Engine
 * Orchestrates UI interactions, live telemetry feeds, GPS mapping, and state synchronization.
 */

// Global State
const observatoryState = {
  isCelsius: true,
  windKmH: true,
  activeCondition: 'clear-day',
  activeCityIndex: 0,
  radarPlaying: true,
  themeMode: localStorage.getItem('skycast_theme_mode') || 'dark',
  pinnedCities: JSON.parse(localStorage.getItem('skycast_pinned_cities') || '[]'),
  cities: [
    {
      name: "London",
      country: "United Kingdom",
      countryCode: "GB",
      flag: "🇬🇧",
      station: "OBS-LON-51",
      tz: "GMT+1",
      lat: 51.5074,
      lon: -0.1278,
      tempC: 19,
      highC: 22,
      lowC: 13,
      feelsLikeC: 18,
      condition: "Scattered Cirrus Clouds",
      conditionType: "clear-day",
      summary: "Mild western breeze with stable barometric trends over Thames Estuary.",
      precipRisk: "12%",
      windSpeed: 18,
      windDir: "NW (315°)",
      windAngle: 315,
      windGusts: 26,
      uv: 4.2,
      uvLabel: "Moderate",
      humidity: 68,
      dewPoint: 12,
      pressure: 1016,
      visibility: 10.0,
      aqi: 28,
      rainAcc: 0.4,
      sunrise: "06:24",
      sunset: "18:08",
      hourly: [
        { t: "12:00", temp: 18, p: 5, icon: "sunny" },
        { t: "13:00", temp: 20, p: 5, icon: "sunny" },
        { t: "14:00", temp: 21, p: 10, icon: "partly_cloudy_day", active: true },
        { t: "15:00", temp: 22, p: 15, icon: "partly_cloudy_day" },
        { t: "16:00", temp: 21, p: 20, icon: "cloud" },
        { t: "17:00", temp: 19, p: 25, icon: "cloud" },
        { t: "18:00", temp: 18, p: 10, icon: "partly_cloudy_day" },
        { t: "19:00", temp: 16, p: 10, icon: "clear_night" },
        { t: "20:00", temp: 15, p: 5, icon: "clear_night" },
        { t: "21:00", temp: 14, p: 5, icon: "clear_night" },
        { t: "22:00", temp: 14, p: 5, icon: "bedtime" },
        { t: "23:00", temp: 13, p: 5, icon: "bedtime" },
        { t: "00:00", temp: 13, p: 5, icon: "bedtime" }
      ],
      weekly: [
        { day: "Today", icon: "partly_cloudy_day", desc: "Scattered Clouds", min: 13, max: 22, p: 12 },
        { day: "Fri", icon: "sunny", desc: "Clear & Crisp", min: 14, max: 24, p: 5 },
        { day: "Sat", icon: "rainy", desc: "Afternoon Showers", min: 15, max: 20, p: 65 },
        { day: "Sun", icon: "thunderstorm", desc: "Frontal Squall", min: 12, max: 18, p: 80 },
        { day: "Mon", icon: "cloud", desc: "Overcast Cool", min: 11, max: 17, p: 20 },
        { day: "Tue", icon: "partly_cloudy_day", desc: "Mild Clearing", min: 12, max: 19, p: 10 },
        { day: "Wed", icon: "sunny", desc: "High Pressure Ridge", min: 13, max: 23, p: 0 }
      ]
    },
    {
      name: "Tokyo",
      country: "Japan",
      countryCode: "JP",
      flag: "🇯🇵",
      station: "OBS-TYO-35",
      tz: "JST (UTC+9)",
      lat: 35.6762,
      lon: 139.6503,
      tempC: 24,
      highC: 27,
      lowC: 19,
      feelsLikeC: 25,
      condition: "Humid Coastal Breeze",
      conditionType: "clear-day",
      summary: "Warm sea winds channeling through Tokyo Bay; clear visibility across Kanto plain.",
      precipRisk: "8%",
      windSpeed: 14,
      windDir: "SSW (200°)",
      windAngle: 200,
      windGusts: 21,
      uv: 6.8,
      uvLabel: "High",
      humidity: 74,
      dewPoint: 19,
      pressure: 1012,
      visibility: 9.5,
      aqi: 34,
      rainAcc: 0.0,
      sunrise: "05:42",
      sunset: "17:15",
      hourly: [
        { t: "12:00", temp: 23, p: 0, icon: "sunny" },
        { t: "13:00", temp: 25, p: 5, icon: "sunny" },
        { t: "14:00", temp: 26, p: 5, icon: "sunny", active: true },
        { t: "15:00", temp: 27, p: 10, icon: "partly_cloudy_day" },
        { t: "16:00", temp: 25, p: 15, icon: "partly_cloudy_day" },
        { t: "17:00", temp: 23, p: 10, icon: "partly_cloudy_day" },
        { t: "18:00", temp: 22, p: 5, icon: "clear_night" },
        { t: "19:00", temp: 21, p: 5, icon: "clear_night" },
        { t: "20:00", temp: 20, p: 5, icon: "clear_night" },
        { t: "21:00", temp: 20, p: 0, icon: "bedtime" },
        { t: "22:00", temp: 19, p: 0, icon: "bedtime" },
        { t: "23:00", temp: 19, p: 0, icon: "bedtime" },
        { t: "00:00", temp: 18, p: 0, icon: "bedtime" }
      ],
      weekly: [
        { day: "Today", icon: "sunny", desc: "Warm & Sunny", min: 19, max: 27, p: 8 },
        { day: "Fri", icon: "sunny", desc: "Clear Blue Sky", min: 20, max: 28, p: 5 },
        { day: "Sat", icon: "partly_cloudy_day", desc: "Hazy Sunshine", min: 18, max: 26, p: 15 },
        { day: "Sun", icon: "rainy", desc: "Pacific Low Rain", min: 17, max: 22, p: 75 },
        { day: "Mon", icon: "rainy", desc: "Steady Showers", min: 16, max: 21, p: 60 },
        { day: "Tue", icon: "sunny", desc: "Post-front Clear", min: 17, max: 25, p: 10 },
        { day: "Wed", icon: "partly_cloudy_day", desc: "Autumn Warmth", min: 18, max: 26, p: 10 }
      ]
    },
    {
      name: "New York",
      country: "United States",
      countryCode: "US",
      flag: "🇺🇸",
      station: "OBS-NYC-40",
      tz: "EDT (UTC-4)",
      lat: 40.7128,
      lon: -74.0060,
      tempC: 16,
      highC: 18,
      lowC: 10,
      feelsLikeC: 15,
      condition: "Crisp Autumn Sky",
      conditionType: "clear-day",
      summary: "Brisk northwest Canadian airflow dropping relative dew concentrations across Manhattan.",
      precipRisk: "5%",
      windSpeed: 24,
      windDir: "WNW (290°)",
      windAngle: 290,
      windGusts: 36,
      uv: 3.5,
      uvLabel: "Moderate",
      humidity: 48,
      dewPoint: 5,
      pressure: 1022,
      visibility: 10.0,
      aqi: 22,
      rainAcc: 0.0,
      sunrise: "07:11",
      sunset: "18:02",
      hourly: [
        { t: "12:00", temp: 15, p: 0, icon: "sunny" },
        { t: "13:00", temp: 17, p: 0, icon: "sunny" },
        { t: "14:00", temp: 18, p: 0, icon: "sunny", active: true },
        { t: "15:00", temp: 18, p: 0, icon: "sunny" },
        { t: "16:00", temp: 17, p: 5, icon: "partly_cloudy_day" },
        { t: "17:00", temp: 15, p: 5, icon: "partly_cloudy_day" },
        { t: "18:00", temp: 13, p: 0, icon: "clear_night" },
        { t: "19:00", temp: 12, p: 0, icon: "clear_night" },
        { t: "20:00", temp: 11, p: 0, icon: "clear_night" },
        { t: "21:00", temp: 11, p: 0, icon: "bedtime" },
        { t: "22:00", temp: 10, p: 0, icon: "bedtime" },
        { t: "23:00", temp: 10, p: 0, icon: "bedtime" },
        { t: "00:00", temp: 9, p: 0, icon: "bedtime" }
      ],
      weekly: [
        { day: "Today", icon: "sunny", desc: "Brisk & Bright", min: 10, max: 18, p: 5 },
        { day: "Fri", icon: "cloud", desc: "Increasing Clouds", min: 11, max: 19, p: 20 },
        { day: "Sat", icon: "rainy", desc: "Nor'easter Rain", min: 9, max: 14, p: 85 },
        { day: "Sun", icon: "wind", desc: "Windy & Chilly", min: 7, max: 13, p: 30 },
        { day: "Mon", icon: "sunny", desc: "Radiant Sun", min: 8, max: 16, p: 0 },
        { day: "Tue", icon: "sunny", desc: "Pleasant", min: 10, max: 18, p: 5 },
        { day: "Wed", icon: "partly_cloudy_day", desc: "Mild Autumn", min: 11, max: 19, p: 10 }
      ]
    },
    {
      name: "Paris",
      country: "France",
      countryCode: "FR",
      flag: "🇫🇷",
      station: "OBS-PAR-48",
      tz: "CEST (UTC+2)",
      lat: 48.8566,
      lon: 2.3522,
      tempC: 17,
      highC: 20,
      lowC: 11,
      feelsLikeC: 16,
      condition: "Gentle Daylight Haze",
      conditionType: "clear-day",
      summary: "Light stratocumulus decks drifting east with moderate thermal comfort.",
      precipRisk: "15%",
      windSpeed: 12,
      windDir: "NE (45°)",
      windAngle: 45,
      windGusts: 18,
      uv: 3.8,
      uvLabel: "Moderate",
      humidity: 62,
      dewPoint: 9,
      pressure: 1018,
      visibility: 10.0,
      aqi: 31,
      rainAcc: 0.1,
      sunrise: "08:15",
      sunset: "18:45",
      hourly: [
        { t: "12:00", temp: 16, p: 5, icon: "partly_cloudy_day" },
        { t: "13:00", temp: 18, p: 10, icon: "partly_cloudy_day" },
        { t: "14:00", temp: 19, p: 10, icon: "sunny", active: true },
        { t: "15:00", temp: 20, p: 15, icon: "sunny" },
        { t: "16:00", temp: 19, p: 15, icon: "partly_cloudy_day" },
        { t: "17:00", temp: 18, p: 10, icon: "cloud" },
        { t: "18:00", temp: 16, p: 5, icon: "clear_night" },
        { t: "19:00", temp: 14, p: 5, icon: "clear_night" },
        { t: "20:00", temp: 13, p: 5, icon: "clear_night" },
        { t: "21:00", temp: 12, p: 0, icon: "bedtime" },
        { t: "22:00", temp: 12, p: 0, icon: "bedtime" },
        { t: "23:00", temp: 11, p: 0, icon: "bedtime" },
        { t: "00:00", temp: 11, p: 0, icon: "bedtime" }
      ],
      weekly: [
        { day: "Today", icon: "partly_cloudy_day", desc: "Gentle Haze", min: 11, max: 20, p: 15 },
        { day: "Fri", icon: "sunny", desc: "Warm Sun", min: 12, max: 22, p: 5 },
        { day: "Sat", icon: "cloud", desc: "Grey Overcast", min: 13, max: 19, p: 25 },
        { day: "Sun", icon: "rainy", desc: "Intermittent Rain", min: 12, max: 17, p: 60 },
        { day: "Mon", icon: "sunny", desc: "Freshening Clear", min: 10, max: 18, p: 10 },
        { day: "Tue", icon: "sunny", desc: "Crisp Sun", min: 9, max: 17, p: 5 },
        { day: "Wed", icon: "partly_cloudy_day", desc: "Partly Cloudy", min: 10, max: 19, p: 15 }
      ]
    },
    {
      name: "San Francisco",
      country: "United States",
      countryCode: "US",
      flag: "🇺🇸",
      station: "OBS-SFO-37",
      tz: "PDT (UTC-7)",
      lat: 37.7749,
      lon: -122.4194,
      tempC: 15,
      highC: 17,
      lowC: 11,
      feelsLikeC: 14,
      condition: "Pacific Marine Fog",
      conditionType: "rain",
      summary: "Classic coastal inversion bringing damp sea mist through the Golden Gate strait.",
      precipRisk: "35%",
      windSpeed: 26,
      windDir: "W (270°)",
      windAngle: 270,
      windGusts: 38,
      uv: 2.9,
      uvLabel: "Low",
      humidity: 86,
      dewPoint: 12,
      pressure: 1014,
      visibility: 6.2,
      aqi: 18,
      rainAcc: 1.2,
      sunrise: "07:22",
      sunset: "18:24",
      hourly: [
        { t: "12:00", temp: 14, p: 40, icon: "foggy" },
        { t: "13:00", temp: 15, p: 35, icon: "cloud" },
        { t: "14:00", temp: 16, p: 30, icon: "partly_cloudy_day", active: true },
        { t: "15:00", temp: 17, p: 25, icon: "partly_cloudy_day" },
        { t: "16:00", temp: 16, p: 35, icon: "foggy" },
        { t: "17:00", temp: 15, p: 45, icon: "foggy" },
        { t: "18:00", temp: 14, p: 40, icon: "foggy" },
        { t: "19:00", temp: 13, p: 35, icon: "cloud" },
        { t: "20:00", temp: 12, p: 30, icon: "cloud" },
        { t: "21:00", temp: 12, p: 25, icon: "bedtime" },
        { t: "22:00", temp: 11, p: 25, icon: "bedtime" },
        { t: "23:00", temp: 11, p: 20, icon: "bedtime" },
        { t: "00:00", temp: 11, p: 20, icon: "bedtime" }
      ],
      weekly: [
        { day: "Today", icon: "foggy", desc: "Marine Fog", min: 11, max: 17, p: 35 },
        { day: "Fri", icon: "partly_cloudy_day", desc: "Afternoon Clearing", min: 11, max: 19, p: 15 },
        { day: "Sat", icon: "sunny", desc: "Sunny Offshore Flow", min: 12, max: 22, p: 5 },
        { day: "Sun", icon: "sunny", desc: "Crystal Clear", min: 13, max: 23, p: 0 },
        { day: "Mon", icon: "foggy", desc: "Fog Returns", min: 12, max: 18, p: 25 },
        { day: "Tue", icon: "cloud", desc: "Cool Breezes", min: 11, max: 17, p: 20 },
        { day: "Wed", icon: "rainy", desc: "Pacific Front", min: 12, max: 16, p: 55 }
      ]
    },
    {
      name: "Reykjavik",
      country: "Iceland",
      countryCode: "IS",
      flag: "🇮🇸",
      station: "OBS-RVK-64",
      tz: "GMT (UTC+0)",
      lat: 64.1466,
      lon: -21.9426,
      tempC: 2,
      highC: 4,
      lowC: -2,
      feelsLikeC: -3,
      condition: "Sub-Arctic Flurries",
      conditionType: "snow",
      summary: "Brisk polar easterly generating crystal snow drift with crisp atmospheric transparency.",
      precipRisk: "70%",
      windSpeed: 32,
      windDir: "ENE (70°)",
      windAngle: 70,
      windGusts: 48,
      uv: 0.8,
      uvLabel: "Low",
      humidity: 82,
      dewPoint: -4,
      pressure: 998,
      visibility: 7.5,
      aqi: 8,
      rainAcc: 4.8,
      sunrise: "08:48",
      sunset: "17:30",
      hourly: [
        { t: "12:00", temp: 2, p: 65, icon: "weather_snowy" },
        { t: "13:00", temp: 3, p: 70, icon: "weather_snowy" },
        { t: "14:00", temp: 4, p: 70, icon: "ac_unit", active: true },
        { t: "15:00", temp: 3, p: 60, icon: "weather_snowy" },
        { t: "16:00", temp: 2, p: 55, icon: "cloud" },
        { t: "17:00", temp: 1, p: 50, icon: "cloud" },
        { t: "18:00", temp: 0, p: 45, icon: "weather_snowy" },
        { t: "19:00", temp: -1, p: 40, icon: "clear_night" },
        { t: "20:00", temp: -1, p: 30, icon: "clear_night" },
        { t: "21:00", temp: -2, p: 20, icon: "bedtime" },
        { t: "22:00", temp: -2, p: 15, icon: "bedtime" },
        { t: "23:00", temp: -3, p: 10, icon: "bedtime" },
        { t: "00:00", temp: -3, p: 10, icon: "bedtime" }
      ],
      weekly: [
        { day: "Today", icon: "weather_snowy", desc: "Snow Flurries", min: -2, max: 4, p: 70 },
        { day: "Fri", icon: "ac_unit", desc: "Sub-Zero Freeze", min: -5, max: 1, p: 40 },
        { day: "Sat", icon: "thunderstorm", desc: "Gale Storm", min: -1, max: 5, p: 85 },
        { day: "Sun", icon: "rainy", desc: "Sleet & Rain", min: 1, max: 6, p: 90 },
        { day: "Mon", icon: "cloud", desc: "Icy Overcast", min: -2, max: 3, p: 35 },
        { day: "Tue", icon: "sunny", desc: "Arctic Aurora Night", min: -4, max: 2, p: 10 },
        { day: "Wed", icon: "weather_snowy", desc: "Glacial Drift", min: -3, max: 1, p: 60 }
      ]
    }
  ]
};

// Engines References
let particleEngine = null;
let radarMapInstance = null;

// Helper Conversion Utilities
function toDisplayTemp(celsius) {
  if (celsius === undefined || isNaN(celsius)) return '--';
  if (observatoryState.isCelsius) return Math.round(celsius);
  return Math.round((celsius * 9/5) + 32);
}

function tempUnit() {
  return observatoryState.isCelsius ? '°C' : '°F';
}

function toDisplayWind(kmh) {
  if (kmh === undefined || isNaN(kmh)) return '--';
  if (observatoryState.windKmH) return Math.round(kmh);
  return Math.round(kmh * 0.621371);
}

function windUnit() {
  return observatoryState.windKmH ? 'km/h' : 'mph';
}

// Interactive SVG Weather Hero Icons
function renderWeatherSVG(conditionType) {
  if (conditionType === 'clear-day') {
    return `
      <svg class="w-full h-full drop-shadow-[0_0_24px_rgba(255,193,116,0.45)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="22" fill="#FFC174" class="animate-pulse" style="animation-duration: 3s;"/>
        <g stroke="#FFC174" stroke-width="4" stroke-linecap="round">
          <line x1="50" y1="12" x2="50" y2="20" />
          <line x1="50" y1="80" x2="50" y2="88" />
          <line x1="12" y1="50" x2="20" y2="50" />
          <line x1="80" y1="50" x2="88" y2="50" />
          <line x1="23" y1="23" x2="29" y2="29" />
          <line x1="71" y1="71" x2="77" y2="77" />
          <line x1="23" y1="77" x2="29" y2="71" />
          <line x1="71" y1="29" x2="77" y2="23" />
        </g>
      </svg>
    `;
  } else if (conditionType === 'storm') {
    return `
      <svg class="w-full h-full drop-shadow-[0_0_24px_rgba(192,132,252,0.55)]" viewBox="0 0 100 100" fill="none">
        <path d="M28 62 C22 62 18 56 20 48 C22 40 30 38 34 38 C36 28 46 22 56 24 C64 26 70 32 72 40 C78 40 84 46 82 54 C80 62 74 62 68 62 Z" fill="#94A3B8" />
        <polygon points="50,56 42,72 52,72 46,92 64,68 54,68" fill="#FACC15" class="animate-bounce" style="animation-duration: 1.5s;" />
      </svg>
    `;
  } else if (conditionType === 'rain') {
    return `
      <svg class="w-full h-full drop-shadow-[0_0_24px_rgba(56,189,248,0.45)]" viewBox="0 0 100 100" fill="none">
        <path d="M28 52 C22 52 18 46 20 38 C22 30 30 28 34 28 C36 18 46 12 56 14 C64 16 70 22 72 30 C78 30 84 36 82 44 C80 52 74 52 68 52 Z" fill="#64748B" />
        <line x1="38" y1="60" x2="32" y2="76" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" class="animate-pulse" />
        <line x1="52" y1="60" x2="46" y2="78" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" class="animate-pulse" style="animation-delay: 0.3s;" />
        <line x1="66" y1="60" x2="60" y2="76" stroke="#38BDF8" stroke-width="3" stroke-linecap="round" class="animate-pulse" style="animation-delay: 0.6s;" />
      </svg>
    `;
  } else if (conditionType === 'snow') {
    return `
      <svg class="w-full h-full drop-shadow-[0_0_24px_rgba(224,242,254,0.65)]" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="6" fill="#E0F2FE" />
        <g stroke="#E0F2FE" stroke-width="3" stroke-linecap="round">
          <line x1="50" y1="20" x2="50" y2="80" />
          <line x1="20" y1="50" x2="80" y2="50" />
          <line x1="28" y1="28" x2="72" y2="72" />
          <line x1="28" y1="72" x2="72" y2="28" />
        </g>
      </svg>
    `;
  } else {
    return `
      <svg class="w-full h-full drop-shadow-[0_0_24px_rgba(168,175,255,0.45)]" viewBox="0 0 100 100" fill="none">
        <path d="M64 24 C44 26 30 42 30 62 C30 76 38 88 50 92 C32 90 20 74 20 54 C20 32 36 16 58 14 C60 14 62 14 64 24 Z" fill="#C4B5FD" />
        <circle cx="74" cy="36" r="2.5" fill="#FFFFFF" class="animate-ping" style="animation-duration: 2.5s;" />
        <circle cx="68" cy="68" r="2" fill="#FFFFFF" class="animate-pulse" />
      </svg>
    `;
  }
}

// --------------------------------------------------------------------------
// Core Observatory Render Engine
// --------------------------------------------------------------------------
function renderObservatory() {
  const city = observatoryState.cities[observatoryState.activeCityIndex];
  if (!city) return;

  // Header & Location
  const cityTitle = document.getElementById('city-title');
  if (cityTitle) cityTitle.textContent = city.name;
  
  const countryFlag = document.getElementById('country-flag');
  if (countryFlag) countryFlag.textContent = city.flag;

  const stationId = document.getElementById('station-id');
  if (stationId) stationId.textContent = city.station;

  const radarLocLabel = document.getElementById('radar-loc-label');
  if (radarLocLabel) radarLocLabel.textContent = `${city.name} Station [Live]`;

  const now = new Date();
  const localTime = document.getElementById('local-time');
  if (localTime) {
    localTime.innerHTML = `
      <span class="material-symbols-outlined text-[15px]" data-icon="schedule">schedule</span>
      ${city.name} Regional Station · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${city.tz || 'Local'})
    `;
  }

  // Hero Temperature readouts
  const heroTemp = document.getElementById('hero-temp');
  if (heroTemp) heroTemp.textContent = toDisplayTemp(city.tempC);

  const heroUnit = document.getElementById('hero-unit');
  if (heroUnit) heroUnit.textContent = tempUnit();

  const tempHigh = document.getElementById('temp-high');
  if (tempHigh) tempHigh.textContent = `${toDisplayTemp(city.highC)}°`;

  const tempLow = document.getElementById('temp-low');
  if (tempLow) tempLow.textContent = `${toDisplayTemp(city.lowC)}°`;

  const feelsLike = document.getElementById('feels-like-val');
  if (feelsLike) feelsLike.textContent = `${toDisplayTemp(city.feelsLikeC)}${tempUnit()}`;

  // Condition Text & Visuals
  const conditionTitle = document.getElementById('condition-title');
  if (conditionTitle) conditionTitle.textContent = city.condition;

  const conditionSummary = document.getElementById('condition-summary');
  if (conditionSummary) conditionSummary.textContent = city.summary;

  const precipRisk = document.getElementById('precip-risk');
  if (precipRisk) precipRisk.textContent = city.precipRisk.includes('%') ? city.precipRisk + " Risk" : city.precipRisk;

  const heroIcon = document.getElementById('hero-condition-icon');
  if (heroIcon) heroIcon.innerHTML = renderWeatherSVG(city.conditionType || observatoryState.activeCondition);

  // Bookmark / Pin State
  updateBookmarkButtonState(city.name);

  // 8 Telemetry Cards
  const windVal = document.getElementById('stat-wind-val');
  if (windVal) windVal.textContent = toDisplayWind(city.windSpeed);

  const windUnitEl = document.getElementById('stat-wind-unit');
  if (windUnitEl) windUnitEl.textContent = windUnit();

  const windDir = document.getElementById('stat-wind-dir');
  if (windDir) windDir.textContent = city.windDir;

  const compass = document.getElementById('compass-needle');
  if (compass) compass.style.transform = `rotate(${city.windAngle}deg)`;

  const windGusts = document.getElementById('stat-wind-gusts');
  if (windGusts) windGusts.textContent = `${toDisplayWind(city.windGusts)} ${windUnit()}`;

  const uvVal = document.getElementById('stat-uv-val');
  if (uvVal) uvVal.textContent = city.uv;

  const uvLabel = document.getElementById('stat-uv-label');
  if (uvLabel) uvLabel.textContent = city.uvLabel;

  const uvBar = document.getElementById('stat-uv-bar');
  if (uvBar) uvBar.style.width = `${Math.min(100, (city.uv / 11) * 100)}%`;

  const humidityVal = document.getElementById('stat-humidity-val');
  if (humidityVal) humidityVal.textContent = city.humidity;

  const dewPoint = document.getElementById('stat-dew-point');
  if (dewPoint) dewPoint.textContent = `Dew point: ${toDisplayTemp(city.dewPoint)}${tempUnit()}`;

  const pressureVal = document.getElementById('stat-pressure-val');
  if (pressureVal) pressureVal.textContent = city.pressure;

  const visibilityVal = document.getElementById('stat-visibility-val');
  if (visibilityVal) visibilityVal.textContent = Number(city.visibility).toFixed(1);

  const aqiVal = document.getElementById('stat-aqi-val');
  if (aqiVal) aqiVal.textContent = city.aqi;

  const rainAcc = document.getElementById('stat-rain-acc');
  if (rainAcc) rainAcc.textContent = city.rainAcc;

  const sunrise = document.getElementById('sunrise-time');
  if (sunrise) sunrise.textContent = city.sunrise;

  const sunset = document.getElementById('sunset-time');
  if (sunset) sunset.textContent = city.sunset;

  // Render Sub-components
  renderHourlyStrip(city);
  renderAreaSpline(city);
  render7DayForecast(city);

  // Update theme and particles
  updateAtmosphericTheme(city.conditionType || observatoryState.activeCondition);

  // Update Interactive Radar Map with city lat & lon
  if (city.lat !== undefined && city.lon !== undefined && radarMapInstance) {
    radarMapInstance.updateLocation(city.lat, city.lon, city.name);
  }
}

// --------------------------------------------------------------------------
// Hourly Forecast Carousel Strip
// --------------------------------------------------------------------------
function renderHourlyStrip(city) {
  const container = document.getElementById('hourly-scroll-container');
  if (!container || !city.hourly) return;
  container.innerHTML = '';

  city.hourly.forEach((hour) => {
    const isActive = hour.active;
    const card = document.createElement('div');
    card.className = `flex-shrink-0 flex flex-col items-center justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer min-w-[76px] ${
      isActive 
        ? 'bg-primary-container/20 border-2 border-primary-container text-white shadow-lg shadow-primary-container/25 -translate-y-1' 
        : 'glass-panel hover:bg-white/10 text-on-surface-variant'
    }`;
    
    card.innerHTML = `
      <span class="text-xs font-mono font-medium ${isActive ? 'text-primary' : 'text-outline'}">${hour.t}</span>
      <span class="material-symbols-outlined text-[24px] my-2 ${isActive ? 'text-primary-container' : 'text-on-surface'}" data-icon="${hour.icon}">${hour.icon}</span>
      <span class="text-sm font-stat-value font-bold text-on-surface">${toDisplayTemp(hour.temp)}°</span>
      ${hour.p > 0 ? `<span class="text-[10px] text-primary font-mono mt-1">💧${hour.p}%</span>` : `<span class="text-[10px] text-outline mt-1">—</span>`}
    `;

    card.addEventListener('click', () => {
      city.hourly.forEach(h => h.active = false);
      hour.active = true;
      renderHourlyStrip(city);
      showToast(`Selected hour ${hour.t}: ${toDisplayTemp(hour.temp)}${tempUnit()}, ${hour.p}% Precip Risk`);
    });

    container.appendChild(card);
  });
}

// --------------------------------------------------------------------------
// Area Spline Chart Generator
// --------------------------------------------------------------------------
function renderAreaSpline(city) {
  const tempArea = document.getElementById('chart-temp-area');
  const tempLine = document.getElementById('chart-temp-line');
  const precipArea = document.getElementById('chart-precip-area');
  if (!tempArea || !tempLine || !precipArea || !city.hourly || !city.hourly.length) return;

  const hourly = city.hourly;
  const count = hourly.length;
  const width = 700;
  const height = 150;
  const paddingY = 25;

  const temps = hourly.map(h => toDisplayTemp(h.temp));
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const range = (maxTemp - minTemp) || 1;

  const points = hourly.map((h, i) => {
    const x = (i / (count - 1)) * width;
    const normalized = (toDisplayTemp(h.temp) - minTemp) / range;
    const y = height - paddingY - (normalized * (height - paddingY * 2));
    return { x, y, temp: toDisplayTemp(h.temp), time: h.t, precip: h.p };
  });

  // Smooth Cubic Spline
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  tempLine.setAttribute('d', pathD);
  tempArea.setAttribute('d', `${pathD} L ${width} ${height} L 0 ${height} Z`);

  // Precipitation Wave
  let precipD = `M 0 ${height}`;
  points.forEach(p => {
    const py = height - (p.precip / 100) * 50;
    precipD += ` L ${p.x} ${py}`;
  });
  precipD += ` L ${width} ${height} Z`;
  precipArea.setAttribute('d', precipD);

  // Interactive Cursor
  const wrapper = document.getElementById('chart-wrapper');
  const cursorLine = document.getElementById('chart-cursor-line');
  const cursorDot = document.getElementById('chart-cursor-dot');
  const tooltip = document.getElementById('chart-tooltip');
  const tooltipTime = document.getElementById('tooltip-time');
  const tooltipTemp = document.getElementById('tooltip-temp');
  const tooltipPrecip = document.getElementById('tooltip-precip');

  if (wrapper && cursorLine && cursorDot && tooltip) {
    wrapper.onmousemove = (e) => {
      const rect = wrapper.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
      const index = Math.round(ratio * (count - 1));
      const pt = points[index];

      if (pt) {
        cursorLine.setAttribute('x1', pt.x);
        cursorLine.setAttribute('x2', pt.x);
        cursorLine.setAttribute('y1', 0);
        cursorLine.setAttribute('y2', height);
        cursorLine.setAttribute('opacity', '1');

        cursorDot.setAttribute('cx', pt.x);
        cursorDot.setAttribute('cy', pt.y);
        cursorDot.setAttribute('opacity', '1');

        tooltip.style.left = `${(pt.x / width) * 100}%`;
        tooltip.style.top = `${Math.max(0, pt.y - 45)}px`;
        tooltip.style.opacity = '1';

        tooltipTime.textContent = pt.time;
        tooltipTemp.textContent = `${pt.temp}${tempUnit()}`;
        tooltipPrecip.textContent = `${pt.precip}% Risk`;
      }
    };

    wrapper.onmouseleave = () => {
      cursorLine.setAttribute('opacity', '0');
      cursorDot.setAttribute('opacity', '0');
      tooltip.style.opacity = '0';
    };
  }
}

// --------------------------------------------------------------------------
// 7-Day Synoptic Forecast List
// --------------------------------------------------------------------------
function render7DayForecast(city) {
  const container = document.getElementById('forecast-7day-list');
  if (!container || !city.weekly) return;
  container.innerHTML = '';

  const allMins = city.weekly.map(d => toDisplayTemp(d.min));
  const allMaxs = city.weekly.map(d => toDisplayTemp(d.max));
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const span = (globalMax - globalMin) || 1;

  city.weekly.forEach(day => {
    const row = document.createElement('div');
    row.className = "flex items-center justify-between py-2 border-b border-white/5 last:border-none text-body-sm hover:bg-white/5 px-2 rounded-lg transition-colors cursor-default";
    
    const dayMin = toDisplayTemp(day.min);
    const dayMax = toDisplayTemp(day.max);
    
    const leftPct = Math.max(0, Math.min(85, ((dayMin - globalMin) / span) * 100));
    const widthPct = Math.max(15, Math.min(100 - leftPct, ((dayMax - dayMin) / span) * 100));

    row.innerHTML = `
      <div class="w-16 font-medium text-on-surface">${day.day}</div>
      
      <div class="flex items-center gap-2 w-36">
        <span class="material-symbols-outlined text-[20px] text-primary-container" data-icon="${day.icon}">${day.icon}</span>
        <span class="text-xs text-outline truncate">${day.desc}</span>
      </div>

      <div class="w-14 text-center">
        ${day.p > 0 
          ? `<span class="text-[11px] font-mono font-medium text-primary bg-primary-container/10 px-1.5 py-0.5 rounded-full border border-primary-container/20">💧${day.p}%</span>` 
          : `<span class="text-[11px] text-outline">—</span>`}
      </div>

      <!-- Horizontal Min/Max Spectrum Bar -->
      <div class="flex-1 mx-3 hidden sm:flex items-center">
        <div class="w-full bg-white/10 h-1.5 rounded-full relative overflow-hidden">
          <div class="absolute h-full rounded-full bg-gradient-to-r from-primary-container to-tertiary" style="left: ${leftPct}%; width: ${widthPct}%;"></div>
        </div>
      </div>

      <div class="w-20 text-right font-mono text-xs">
        <span class="text-outline mr-1">${dayMin}°</span>
        <span class="text-on-surface font-bold">${dayMax}°</span>
      </div>
    `;

    container.appendChild(row);
  });
}

// --------------------------------------------------------------------------
// Atmospheric Theme & Ambient Mesh
// --------------------------------------------------------------------------
function updateAtmosphericTheme(condition) {
  observatoryState.activeCondition = condition;
  const backdrop = document.getElementById('ambient-backdrop');
  const lightning = document.getElementById('lightning-overlay');
  const heroGlow = document.getElementById('hero-glow');

  if (backdrop) backdrop.className = `fixed inset-0 transition-all duration-1000 -z-20 weather-${condition}`;

  if (lightning && heroGlow) {
    if (condition === 'storm') {
      lightning.classList.remove('hidden');
      heroGlow.style.backgroundColor = 'rgba(192, 132, 252, 0.35)';
    } else {
      lightning.classList.add('hidden');
      if (condition === 'rain') {
        heroGlow.style.backgroundColor = 'rgba(45, 212, 191, 0.25)';
      } else if (condition === 'night') {
        heroGlow.style.backgroundColor = 'rgba(168, 175, 255, 0.2)';
      } else if (condition === 'snow') {
        heroGlow.style.backgroundColor = 'rgba(224, 242, 254, 0.3)';
      } else {
        heroGlow.style.backgroundColor = 'rgba(56, 189, 248, 0.25)';
      }
    }
  }

  // Update Simulator Buttons
  document.querySelectorAll('.condition-sim-btn').forEach(btn => {
    if (btn.dataset.condition === condition) {
      btn.className = "condition-sim-btn active px-3 py-1 rounded-full text-xs font-medium border border-primary-container/50 bg-primary-container/20 text-primary-container transition-all";
    } else {
      btn.className = "condition-sim-btn px-3 py-1 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-on-surface-variant hover:text-on-surface hover:bg-white/10 transition-all";
    }
  });

  // Update canvas particles
  if (particleEngine) {
    particleEngine.setCondition(condition);
  }
}

// --------------------------------------------------------------------------
// Preloader Sequence Controller
// --------------------------------------------------------------------------
let preloaderInterval = null;
let preloaderTimeout = null;

function playPreloaderSequence() {
  const preloader = document.getElementById('skycast-preloader');
  const progressFill = document.getElementById('preloader-progress-fill');
  const percentEl = document.getElementById('preloader-percent');
  const statusLog = document.getElementById('preloader-status-log');

  if (!preloader) return;

  if (preloaderInterval) clearInterval(preloaderInterval);
  if (preloaderTimeout) clearTimeout(preloaderTimeout);

  preloader.style.opacity = '1';
  preloader.style.pointerEvents = 'auto';
  preloader.style.transform = 'scale(1)';
  if (progressFill) progressFill.style.width = '0%';
  if (percentEl) percentEl.textContent = '0%';
  if (statusLog) {
    statusLog.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>Calibrating Doppler Radar Sensors...`;
  }

  let progress = 0;
  const logs = [
    { threshold: 18, text: 'Connecting Open-Meteo Synoptic Feed...' },
    { threshold: 42, text: 'Synthesizing Stratospheric Splines...' },
    { threshold: 68, text: 'Synchronizing 8-Sensor Barometric Deck...' },
    { threshold: 88, text: 'Calibrating Multi-Station Reflectivity...' },
    { threshold: 98, text: 'Observatory Stream Ready.' }
  ];

  preloaderInterval = setInterval(() => {
    const inc = Math.random() * 5 + 3.8;
    progress = Math.min(100, progress + inc);

    if (progressFill) progressFill.style.width = `${progress}%`;
    if (percentEl) percentEl.textContent = `${Math.floor(progress)}%`;

    for (let i = logs.length - 1; i >= 0; i--) {
      if (progress >= logs[i].threshold && statusLog) {
        statusLog.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-primary-container animate-ping"></span>${logs[i].text}`;
        break;
      }
    }

    if (progress >= 100) {
      clearInterval(preloaderInterval);
      if (statusLog) statusLog.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>Atmosphere Synchronized.`;
      preloaderTimeout = setTimeout(() => {
        dismissPreloader();
      }, 400);
    }
  }, 45);
}

function dismissPreloader() {
  const preloader = document.getElementById('skycast-preloader');
  if (!preloader) return;
  if (preloaderInterval) clearInterval(preloaderInterval);
  if (preloaderTimeout) clearTimeout(preloaderTimeout);

  preloader.style.opacity = '0';
  preloader.style.pointerEvents = 'none';
  preloader.style.transform = 'scale(1.03)';
}

// --------------------------------------------------------------------------
// GPS Current Location Handler & Google Maps Integration
// --------------------------------------------------------------------------
async function locateCurrentGPS() {
  const gpsButtons = [
    document.getElementById('gps-locator-btn'),
    document.getElementById('action-location'),
    document.getElementById('quick-gps-pill')
  ];

  // Visual Loading Feedback
  gpsButtons.forEach(btn => {
    if (btn) {
      btn.classList.add('animate-pulse');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'sync';
    }
  });

  showToast("🛰️ Triangulating GPS coordinates from browser telemetry...");

  try {
    const coords = await WeatherAPI.getCurrentGPSPosition();
    showToast(`📍 GPS Fix Acquired: ${coords.lat.toFixed(3)}°, ${coords.lon.toFixed(3)}°. Fetching reverse geocoding & live weather...`);

    // Reverse Geocode
    const locationMeta = await WeatherAPI.reverseGeocode(coords.lat, coords.lon);
    
    // Fetch Live Weather Data from Open-Meteo
    const liveCityData = await WeatherAPI.fetchWeatherData(coords.lat, coords.lon, locationMeta);

    // Prepend or Update Station in Observatory
    const existingIdx = observatoryState.cities.findIndex(c => c.name.toLowerCase() === liveCityData.name.toLowerCase());
    if (existingIdx >= 0) {
      observatoryState.cities[existingIdx] = liveCityData;
      observatoryState.activeCityIndex = existingIdx;
    } else {
      observatoryState.cities.unshift(liveCityData);
      observatoryState.activeCityIndex = 0;
    }

    renderObservatory();
    showToast(`✨ Current Location Loaded: ${liveCityData.name}, ${liveCityData.country}!`);

  } catch (err) {
    console.error("GPS telemetry error:", err);
    showToast(`⚠️ GPS Notice: ${err.message || 'Location permission denied. Showing London reference station.'}`);
    // Recenter to default London
    observatoryState.activeCityIndex = 0;
    renderObservatory();
  } finally {
    gpsButtons.forEach(btn => {
      if (btn) {
        btn.classList.remove('animate-pulse');
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'my_location';
      }
    });
  }
}

// --------------------------------------------------------------------------
// City Combobox & Global Search Implementation
// --------------------------------------------------------------------------
function setupSearchCombobox() {
  const input = document.getElementById('city-search-input');
  const combobox = document.getElementById('search-combobox');
  const citiesList = document.getElementById('cities-list');
  const clearBtn = document.getElementById('clear-search-btn');
  const gpsBtn = document.getElementById('gps-locator-btn');

  if (!input || !combobox || !citiesList) return;

  let debounceTimer = null;

  async function populate(filterText = '') {
    citiesList.innerHTML = '';
    const query = filterText.trim().toLowerCase();

    // 1. Check local presets first
    const localMatches = observatoryState.cities.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.country.toLowerCase().includes(query)
    );

    // Render local matching cities
    localMatches.forEach(city => {
      const originalIdx = observatoryState.cities.findIndex(c => c.name === city.name);
      const item = document.createElement('div');
      item.className = "flex items-center justify-between p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors";
      item.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="text-base">${city.flag}</span>
          <span class="text-sm font-medium text-on-surface">${city.name}</span>
          <span class="text-xs text-outline">${city.country}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono font-bold text-primary">${toDisplayTemp(city.tempC)}${tempUnit()}</span>
          <span class="text-[10px] text-outline font-mono">${city.station}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        observatoryState.activeCityIndex = originalIdx;
        renderObservatory();
        combobox.classList.add('hidden');
        input.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');
      });

      citiesList.appendChild(item);
    });

    // 2. If user is actively searching and query >= 2 chars, fetch live worldwide cities from Open-Meteo Geocoding
    if (query.length >= 2) {
      const header = document.createElement('div');
      header.className = "text-[10px] uppercase font-label-uppercase text-primary px-2 py-1 mt-1 border-t border-white/5 flex items-center justify-between";
      header.innerHTML = `<span>Global Telemetry Search</span><span class="text-[9px] text-outline">Open-Meteo Feed</span>`;
      citiesList.appendChild(header);

      const loadingEl = document.createElement('div');
      loadingEl.className = "p-2 text-xs text-outline text-center flex items-center justify-center gap-2";
      loadingEl.innerHTML = `<span class="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin"></span>Searching global stations...`;
      citiesList.appendChild(loadingEl);

      const remoteResults = await WeatherAPI.searchCities(query);
      if (loadingEl.parentNode) loadingEl.remove();

      if (!remoteResults.length && !localMatches.length) {
        citiesList.innerHTML = `<div class="p-3 text-xs text-outline text-center">No telemetry station found matching "${query}"</div>`;
        return;
      }

      remoteResults.forEach(res => {
        const item = document.createElement('div');
        item.className = "flex items-center justify-between p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors";
        item.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="text-base">${res.flag}</span>
            <span class="text-sm font-medium text-on-surface">${res.name}</span>
            <span class="text-xs text-outline">${res.country}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[10px] text-primary-container font-mono bg-primary-container/10 px-1.5 py-0.5 rounded border border-primary-container/30">Connect Live</span>
          </div>
        `;

        item.addEventListener('click', async () => {
          combobox.classList.add('hidden');
          input.value = '';
          if (clearBtn) clearBtn.classList.add('hidden');

          showToast(`Connecting to station ${res.name}, ${res.country}...`);
          try {
            const liveData = await WeatherAPI.fetchWeatherData(res.lat, res.lon, res);
            observatoryState.cities.unshift(liveData);
            observatoryState.activeCityIndex = 0;
            renderObservatory();
            showToast(`Synchronized with ${res.name} Observatory!`);
          } catch (err) {
            showToast(`Error connecting to station: ${err.message}`);
          }
        });

        citiesList.appendChild(item);
      });
    }
  }

  input.addEventListener('focus', () => {
    populate(input.value);
    combobox.classList.remove('hidden');
  });

  input.addEventListener('input', (e) => {
    if (clearBtn) clearBtn.classList.toggle('hidden', !e.target.value);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      populate(e.target.value);
    }, 280);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.add('hidden');
      populate('');
      input.focus();
    });
  }

  if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
      combobox.classList.add('hidden');
      input.value = '';
      locateCurrentGPS();
    });
  }

  // Mobile search drawer support
  const mobileInput = document.getElementById('mobile-city-search-input');
  const mobileToggleBtn = document.getElementById('mobile-search-toggle-btn');
  const mobileBar = document.getElementById('mobile-search-bar');

  if (mobileToggleBtn && mobileBar) {
    mobileToggleBtn.addEventListener('click', () => {
      mobileBar.classList.toggle('hidden');
      if (!mobileBar.classList.contains('hidden') && mobileInput) {
        mobileInput.focus();
      }
    });
  }

  if (mobileInput) {
    mobileInput.addEventListener('focus', () => {
      populate(mobileInput.value);
      combobox.classList.remove('hidden');
    });

    mobileInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        populate(e.target.value);
        combobox.classList.remove('hidden');
      }, 280);
    });
  }

  document.addEventListener('click', (e) => {
    if (!combobox.contains(e.target) && e.target !== input && e.target !== mobileInput && (!mobileToggleBtn || !mobileToggleBtn.contains(e.target))) {
      combobox.classList.add('hidden');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      combobox.classList.add('hidden');
      if (mobileBar) mobileBar.classList.add('hidden');
    }
  });
}

// --------------------------------------------------------------------------
// Bookmark / Pin City Functionality
// --------------------------------------------------------------------------
function updateBookmarkButtonState(cityName) {
  const pinBtn = document.getElementById('pin-city-btn');
  if (!pinBtn) return;
  const isPinned = observatoryState.pinnedCities.includes(cityName);
  const icon = pinBtn.querySelector('.material-symbols-outlined');
  if (icon) {
    icon.textContent = isPinned ? 'bookmark_added' : 'bookmark';
    icon.className = isPinned 
      ? 'material-symbols-outlined text-[18px] text-tertiary-container' 
      : 'material-symbols-outlined text-[18px] text-outline group-hover:text-tertiary-container';
  }
}

function togglePinCity() {
  const city = observatoryState.cities[observatoryState.activeCityIndex];
  if (!city) return;
  const idx = observatoryState.pinnedCities.indexOf(city.name);
  if (idx >= 0) {
    observatoryState.pinnedCities.splice(idx, 1);
    showToast(`Removed ${city.name} from pinned favorites.`);
  } else {
    observatoryState.pinnedCities.push(city.name);
    showToast(`📌 Pinned ${city.name} to quick favorites!`);
  }
  localStorage.setItem('skycast_pinned_cities', JSON.stringify(observatoryState.pinnedCities));
  updateBookmarkButtonState(city.name);
  renderPinnedFavoritesBar();
}

function renderPinnedFavoritesBar() {
  const bar = document.getElementById('pinned-favorites-bar');
  if (!bar) return;
  bar.innerHTML = '';

  if (!observatoryState.pinnedCities.length) {
    bar.classList.add('hidden');
    return;
  }

  bar.classList.remove('hidden');
  const label = document.createElement('span');
  label.className = "text-[11px] font-label-uppercase uppercase text-outline flex items-center gap-1 mr-1";
  label.innerHTML = `<span class="material-symbols-outlined text-[14px]">bookmarks</span> Pinned:`;
  bar.appendChild(label);

  observatoryState.pinnedCities.forEach(name => {
    const city = observatoryState.cities.find(c => c.name === name);
    const pill = document.createElement('button');
    pill.className = "px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10 text-on-surface flex items-center gap-1 transition-all active:scale-95";
    pill.innerHTML = `<span>${city ? city.flag : '📍'}</span> <span>${name}</span>`;
    pill.addEventListener('click', () => {
      const targetIdx = observatoryState.cities.findIndex(c => c.name === name);
      if (targetIdx >= 0) {
        observatoryState.activeCityIndex = targetIdx;
        renderObservatory();
      }
    });
    bar.appendChild(pill);
  });
}

// --------------------------------------------------------------------------
// Toast Alert Notification System
// --------------------------------------------------------------------------
function showToast(message, duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = "fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4";
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = "glass-panel-elevated p-3 rounded-xl border border-primary-container/30 text-white text-xs shadow-2xl flex items-center gap-2.5 pointer-events-auto toast-enter backdrop-blur-xl";
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
    <span class="flex-1 font-body-sm">${message}</span>
    <button class="text-outline hover:text-white transition-colors" onclick="this.parentElement.remove()">
      <span class="material-symbols-outlined text-[16px]">close</span>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('toast-enter');
    toast.classList.add('toast-leave');
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 280);
  }, duration);
}

// --------------------------------------------------------------------------
// Generic Modal Helpers
// --------------------------------------------------------------------------
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

// --------------------------------------------------------------------------
// Theme Engine (Light / Dark Mode)
// --------------------------------------------------------------------------
function applyTheme(mode) {
  observatoryState.themeMode = mode;
  localStorage.setItem('skycast_theme_mode', mode);

  const isLight = mode === 'light';
  document.documentElement.classList.toggle('light-mode', isLight);
  document.documentElement.classList.toggle('dark', !isLight);

  const themeBtn = document.getElementById('action-theme-mode');
  const themeIcon = document.getElementById('theme-mode-icon');
  if (themeIcon) {
    themeIcon.textContent = isLight ? 'light_mode' : 'dark_mode';
  }
  if (themeBtn) {
    themeBtn.setAttribute('title', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
  }

  // Sync mobile dock theme controls
  const mobileDockIcon = document.getElementById('mobile-dock-theme-icon');
  const mobileDockLabel = document.getElementById('mobile-dock-theme-label');
  if (mobileDockIcon) {
    mobileDockIcon.textContent = isLight ? 'light_mode' : 'dark_mode';
  }
  if (mobileDockLabel) {
    mobileDockLabel.textContent = isLight ? 'Light' : 'Dark';
  }
}

// --------------------------------------------------------------------------
// Controls & Interactive Button Listeners
// --------------------------------------------------------------------------
function setupControls() {
  // Preloader buttons
  const skipBtn = document.getElementById('preloader-skip-btn');
  if (skipBtn) skipBtn.addEventListener('click', dismissPreloader);

  const replayBtn = document.getElementById('replay-preloader-btn');
  if (replayBtn) replayBtn.addEventListener('click', playPreloaderSequence);

  // Unit Toggle (°C / °F)
  const unitBtn = document.getElementById('unit-toggle-btn');
  const unitDisplay = document.getElementById('unit-display');
  if (unitBtn && unitDisplay) {
    unitBtn.addEventListener('click', () => {
      observatoryState.isCelsius = !observatoryState.isCelsius;
      unitDisplay.textContent = observatoryState.isCelsius ? '°C' : '°F';
      renderObservatory();
      showToast(`Units switched to ${observatoryState.isCelsius ? 'Celsius (°C)' : 'Fahrenheit (°F)'}`);
    });
  }

  // Wind Unit Toggle
  const windUnitBtn = document.getElementById('action-wind-unit');
  if (windUnitBtn) {
    windUnitBtn.addEventListener('click', () => {
      observatoryState.windKmH = !observatoryState.windKmH;
      renderObservatory();
      showToast(`Wind speed unit set to ${observatoryState.windKmH ? 'km/h' : 'mph'}`);
    });
  }

  // Recenter GPS Action Button
  const actionLocation = document.getElementById('action-location');
  if (actionLocation) {
    actionLocation.addEventListener('click', locateCurrentGPS);
  }

  // Theme / Light-Dark Mode Toggle
  const themeBtn = document.getElementById('action-theme-mode');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const newMode = observatoryState.themeMode === 'dark' ? 'light' : 'dark';
      applyTheme(newMode);
      showToast(newMode === 'light' ? '☀️ Switched to Crisp Daylight Mode' : '🌙 Switched to Atmospheric Dark Mode');
    });
  }

  // Notifications / Severe Bulletins
  const notifBtn = document.getElementById('action-notifications');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => openModal('bulletins-modal'));
  }

  // Sign In Action Button
  const signInBtn = document.getElementById('sign-in-btn');
  if (signInBtn) {
    signInBtn.addEventListener('click', () => openModal('auth-modal'));
  }

  // Bookmark / Pin Button
  const pinBtn = document.getElementById('pin-city-btn');
  if (pinBtn) {
    pinBtn.addEventListener('click', togglePinCity);
  }

  // Condition Simulator Buttons
  document.querySelectorAll('.condition-sim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      updateAtmosphericTheme(btn.dataset.condition);
      showToast(`Atmosphere simulation updated to: ${btn.textContent.trim()}`);
    });
  });

  // Doppler Radar Play/Pause Toggle
  const radarBtn = document.getElementById('radar-play-btn');
  const radarLabel = document.getElementById('radar-btn-label');
  if (radarBtn && radarLabel) {
    radarBtn.addEventListener('click', () => {
      observatoryState.radarPlaying = !observatoryState.radarPlaying;
      if (radarMapInstance) {
        radarMapInstance.toggleAnimation(observatoryState.radarPlaying);
      }
      radarLabel.textContent = observatoryState.radarPlaying ? 'Pause Echo' : 'Animate Echo';
      showToast(observatoryState.radarPlaying ? '▶️ Radar Doppler sweep active' : '⏸️ Radar sweep paused');
    });
  }

  // Navigation Links Event Listeners
  document.querySelectorAll('nav a, footer nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      if (href === '#radar' || href === '#radar-telemetry') {
        e.preventDefault();
        const el = document.getElementById('radar-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (href === '#maps') {
        e.preventDefault();
        const city = observatoryState.cities[observatoryState.activeCityIndex];
        window.open(`https://www.google.com/maps?q=${city.lat || 51.5074},${city.lon || -0.1278}`, '_blank');
      } else if (href === '#alerts') {
        e.preventDefault();
        openModal('bulletins-modal');
      } else if (href === '#historical') {
        e.preventDefault();
        openModal('historical-modal');
      } else if (href === '#api-docs' || href === '#data-sources') {
        e.preventDefault();
        openModal('api-docs-modal');
      } else if (href === '#privacy' || href === '#terms') {
        e.preventDefault();
        openModal('legal-modal');
      }
    });
  });

  // Periodic Clock Sync
  setInterval(() => {
    const d = new Date();
    const syncTime = document.getElementById('sync-time');
    if (syncTime) {
      syncTime.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }, 1000);
}

// --------------------------------------------------------------------------
// Application Initialization Lifecycle
// --------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  // 1. Apply persisted theme mode (Dark or Light)
  applyTheme(observatoryState.themeMode);

  // 2. Initialize Particles Engine
  particleEngine = new WeatherParticleEngine('weather-canvas');

  // 3. Initialize Interactive Radar Map
  radarMapInstance = new RadarMapEngine('radar-interactive-map');
  const city = observatoryState.cities[observatoryState.activeCityIndex];
  radarMapInstance.init(city.lat, city.lon, city.name);

  // 4. Setup UI Controls & Listeners
  setupSearchCombobox();
  setupControls();
  renderPinnedFavoritesBar();

  // 5. Initial Render
  renderObservatory();

  // 6. Run Polished Atmospheric Preloader
  playPreloaderSequence();
});
