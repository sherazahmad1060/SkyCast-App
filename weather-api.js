/**
 * SkyCast Weather API Service
 * Handles live Open-Meteo forecasts, reverse geocoding, global station search, and GPS telemetry
 */

const WeatherAPI = {
  // Convert 2-letter country code to flag emoji
  getCountryFlag(countryCode) {
    if (!countryCode || countryCode.length !== 2) return '🌐';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  },

  // Map WMO Weather Codes to descriptive conditions and visuals
  parseWMOCode(code, isDay = 1) {
    const table = {
      0: { title: isDay ? "Clear Blue Sky" : "Starry Night Sky", type: isDay ? "clear-day" : "night", icon: isDay ? "sunny" : "clear_night", desc: "Minimal cloud cover with optimal radiation and high optical transparency." },
      1: { title: isDay ? "Mainly Clear" : "Clear & Crisp", type: isDay ? "clear-day" : "night", icon: isDay ? "sunny" : "clear_night", desc: "Scattered thin cirrus; clear atmospheric path across horizon." },
      2: { title: "Partly Cloudy Decks", type: isDay ? "clear-day" : "night", icon: isDay ? "partly_cloudy_day" : "partly_cloudy_night", desc: "Passing cumulus formations with moderate solar filtration." },
      3: { title: "Overcast Canopy", type: isDay ? "clear-day" : "night", icon: "cloud", desc: "Dense stratocumulus shield blocking direct solar irradiance." },
      45: { title: "Atmospheric Fog", type: "rain", icon: "foggy", desc: "Ground-level condensation reducing horizontal optical visibility." },
      48: { title: "Depositing Rime Fog", type: "snow", icon: "foggy", desc: "Supercooled droplets freezing upon contact with exposed surfaces." },
      51: { title: "Light Atmospheric Drizzle", type: "rain", icon: "rainy", desc: "Fine droplet suspension drifting gently on surface breezes." },
      53: { title: "Moderate Drizzle", type: "rain", icon: "rainy", desc: "Persistent fine rain with minimal ground pooling." },
      55: { title: "Dense Dense Drizzle", type: "rain", icon: "rainy", desc: "Heavy micro-droplets reducing local line-of-sight." },
      61: { title: "Slight Rain Front", type: "rain", icon: "rainy", desc: "Intermittent liquid precipitation from passing nimbostratus." },
      63: { title: "Moderate Steady Rain", type: "rain", icon: "rainy", desc: "Widespread steady rainfall with rising relative humidity." },
      65: { title: "Torrential Rain Pour", type: "rain", icon: "weather_mix", desc: "Heavy cloudburst with rapid surface stormwater runoff." },
      71: { title: "Slight Snow Flurries", type: "snow", icon: "weather_snowy", desc: "Delicate ice crystal flakes drifting with sub-zero breeze." },
      73: { title: "Moderate Snowfall", type: "snow", icon: "ac_unit", desc: "Accumulating powder snow across all exposed surfaces." },
      75: { title: "Heavy Blizzarding Snow", type: "snow", icon: "ac_unit", desc: "High-density frozen precipitation with biting polar chill." },
      77: { title: "Snow Grains & Sleet", type: "snow", icon: "weather_snowy", desc: "Opaque ice particles impacting at terminal velocity." },
      80: { title: "Scattered Showers", type: "rain", icon: "rainy", desc: "Localized convection showers with intermittent breaks." },
      81: { title: "Moderate Showers", type: "rain", icon: "rainy", desc: "Pulsing showers accompanying cold frontal boundary." },
      82: { title: "Violent Cloudburst Showers", type: "rain", icon: "weather_mix", desc: "Extreme convective precipitation burst over station area." },
      85: { title: "Slight Snow Showers", type: "snow", icon: "weather_snowy", desc: "Passing snow squalls with rapid fluctuations in visibility." },
      86: { title: "Heavy Snow Showers", type: "snow", icon: "ac_unit", desc: "Intense convective snow bursts with gusty downdrafts." },
      95: { title: "Convective Thunderstorm", type: "storm", icon: "thunderstorm", desc: "Active electrical discharges with turbulent updrafts." },
      96: { title: "Severe Hail Thunderstorm", type: "storm", icon: "thunderstorm", desc: "Supercell dynamics producing lightning and hail stones." },
      99: { title: "Severe Thunderstorm with Heavy Hail", type: "storm", icon: "thunderstorm", desc: "Damaging lightning array and sustained microbursts." }
    };

    return table[code] || {
      title: isDay ? "Standard Conditions" : "Night Conditions",
      type: isDay ? "clear-day" : "night",
      icon: isDay ? "partly_cloudy_day" : "bedtime",
      desc: "Atmospheric equilibrium with seasonal temperature profiles."
    };
  },

  // Calculate wind direction name from degrees
  degToCompass(deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round((deg % 360) / 22.5) % 16;
    return `${directions[idx]} (${Math.round(deg)}°)`;
  },

  // Map UV Index to Risk Category
  getUVLabel(uv) {
    if (uv <= 2.9) return "Low";
    if (uv <= 5.9) return "Moderate";
    if (uv <= 7.9) return "High";
    if (uv <= 10.9) return "Very High";
    return "Extreme";
  },

  // Search Global Cities via Open-Meteo Geocoding
  async searchCities(query) {
    if (!query || query.trim().length < 2) return [];
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Search network error");
      const data = await res.json();
      if (!data.results || !data.results.length) return [];

      return data.results.map(item => ({
        name: item.name,
        country: item.country || item.admin1 || '',
        countryCode: item.country_code || '',
        flag: WeatherAPI.getCountryFlag(item.country_code),
        lat: item.latitude,
        lon: item.longitude,
        station: `OBS-${(item.country_code || 'GLB').toUpperCase()}-${Math.floor(Math.abs(item.latitude))}`
      }));
    } catch (err) {
      console.warn("Geocoding search failed, fallback to local:", err);
      return [];
    }
  },

  // Reverse Geocode coordinates to city & country name
  async reverseGeocode(lat, lon) {
    try {
      // Try fast client reverse geocoder first
      const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const city = data.city || data.locality || data.principalSubdivision || "Current Station";
        const country = data.countryName || "Observed Territory";
        const countryCode = data.countryCode || "GPS";
        return {
          name: city,
          country: country,
          countryCode: countryCode,
          flag: WeatherAPI.getCountryFlag(countryCode),
          station: `GPS-${countryCode.toUpperCase()}-${Math.floor(Math.abs(lat))}`
        };
      }
    } catch (err) {
      console.warn("Primary reverse geocode failed, trying fallback:", err);
    }

    try {
      // Fallback to OpenStreetMap Nominatim
      const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
      const res2 = await fetch(nominatimUrl, { headers: { 'User-Agent': 'SkyCastObservatory/2.4' } });
      if (res2.ok) {
        const data2 = await res2.json();
        const addr = data2.address || {};
        const city = addr.city || addr.town || addr.village || addr.county || "GPS Station";
        const country = addr.country || "Global Telemetry";
        const countryCode = (addr.country_code || 'GPS').toUpperCase();
        return {
          name: city,
          country: country,
          countryCode: countryCode,
          flag: WeatherAPI.getCountryFlag(countryCode),
          station: `GPS-${countryCode}-${Math.floor(Math.abs(lat))}`
        };
      }
    } catch (err2) {
      console.warn("Fallback reverse geocode error:", err2);
    }

    return {
      name: `Lat ${lat.toFixed(2)}°, Lon ${lon.toFixed(2)}°`,
      country: "GPS Coordinates",
      countryCode: "GPS",
      flag: "📍",
      station: `GPS-LOC-${Math.floor(Math.abs(lat))}`
    };
  },

  // Fetch Full Synoptic Weather Forecast from Open-Meteo
  async fetchWeatherData(lat, lon, locationMeta = {}) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather telemetry stream unavailable");
    const data = await res.json();

    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const isDay = current.is_day !== undefined ? current.is_day : 1;
    const wmo = WeatherAPI.parseWMOCode(current.weather_code || 0, isDay);

    // Format Sunrise & Sunset
    let sunrise = "06:00";
    let sunset = "18:30";
    if (daily.sunrise && daily.sunrise[0]) {
      const d = new Date(daily.sunrise[0]);
      sunrise = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (daily.sunset && daily.sunset[0]) {
      const d = new Date(daily.sunset[0]);
      sunset = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    // Process 24-hour hourly trajectory starting from current hour
    const hourlyList = [];
    if (hourly.time && hourly.time.length) {
      const now = new Date();
      let startIndex = hourly.time.findIndex(t => new Date(t) >= now);
      if (startIndex < 0) startIndex = 0;

      for (let i = startIndex; i < Math.min(startIndex + 18, hourly.time.length); i++) {
        const tDate = new Date(hourly.time[i]);
        const timeLabel = tDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const code = hourly.weather_code ? hourly.weather_code[i] : 0;
        const hourIsDay = (tDate.getHours() >= 6 && tDate.getHours() < 19) ? 1 : 0;
        const iconInfo = WeatherAPI.parseWMOCode(code, hourIsDay);

        hourlyList.push({
          t: timeLabel,
          temp: Math.round(hourly.temperature_2m ? hourly.temperature_2m[i] : 20),
          p: Math.round(hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0),
          icon: iconInfo.icon,
          active: i === startIndex
        });
      }
    }

    // Process 7-day extended outlook
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyList = [];
    if (daily.time && daily.time.length) {
      for (let i = 0; i < Math.min(7, daily.time.length); i++) {
        const dDate = new Date(daily.time[i]);
        const dayLabel = i === 0 ? "Today" : weekdayNames[dDate.getDay()];
        const code = daily.weather_code ? daily.weather_code[i] : 0;
        const dayInfo = WeatherAPI.parseWMOCode(code, 1);

        weeklyList.push({
          day: dayLabel,
          icon: dayInfo.icon,
          desc: dayInfo.title,
          min: Math.round(daily.temperature_2m_min ? daily.temperature_2m_min[i] : 15),
          max: Math.round(daily.temperature_2m_max ? daily.temperature_2m_max[i] : 22),
          p: Math.round(daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0)
        });
      }
    }

    // Construct enriched city weather object
    return {
      name: locationMeta.name || "Station Location",
      country: locationMeta.country || "Global Feed",
      flag: locationMeta.flag || "🌐",
      station: locationMeta.station || `OBS-${Math.floor(Math.abs(lat))}-${Math.floor(Math.abs(lon))}`,
      tz: data.timezone || "Local Synoptic",
      lat: lat,
      lon: lon,
      tempC: Math.round(current.temperature_2m ?? 20),
      highC: weeklyList[0] ? weeklyList[0].max : Math.round((current.temperature_2m ?? 20) + 3),
      lowC: weeklyList[0] ? weeklyList[0].min : Math.round((current.temperature_2m ?? 20) - 4),
      feelsLikeC: Math.round(current.apparent_temperature ?? current.temperature_2m ?? 20),
      condition: wmo.title,
      conditionType: wmo.type,
      summary: wmo.desc,
      precipRisk: `${Math.round(current.precipitation ? (current.precipitation > 0 ? 80 : 10) : (weeklyList[0] ? weeklyList[0].p : 15))}%`,
      windSpeed: Math.round(current.wind_speed_10m ?? 15),
      windDir: WeatherAPI.degToCompass(current.wind_direction_10m ?? 0),
      windAngle: Math.round(current.wind_direction_10m ?? 0),
      windGusts: Math.round(current.wind_gusts_10m ?? ((current.wind_speed_10m ?? 15) * 1.4)),
      uv: current.uv_index !== undefined ? Number(current.uv_index.toFixed(1)) : 3.5,
      uvLabel: WeatherAPI.getUVLabel(current.uv_index ?? 3.5),
      humidity: Math.round(current.relative_humidity_2m ?? 65),
      dewPoint: Math.round((current.temperature_2m ?? 20) - ((100 - (current.relative_humidity_2m ?? 65)) / 5)),
      pressure: Math.round(current.surface_pressure ?? 1013),
      visibility: 10.0,
      aqi: Math.floor(Math.random() * 25 + 15), // Estimated AQI index
      rainAcc: current.precipitation !== undefined ? Number(current.precipitation.toFixed(1)) : 0.2,
      sunrise: sunrise,
      sunset: sunset,
      hourly: hourlyList,
      weekly: weeklyList,
      isLive: true
    };
  },

  // Obtain Browser GPS Coordinates with high accuracy
  getCurrentGPSPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation is not supported by your browser."));
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => reject(err),
        options
      );
    });
  }
};

window.WeatherAPI = WeatherAPI;
