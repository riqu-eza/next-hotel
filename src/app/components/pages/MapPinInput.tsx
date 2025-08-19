"use client";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface MapPinInputProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    shareUrl: string;
  }) => void;
  initialLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export default function MapPinInput({ onLocationSelect, initialLocation }: MapPinInputProps) {
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : null
  );
  const [address, setAddress] = useState(initialLocation?.address || "");

  async function reverseGeocode(lat: number, lng: number) {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
      );
      const j = await r.json();
      const displayAddress = j.display_name || "";
      setAddress(displayAddress);
      
      onLocationSelect({
        lat,
        lng,
        address: displayAddress,
        shareUrl: `https://www.google.com/maps?q=${lat},${lng}`
      });
    } catch {
      setAddress("");
    }
  }

  return (
    <div className="space-y-3">
      <div className="h-72 rounded overflow-hidden">
        <MapContainer 
          center={initialLocation ? [initialLocation.lat, initialLocation.lng] : [-1.286389, 36.817223]} 
          zoom={initialLocation ? 15 : 12} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler
            onPick={(lat, lng) => {
              setMarker({ lat, lng });
              reverseGeocode(lat, lng);
            }}
          />
          {marker && <Marker position={[marker.lat, marker.lng]} />}
        </MapContainer>
      </div>

      <input 
        className="border p-2 w-full" 
        readOnly 
        placeholder="Address (auto)" 
        value={address} 
      />
      {marker && (
        <input 
          className="border p-2 w-full" 
          readOnly 
          value={`Lat: ${marker.lat.toFixed(6)}  Lng: ${marker.lng.toFixed(6)}`} 
        />
      )}
    </div>
  );
}