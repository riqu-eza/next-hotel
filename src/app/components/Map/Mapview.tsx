// components/Map/MapView.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Ilocation } from "@/models/property";

// Custom marker icon using React Icons
const createCustomIcon = (icon: React.ReactNode) => {
  return L.divIcon({
    html: `<div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #3b82f6;
      font-size: 2rem;
      transform: translateY(-50%);
    ">${icon}</div>`,
    className: '', // Remove default className
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

interface MapViewProps {
  location: Ilocation;
  height?: string;
  zoom?: number;
  className?: string;
}

export default function MapView({ location, height = "400px", zoom = 15, className = "" }: MapViewProps) {
  return (
    <div className={`rounded-md overflow-hidden ${className}`} style={{ height }}>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker 
          position={[location.lat, location.lng]}
          icon={createCustomIcon(<FaMapMarkerAlt />)}
        >
          <Popup>
            <div className="space-y-1">
              <h4 className="font-semibold">Property Location</h4>
              <p className="text-sm">{location.address}</p>
              <a
                href={location.shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                View on Google Maps
              </a>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}