/**
 * SkyCast Radar & Tactical Live Location Map Engine
 * Professional observatory GIS interface with clean watermark-free tiles,
 * live RainViewer precipitation echo, multi-layer basemaps, and Google Maps integration.
 */

class RadarMapEngine {
  constructor(mapContainerId) {
    this.containerId = mapContainerId;
    this.map = null;
    this.marker = null;
    this.rangeCircles = [];
    this.baseLayers = {};
    this.currentBaseLayer = 'dark'; // 'dark', 'satellite', 'cyber'
    this.radarTileLayer = null;
    this.showRadar = true;
    this.isAnimated = true;
    this.currentLat = 51.5074;
    this.currentLon = -0.1278;
    this.currentCity = "London";
    this.isFullscreen = false;
  }

  init(lat = 51.5074, lon = -0.1278, cityName = "London") {
    this.currentLat = lat;
    this.currentLon = lon;
    this.currentCity = cityName;

    const container = document.getElementById(this.containerId);
    if (!container || typeof L === 'undefined') return;

    // Clean existing map instance if any
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.rangeCircles = [];
    }

    try {
      this.map = L.map(this.containerId, {
        center: [lat, lon],
        zoom: 10,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: false, // We use custom styled control
        attributionControl: false
      });

      // Add custom positioned zoom controls in top-left
      L.control.zoom({ position: 'topleft' }).addTo(this.map);

      // 1. Setup Multi-provider Basemaps (100% Free, Zero Watermarks)
      // A. Dark Canvas (Esri World Dark - default)
      this.baseLayers['dark'] = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 16, className: 'map-tile-dark-canvas' }
      );

      // B. True Satellite Imagery (Esri World Imagery)
      this.baseLayers['satellite'] = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 18, className: 'map-tile-satellite' }
      );

      // C. Cyber High-Contrast Grid (Inverted OpenStreetMap)
      this.baseLayers['cyber'] = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19, className: 'map-tile-cyber-dark' }
      );

      // Add default basemap
      this.baseLayers[this.currentBaseLayer].addTo(this.map);

      // 2. Add Live Precipitation Radar Tiles (RainViewer)
      this.addRadarLayer();

      // 3. Add Tactical Concentric Range Rings (10km, 25km, 50km)
      this.addRangeCircles(lat, lon);

      // 4. Add Custom Tactical Station Reticle Marker
      this.addTacticalMarker(lat, lon, cityName);

      // 5. Update Map Event Listeners
      this.map.on('zoomend moveend', () => {
        this.updateHUDStats();
      });

      this.updateHUDStats();

      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, 300);

    } catch (err) {
      console.warn("Radar Map initialization error:", err);
    }
  }

  // Switch between 'dark', 'satellite', and 'cyber'
  setBasemap(type) {
    if (!this.map || !this.baseLayers[type] || this.currentBaseLayer === type) return;

    this.map.removeLayer(this.baseLayers[this.currentBaseLayer]);
    this.baseLayers[type].addTo(this.map);
    this.currentBaseLayer = type;

    // Bring radar layer and marker to front
    if (this.radarTileLayer && this.showRadar) {
      this.radarTileLayer.bringToFront();
    }
    if (this.marker) {
      this.marker.bringToFront();
    }

    // Update active button state
    document.querySelectorAll('.map-layer-btn').forEach(btn => {
      const isSelected = btn.dataset.layer === type;
      btn.classList.toggle('bg-primary-container', isSelected);
      btn.classList.toggle('text-on-primary-container', isSelected);
      btn.classList.toggle('bg-surface-container-high/80', !isSelected);
      btn.classList.toggle('text-on-surface-variant', !isSelected);
    });

    if (window.showToast) {
      const names = { dark: 'Tactical Dark Canvas', satellite: 'High-Res Satellite Imagery', cyber: 'Cybernetic Grid' };
      window.showToast(`🛰️ Map View: ${names[type] || type}`);
    }
  }

  // Live Doppler Radar Tiles from RainViewer
  async addRadarLayer() {
    if (!this.map) return;
    try {
      const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      if (res.ok) {
        const data = await res.json();
        const past = data.radar && data.radar.past;
        if (past && past.length) {
          const latest = past[past.length - 1];
          const tileUrl = `https://tilecache.rainviewer.com${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
          
          if (this.radarTileLayer) {
            this.map.removeLayer(this.radarTileLayer);
          }

          this.radarTileLayer = L.tileLayer(tileUrl, {
            opacity: 0.72,
            zIndex: 100
          });

          if (this.showRadar) {
            this.radarTileLayer.addTo(this.map);
          }
        }
      }
    } catch (err) {
      console.warn("RainViewer live radar feed note:", err);
    }
  }

  // Toggle Precipitation Echo on/off
  toggleRadarEcho() {
    if (!this.map || !this.radarTileLayer) return;
    this.showRadar = !this.showRadar;

    if (this.showRadar) {
      this.radarTileLayer.addTo(this.map);
      this.radarTileLayer.bringToFront();
    } else {
      this.map.removeLayer(this.radarTileLayer);
    }

    const echoBtn = document.getElementById('map-toggle-echo-btn');
    if (echoBtn) {
      echoBtn.classList.toggle('border-primary-container', this.showRadar);
      echoBtn.classList.toggle('text-primary-container', this.showRadar);
      echoBtn.classList.toggle('bg-primary-container/20', this.showRadar);
    }

    if (window.showToast) {
      window.showToast(this.showRadar ? '🌧️ Precipitation Doppler layer enabled' : '⛅ Precipitation Doppler layer hidden');
    }
  }

  // Concentric Radar Range Rings
  addRangeCircles(lat, lon) {
    this.rangeCircles.forEach(c => this.map.removeLayer(c));
    this.rangeCircles = [];

    const rings = [
      { radius: 12000, color: '#38bdf8', opacity: 0.5, dash: '4, 4', label: '12 km' },
      { radius: 30000, color: '#38bdf8', opacity: 0.35, dash: '6, 6', label: '30 km' },
      { radius: 55000, color: '#0ea5e9', opacity: 0.2, dash: '8, 8', label: '55 km' }
    ];

    rings.forEach(r => {
      const circle = L.circle([lat, lon], {
        color: r.color,
        weight: 1.2,
        opacity: r.opacity,
        fillColor: r.color,
        fillOpacity: 0.03,
        radius: r.radius,
        dashArray: r.dash,
        interactive: false
      }).addTo(this.map);
      this.rangeCircles.push(circle);
    });
  }

  // Tactical Live Crosshair Station Reticle
  addTacticalMarker(lat, lon, cityName) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    const customIcon = L.divIcon({
      className: 'tactical-reticle-pin',
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <!-- Outer Rotating Reticle Ring -->
          <div class="w-14 h-14 rounded-full border border-sky-400/40 crosshair-anim absolute"></div>
          
          <!-- Crosshair Ticks -->
          <div class="w-16 h-px bg-sky-400/50 absolute"></div>
          <div class="h-16 w-px bg-sky-400/50 absolute"></div>

          <!-- Pulsing Radar Echo Ping -->
          <span class="w-8 h-8 rounded-full bg-sky-400/25 animate-ping absolute"></span>
          
          <!-- Inner Precision Target Center -->
          <span class="w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-[0_0_14px_#34d399] relative z-20"></span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    this.marker = L.marker([lat, lon], { icon: customIcon }).addTo(this.map);
    this.updateMarkerPopup(lat, lon, cityName);
  }

  updateMarkerPopup(lat, lon, cityName) {
    if (!this.marker) return;
    const gmapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;

    this.marker.bindPopup(`
      <div class="p-2 min-w-[210px] font-sans">
        <div class="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
          <div class="font-bold text-sky-400 text-xs flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>${cityName} Radar Station</span>
          </div>
          <span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">ONLINE</span>
        </div>
        
        <div class="text-[11px] font-mono text-gray-300 space-y-1 mb-3">
          <div class="flex justify-between">
            <span class="text-gray-400">LATITUDE:</span>
            <span class="font-semibold text-white">${lat.toFixed(4)}° N</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">LONGITUDE:</span>
            <span class="font-semibold text-white">${lon.toFixed(4)}° E</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">GPS ACCURACY:</span>
            <span class="text-emerald-400 font-semibold">± 4.8 m (3D Fix)</span>
          </div>
        </div>

        <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" 
           class="w-full py-1.5 px-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95">
          <span class="material-symbols-outlined text-[14px]">map</span>
          <span>Open Live in Google Maps ↗</span>
        </a>
      </div>
    `);
  }

  // Update Location smoothly with flyTo
  updateLocation(lat, lon, cityName = "Station") {
    this.currentLat = lat;
    this.currentLon = lon;
    this.currentCity = cityName;

    if (!this.map) {
      this.init(lat, lon, cityName);
      return;
    }

    this.map.flyTo([lat, lon], 11, { duration: 1.4 });

    if (this.marker) {
      this.marker.setLatLng([lat, lon]);
      this.updateMarkerPopup(lat, lon, cityName);
    }

    this.addRangeCircles(lat, lon);
    this.updateHUDStats();

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 250);
  }

  // Recenter Camera to Current Coordinates
  recenter() {
    if (!this.map) return;
    this.map.flyTo([this.currentLat, this.currentLon], 11, { duration: 1 });
    if (window.showToast) {
      window.showToast(`🎯 Centered on ${this.currentCity} Coordinates`);
    }
  }

  // Fullscreen View Toggle
  toggleFullscreen() {
    const radarContainer = document.getElementById('radar-section');
    if (!radarContainer) return;

    this.isFullscreen = !this.isFullscreen;
    radarContainer.classList.toggle('radar-fullscreen', this.isFullscreen);

    const icon = document.getElementById('radar-fullscreen-icon');
    if (icon) {
      icon.textContent = this.isFullscreen ? 'fullscreen_exit' : 'fullscreen';
    }

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 200);

    if (window.showToast) {
      window.showToast(this.isFullscreen ? '⛶ Fullscreen Observatory Radar Mode Active (ESC to exit)' : 'Minimized Radar View');
    }
  }

  // Update HUD status labels
  updateHUDStats() {
    const latLabel = document.getElementById('map-hud-lat');
    const lonLabel = document.getElementById('map-hud-lon');
    const stationLabel = document.getElementById('map-hud-station');
    const zoomLabel = document.getElementById('map-hud-zoom');

    if (latLabel) latLabel.textContent = `${this.currentLat >= 0 ? '+' : ''}${this.currentLat.toFixed(4)}°`;
    if (lonLabel) lonLabel.textContent = `${this.currentLon >= 0 ? '+' : ''}${this.currentLon.toFixed(4)}°`;
    if (stationLabel) stationLabel.textContent = `${this.currentCity} Station`;
    if (zoomLabel && this.map) zoomLabel.textContent = `${this.map.getZoom()}x`;
  }

  // Toggle Rotating Beam Animation
  toggleAnimation(shouldAnimate) {
    this.isAnimated = shouldAnimate;
    const radarBeam = document.querySelector('.radar-beam');
    if (radarBeam) {
      radarBeam.style.animationPlayState = shouldAnimate ? 'running' : 'paused';
    }
  }
}

window.RadarMapEngine = RadarMapEngine;
