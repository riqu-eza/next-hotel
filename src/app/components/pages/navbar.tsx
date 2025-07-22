"use client";

import { IProperty } from "@/models/property";

interface PropertyNavbarProps {
  property: IProperty;
}

export default function PropertyNavbar({ property }: PropertyNavbarProps) {
  if (!property) return null;

  return (
    <nav className="w-full fixed top-0 left-0 bg-blue-50 shadow-lg p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 z-50 border-b border-blue-100">
      {/* Phone - Top on mobile, left on desktop */}
      <div className="text-xs sm:text-sm text-blue-700 font-medium flex items-center order-1 sm:order-none">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
          />
        </svg>
        <a href={`tel:${property.phone.replace(/\D/g, '')}`} className="hover:text-blue-600">
          {property.phone}
        </a>
      </div>

      {/* Property Name - Center on mobile, right on desktop */}
      <div className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent order-3 sm:order-none text-center sm:text-left">
        {property.name}
      </div>

      {/* Location - Bottom on mobile, middle on desktop */}
      <div className="text-xs sm:text-sm font-semibold text-blue-800 bg-blue-100 px-2 py-1 sm:px-3 sm:py-1 rounded-full order-2 sm:order-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px] sm:max-w-none">
        {property.location}
      </div>
    </nav>
  );
}