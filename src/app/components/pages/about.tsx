"use client";

import { IProperty } from "@/models/property";
import { IconType } from "react-icons";
import { 
  MdAcUnit, 
  MdBalcony, 
  MdCleaningServices, 
  MdFreeBreakfast, 
  MdHome, 
  MdKingBed, 
  MdKitchen, 
  MdTv, 
  MdWeekend, 
  MdWifi 
} from "react-icons/md";
import { FaBed } from "react-icons/fa";

interface AboutPageProps {
  property: IProperty;
}

export default function AboutPage({ property }: AboutPageProps) {
  // Collect all amenities, split by comma, trim, deduplicate
  const amenitiesSet = new Set<string>();
  property.servicesOffered.forEach((service) => {
    if (service.amenities) {
      service.amenities.split(",").forEach((item) => {
        const trimmed = item.trim();
        if (trimmed) amenitiesSet.add(trimmed);
      });
    }
  });

  const uniqueAmenities = Array.from(amenitiesSet);

  // Expanded amenity icon map
  const amenityIcons: { [key: string]: IconType } = {
    "Free Wi-Fi": MdWifi,
    "Air Conditioning": MdAcUnit,
    "Breakfast included": MdFreeBreakfast,
    "Kitchenette": MdKitchen,
    "Smart TV": MdTv,
    "Balcony": MdBalcony,
    "Living Area": MdWeekend,
    "Housekeeping": MdCleaningServices,
    "King bed": MdKingBed,
    "Queen bed": FaBed, // Using FaBed as a substitute for MdQueenBed
    "2 Bedrooms": MdHome,
    "Bedroom": MdHome,
    "TV": MdTv,
    "WiFi": MdWifi,
  };

  return (
    <section className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Property Details</h1>
      </div>
      
      {/* Content Container */}
      <div className="flex flex-col lg:flex-row p-6 gap-8">
        {/* About Section */}
        <div className="flex-1">
          <div className="border-b border-blue-100 pb-4 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
              About This Property
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-justify">
            {property.description}
          </p>
        </div>

        {/* Amenities Section */}
        <div className="flex-1">
          <div className="border-b border-blue-100 pb-4 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-800 flex items-center gap-2">
              <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
              Amenities & Services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uniqueAmenities.map((amenity, idx) => {
              const Icon = amenityIcons[amenity];
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    {Icon ? <Icon size={20} /> : <span>✅</span>}
                  </div>
                  <span className="text-gray-800 font-medium">{amenity}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}