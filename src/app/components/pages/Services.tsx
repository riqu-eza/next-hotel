"use client";

import { IProperty, IServiceOffered } from "@/models/property";
import { useState } from "react";
import Modal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { FiX, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import BookingForm from "./bookingform";

interface ServicesProps {
  property: IProperty;
}

export default function Services({ property }: ServicesProps) {
  const [selectedService, setSelectedService] =
    useState<IServiceOffered | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingRoomType, setBookingRoomType] = useState<string | null>(null);

  return (
    <section className="py-8 sm:py-12 px-4 xs:px-6 sm:px-8 lg:px-10 bg-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-blue-900 mb-2 sm:mb-3">
            Our Accommodation Options
          </h2>
          <div className="w-16 sm:w-20 h-0.5 sm:h-1 bg-blue-400 mx-auto"></div>
        </div>

        {/* Room Cards - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {property.servicesOffered.map((service, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedService(service)}
              className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm sm:shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="relative h-40 xs:h-44 sm:h-48 md:h-52 overflow-hidden">
                <Image
                  src={service.images[0]}
                  alt={service.roomType}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              </div>
              <div className="p-3 sm:p-4 md:p-5">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-1">
                  {service.roomType}
                </h3>
                <p className="text-blue-600 font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                  KES {service.pricePerNight.toLocaleString()} / night
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-blue-500">
                    {service.amenities.split(",").length} amenities
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm">
                    View details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal - Responsive Adjustments */}
        <Modal
          isOpen={!!selectedService}
          onRequestClose={() => setSelectedService(null)}
          ariaHideApp={false}
          className="p-0 bg-white w-full max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-2 sm:mx-4 my-4 sm:my-8 rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl outline-none overflow-hidden"
          overlayClassName="fixed inset-0 bg-black/75 flex justify-center items-center z-50 backdrop-blur-sm p-2 sm:p-4"
        >
          {selectedService && (
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
              {/* Image Gallery */}
              <div className="lg:w-1/2 relative">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  pagination={{ clickable: true }}
                  spaceBetween={0}
                  slidesPerView={1}
                  className="h-full"
                >
                  {selectedService.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="relative h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 w-full">
                        <Image
                          src={img}
                          alt={`Slide ${idx}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1023px) 100vw, 50vw"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-sm sm:shadow-md transition-all"
                >
                  <FiX className="text-blue-800 w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <div className="swiper-button-next bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-sm sm:shadow-md transition-all">
                  <FiArrowRight className="text-blue-800 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="swiper-button-prev bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-sm sm:shadow-md transition-all">
                  <FiArrowLeft className="text-blue-800 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 flex flex-col">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-900 mb-1 sm:mb-2">
                  {selectedService.roomType}
                </h3>
                <p className="text-lg sm:text-xl text-blue-600 font-medium mb-4 sm:mb-6">
                  KES {selectedService.pricePerNight.toLocaleString()} / night
                </p>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-3">
                    Amenities
                  </h4>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selectedService.amenities.split(",").map((amenity, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm"
                      >
                        {amenity.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4 sm:pt-5 md:pt-6 border-t border-blue-100">
                  <button
                    onClick={() => {
                      setBookingRoomType(selectedService?.roomType || null);
                      setShowBookingForm(true);
                      setSelectedService(null);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium sm:font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-md sm:rounded-lg transition-colors duration-300 text-sm sm:text-base"
                  >
                    Book This Room
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* Booking Form Modal - Responsive Adjustments */}
        {showBookingForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowBookingForm(false)}
            ></div>

            <div className="relative bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowBookingForm(false)}
                className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-full transition-colors"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </button>
              <div className="p-4 sm:p-5 md:p-6">
                <BookingForm
                  roomType={bookingRoomType || ""}
                  propertyId={String(property._id)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
