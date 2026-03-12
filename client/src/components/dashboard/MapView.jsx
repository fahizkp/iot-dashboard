import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon paths broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function getTemperatureColor(temp) {
  if (temp <= -15) return '#3b82f6';
  if (temp <= -10) return '#10b981';
  if (temp <= -5) return '#f59e0b';
  return '#ef4444';
}

function getTemperatureLabel(temp) {
  if (temp <= -15) return 'Optimal';
  if (temp <= -10) return 'Normal';
  if (temp <= -5) return 'Warning';
  return 'Critical';
}

function formatTimestamp(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString();
}

function createTruckIcon(status) {
  const colorMap = {
    active: { bg: 'rgba(16,185,129,0.15)', border: '#10b981', glow: 'rgba(16,185,129,0.5)' },
    inactive: { bg: 'rgba(100,116,139,0.15)', border: '#64748b', glow: 'rgba(100,116,139,0.3)' },
    maintenance: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
  };
  const c = colorMap[status] || colorMap.active;

  return L.divIcon({
    className: 'custom-truck-marker',
    html: `
      <div style="
        width:42px;height:42px;border-radius:50%;
        background:${c.bg};border:2.5px solid ${c.border};
        box-shadow:0 0 14px ${c.glow},0 4px 12px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;cursor:pointer;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c.border}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
          <circle cx="17" cy="18" r="2"/>
          <circle cx="7" cy="18" r="2"/>
        </svg>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -25],
  });
}

function getPopupContent(v) {
  const tempColor = getTemperatureColor(v.lastTemperature?.value);
  const tempLabel = getTemperatureLabel(v.lastTemperature?.value);
  const timestamp = formatTimestamp(v.lastLocation?.updatedAt);
  const humidity = v.lastHumidity?.value;
  const hasHumidity = humidity !== null && humidity !== undefined;

  const humidityCell = hasHumidity ? `
    <div style="padding:8px;border-radius:10px;background:rgba(6,182,212,0.08);border:1px solid rgba(6,182,212,0.2);">
      <div style="color:#64748b;margin-bottom:2px;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Humidity</div>
      <div style="font-weight:700;font-size:15px;color:#22d3ee;">${Number(humidity).toFixed(1)}%</div>
      <div style="font-size:10px;color:#22d3ee;">RH</div>
    </div>` : '';

  const driverCell = `
    <div style="padding:8px;border-radius:10px;background:rgba(15,23,42,0.6);border:1px solid rgba(51,65,85,0.3);">
      <div style="color:#64748b;margin-bottom:2px;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Driver</div>
      <div style="font-weight:600;color:#e2e8f0;font-size:11px;">${v.driverName || 'N/A'}</div>
      <div style="font-size:10px;color:#94a3b8;margin-top:2px;">${timestamp}</div>
    </div>`;

  return `
    <div style="min-width:240px;font-family:Inter,sans-serif;padding:4px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#4f46e5,#6366f1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>
        </div>
        <div>
          <div style="font-weight:700;font-size:14px;color:#f1f5f9;">${v.name}</div>
          <div style="font-size:11px;color:#94a3b8;">${v.vehicleId} · ${v.licensePlate}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:${hasHumidity ? '1fr 1fr 1fr' : '1fr 1fr'};gap:7px;font-size:12px;">
        <div style="padding:8px;border-radius:10px;background:rgba(15,23,42,0.6);border:1px solid rgba(51,65,85,0.3);">
          <div style="color:#64748b;margin-bottom:2px;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Temp</div>
          <div style="font-weight:700;font-size:15px;color:${tempColor};">${v.lastTemperature?.value?.toFixed(1)}°C</div>
          <div style="font-size:10px;color:${tempColor};">${tempLabel}</div>
        </div>
        ${humidityCell}
        ${driverCell}
      </div>
    </div>
  `;
}

export default function MapView({ vehicles = [], selectedVehicle, onSelectVehicle }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(null);

  // Initialize map imperatively (avoids react-leaflet context issues with React 18)
  useEffect(() => {
    if (mapRef.current) return;
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: 'center', // Makes zoom focus on the center instead of mouse cursor
    });

    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '&copy; Google Maps',
      maxZoom: 20,
    }).addTo(map);

    const markers = L.layerGroup().addTo(map);
    mapRef.current = map;
    markersRef.current = markers;

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Update markers whenever vehicles data changes (refreshed from API)
  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    markers.clearLayers();

    vehicles.forEach((v) => {
      if (!v.lastLocation) return;
      const marker = L.marker(
        [v.lastLocation.lat, v.lastLocation.lng],
        { icon: createTruckIcon(v.status) }
      );

      marker.bindPopup(getPopupContent(v), { maxWidth: 300 });

      marker.on('click', () => {
        if (onSelectVehicle) onSelectVehicle(v);
      });

      markers.addLayer(marker);
    });
  }, [vehicles, onSelectVehicle]);

  // Fly to selected vehicle and open its popup
  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || !selectedVehicle?.lastLocation) return;

    map.flyTo(
      [selectedVehicle.lastLocation.lat, selectedVehicle.lastLocation.lng],
      17, // Increased zoom level
      { duration: 1.5 }
    );

    if (markers) {
      markers.eachLayer((layer) => {
        const { lat, lng } = layer.getLatLng();
        if (
          Math.abs(lat - selectedVehicle.lastLocation.lat) < 0.001 &&
          Math.abs(lng - selectedVehicle.lastLocation.lng) < 0.001
        ) {
          layer.openPopup();
        }
      });
    }
  }, [selectedVehicle]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-dark-700/30">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ background: '#0f172a', minHeight: '400px' }}
      />
    </div>
  );
}
