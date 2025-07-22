"use client";

import { IContent } from "@/models/content";
import { IProperty } from "@/models/property";
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

interface LandingPageProps {
  property: IProperty;
}

export default function LandingPage({ property }: LandingPageProps) {
  const [content, setContent] = useState<IContent | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      setContent(data[0] || null);
    };

    fetchContent();
  }, []);

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

      {/* Static Content Overlay - ALWAYS VISIBLE */}
      {content && (
        <div className="absolute z-10 inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl mx-auto w-full px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight drop-shadow-lg">
              {content.header}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto drop-shadow-md">
              {content.subheader}
            </p>
            <button
              onClick={() => setShowBookingForm(true)}
              className="bg-white/90 hover:bg-white text-gray-900 font-semibold px-6 py-2 md:px-8 md:py-3 rounded-full text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Book Now
            </button>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBookingForm(false)}
          ></div>
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowBookingForm(false)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close booking form"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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

            <div className="p-6 md:p-8">
              {/* <h2 className="text-2xl font-bold text-blue-800 mb-6">Make a Reservation</h2> */}
              <BookingForm 
                roomTypes={property.servicesOffered.map((s) => s.roomType)} 
                onClose={() => setShowBookingForm(false)}
                propertyId={String(property._id)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls - ALWAYS VISIBLE */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-8 md:pb-12">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="swiper-button-prev text-white opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 md:h-10 md:w-10"
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

            <div className="swiper-pagination flex gap-2 justify-center"></div>

            <div className="swiper-button-next text-white opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 md:h-10 md:w-10"
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

          {/* Property Info - ALWAYS VISIBLE */}
          <div className="bg-black/50 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg backdrop-blur-sm text-xs md:text-sm">
            <div className="font-medium">{property.location}</div>
            <div className="opacity-80">{property.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
}