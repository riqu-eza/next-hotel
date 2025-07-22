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
  MdWifi,
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
    Kitchenette: MdKitchen,
    "Smart TV": MdTv,
    Balcony: MdBalcony,
    "Living Area": MdWeekend,
    Housekeeping: MdCleaningServices,
    "King bed": MdKingBed,
    "Queen bed": FaBed,
    "2 Bedrooms": MdHome,
    Bedroom: MdHome,
    TV: MdTv,
    WiFi: MdWifi,
  };

  return (
    <section className=" bg-gradient-to-br from-blue-50 to-blue-100  overflow-hidden">
      {/* Header */}
     

      {/* Content Container */}
      <div className="flex flex-row4 lg:flex-row p-4 sm:p-5 md:p-6 gap-5 sm:gap-6 md:gap-8">
        {/* About Section */}
        <div className="flex-1 min-w-0">
          <div className=" pb-3 sm:pb-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-800 flex items-center gap-2">
              <span className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></span>
              About This Property
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed sm:leading-loose text-justify text-sm sm:text-base">
            {property.description}
          </p>
        </div>

        {/* Amenities Section */}
        <div className="flex-1 min-w-0">
          <div className="pb-3 sm:pb-4 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-800 flex items-center gap-2">
              <span className="w-3 h-3  bg-blue-500 rounded-full"></span>
              Amenities & Services
            </h2>
          </div>
          <div className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
            {uniqueAmenities.map((amenity, idx) => {
              const Icon = amenityIcons[amenity];
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center gap-2 p-3 sm:p-3 bg-blue-50 rounded-md sm:rounded-lg hover:bg-blue-100 transition-colors text-center"
                >
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full text-blue-600">
                    {Icon ? (
                      <Icon size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <span>✅</span>
                    )}
                  </div>
                  <span className="text-xs sm:text-[10px] text-gray-800 font-medium">
                    {amenity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
