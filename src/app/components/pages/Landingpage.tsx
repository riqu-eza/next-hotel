/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { IContent } from "@/models/content";
import { IProperty } from "@/models/property";
// import { Ilocation } from "@/models/property";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import BookingForm from "./bookingform";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import MapShow from "../Map/MapShow";

interface LandingPageProps {
  property: IProperty;
}

export default function LandingPage({ property }: LandingPageProps) {
  const [content, setContent] = useState<IContent | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const { location } = property;
  const firstLocation = Array.isArray(location) ? location[0] : location;

  useEffect(() => {
    const fetchContent = async () => {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      setContent(data[0] || null);
    };

    fetchContent();
  }, []);
  const primaryLocation = location?.[0];

  const getGoogleMapsUrl = () => {
    if (!primaryLocation) return "#";
    if (primaryLocation.shareUrl) return primaryLocation.shareUrl;
    return `https://www.google.com/maps?q=${primaryLocation.lat},${primaryLocation.lng}`;
  };

  if (!property) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Swiper Slider */}
      <div className="w-full h-full">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          effect={"fade"}
          fadeEffect={{
            crossFade: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            renderBullet: (index, className) => {
              return `<span class="${className} bg-white w-3 h-3 opacity-50 hover:opacity-100 transition-opacity duration-300"></span>`;
            },
          }}
          className="h-full"
        >
          {property.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full relative">
                <Image
                  src={url}
                  alt={`Property ${index + 1}`}
                  className="object-cover w-full h-full"
                  fill
                  priority={index === 0}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Static Content Overlay - Responsive adjustments */}
      {content && (
        <div className="absolute z-10 inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto w-full px-4">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 xs:mb-4 sm:mb-6 tracking-tight drop-shadow-lg">
              {content.header}
            </h1>
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-white/90 mb-4 xs:mb-6 sm:mb-8 max-w-2xl mx-auto drop-shadow-md px-2">
              {content.subheader}
            </p>
            <button
              onClick={() => setShowBookingForm(true)}
              className="bg-white/90 hover:bg-white text-gray-900 font-semibold px-5 py-1.5 xs:px-6 xs:py-2 sm:px-8 sm:py-3 rounded-full text-sm xs:text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBookingForm(false)}
          ></div>

          <div className="relative bg-white rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl w-full max-w-xs xs:max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close booking form"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-4 sm:p-6 md:p-8">
              <BookingForm
                roomTypes={property.servicesOffered.map((s) => s.roomType)}
                onClose={() => setShowBookingForm(false)}
                propertyId={String(property._id)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls - Responsive adjustments */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-4 sm:pb-6 md:pb-8 lg:pb-12">
        <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="swiper-button-prev text-white opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>

            <div className="swiper-pagination flex gap-1 sm:gap-2 justify-center"></div>

            <div className="swiper-button-next text-white opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 lg:h-10 lg:w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Property Info - Responsive adjustments */}
          <div className="bg-black/50 text-white px-2 py-0.5 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-md sm:rounded-lg backdrop-blur-sm text-xs sm:text-sm">
            <div className="font-medium text-xs sm:text-sm text-whiteI  flex items-center order-2 sm:order-none">
              {primaryLocation ? (
                <a
                  href={getGoogleMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 hover:underline"
                >
                  {primaryLocation.address || "View on Map"}
                </a>
              ) : (
                <span>Location not specified</span>
              )}
            </div>
            <div className="opacity-80">{property.phone}</div>
            <div className="mt-4">
              <MapShow
                property={property}
                height="200px border-2 rounded-md border-blue-500"
                zoom={13}
                className="border-t"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
