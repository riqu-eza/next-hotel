// components/Map/MapShow.tsx
"use client";

import dynamic from "next/dynamic";
import { IProperty } from "@/models/property";

const MapView = dynamic(() => import("./Mapview"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
      <p>Loading map...</p>
    </div>
  ),
});

interface MapShowProps {
  property: IProperty;
  height?: string;
  zoom?: number;
  className?: string;
}

export default function MapShow({ property, height = "400px", zoom = 15, className = "" }: MapShowProps) {
  const primaryLocation = property.location?.[0];

  if (!primaryLocation) {
    return (
      <div className={`bg-gray-100 rounded-md flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No location data available</p>
      </div>
    );
  }

  return <MapView location={primaryLocation} height={height} zoom={zoom} className={className} />;
}