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
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
            Our Accommodation Options
          </h2>
          <div className="w-20 h-1 bg-blue-400 mx-auto"></div>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {property.servicesOffered.map((service, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedService(service)}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={service.images[0]}
                  alt={service.roomType}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-blue-800 mb-1">
                  {service.roomType}
                </h3>
                <p className="text-blue-600 font-medium mb-3">
                  KES {service.pricePerNight.toLocaleString()} / night
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-500">
                    {service.amenities.split(",").length} amenities
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={!!selectedService}
          onRequestClose={() => setSelectedService(null)}
          ariaHideApp={false}
          className="p-0 bg-white max-w-6xl mx-4 my-8 rounded-xl shadow-2xl outline-none overflow-hidden"
          overlayClassName="fixed inset-0 bg-black/75 flex justify-center items-center z-50 backdrop-blur-sm"
        >
          {selectedService && (
            <div className="flex flex-col lg:flex-row">
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
                      <div className="relative h-80 sm:h-96 lg:h-full aspect-square lg:aspect-auto">
                        <Image
                          src={img}
                          alt={`Slide ${idx}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <FiX className="text-blue-800 w-5 h-5" />
                </button>
                <div className="swiper-button-next bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition-all">
                  <FiArrowRight className="text-blue-800 w-5 h-5" />
                </div>
                <div className="swiper-button-prev bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition-all">
                  <FiArrowLeft className="text-blue-800 w-5 h-5" />
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col">
                <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                  {selectedService.roomType}
                </h3>
                <p className="text-xl text-blue-600 font-medium mb-6">
                  KES {selectedService.pricePerNight.toLocaleString()} / night
                </p>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-3">
                    Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.amenities.split(",").map((amenity, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {amenity.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-blue-100">
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                  >
                    Book This Room
                  </button>
                </div>
                {showBookingForm && selectedService && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative">
                      <button
                        onClick={() => setShowBookingForm(false)}
                        className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                      >
                        <FiX className="w-5 h-5 text-gray-700" />
                      </button>
                      <BookingForm roomType={selectedService.roomType} propertyId={String(property._id)} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
}
