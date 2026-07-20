'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'clinic' | 'blood_bank';
  lat: number;
  lng: number;
  address: string;
  rating: number;
  distance: string;
  phone: string;
  hours: string;
  isOpen: boolean;
  specialties: string[];
}

const hospitalIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:#2563eb;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4M16 2v4M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3V6z"/><path d="M3 10v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const pharmacyIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:#16a34a;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const clinicIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:#d97706;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4M16 2v4M3 10h18M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4H3V6z"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const bloodBankIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:#dc2626;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function getIcon(type: string) {
  switch (type) {
    case 'hospital': return hospitalIcon;
    case 'pharmacy': return pharmacyIcon;
    case 'clinic': return clinicIcon;
    case 'blood_bank': return bloodBankIcon;
    default: return hospitalIcon;
  }
}

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '½';
  return stars;
}

interface MapViewProps {
  facilities: Facility[];
  center?: [number, number];
}

export default function MapView({ facilities, center = [9.0192, 38.7525] }: MapViewProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {facilities.map((f) => (
        <Marker key={f.id} position={[f.lat, f.lng]} icon={getIcon(f.type)}>
          <Popup>
            <div className="min-w-[200px] space-y-1">
              <h3 className="font-semibold text-sm">{f.name}</h3>
              <p className="text-xs text-gray-600">{f.address}</p>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-amber-500">{renderStars(f.rating)}</span>
                <span className="font-medium">{f.rating}</span>
              </div>
              <p className="text-xs text-gray-500">{f.distance}</p>
              <p className={`text-xs font-medium ${f.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                {f.hours}
              </p>
              <a href={`tel:${f.phone}`} className="text-xs text-blue-600 hover:underline">
                {f.phone}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
