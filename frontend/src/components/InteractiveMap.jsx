import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Building2, Stethoscope, Zap, Navigation, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom SVG Icons for Malls (Purple/Blue) and Hospitals (Red/Rose)
const createCustomIcon = (category) => {
  const isHospital = category === 'HOSPITAL';
  const color = isHospital ? '#ef4444' : '#3b82f6';
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36" height="36">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export default function InteractiveMap({ locations = [] }) {
  const navigate = useNavigate();

  // Default center around Bengaluru / Delhi NCR hubs
  const defaultCenter = [12.9716, 77.5946];

  return (
    <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude || 12.9958, loc.longitude || 77.6964]}
            icon={createCustomIcon(loc.category)}
          >
            <Popup className="custom-popup">
              <div className="p-2 w-64 space-y-2">
                <div className="flex items-center space-x-2">
                  {loc.category === 'HOSPITAL' ? (
                    <Stethoscope className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Building2 className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{loc.category}</span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-tight">{loc.name}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-1">{loc.address}</p>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{loc.rating || 4.8}</span>
                  </div>
                  <div className="font-bold text-blue-600">
                    ₹{loc.hourlyRate}/hr
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                    {loc.availableSlotsCount ?? 18} Slots Free
                  </span>
                  {loc.hasEVCharging && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center space-x-1">
                      <Zap className="w-2.5 h-2.5 fill-blue-600" />
                      <span>EV Hub</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/book/${loc.slug}`)}
                  className="w-full mt-2 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Select & Book Slot</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
