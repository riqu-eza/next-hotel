"use client";

import { ITestimonial } from "@/models/testimonial";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

export default function Comments() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setTestimonials(data);
    setLoading(false);
  };

  const addTestimonial = async () => {
    if (!name || !message || !rating) return;

    await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message, rating }),
    });

    setName("");
    setMessage("");
    setRating(5);
    fetchTestimonials();
  };

  const deleteTestimonial = async (id: string) => {
    await fetch(`/api/testimonials/${id}`, {
      method: "DELETE",
    });
    fetchTestimonials();
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">
            Customer Testimonials
          </h2>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Hear what our customers have to say about their experiences
          </p>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {testimonials.length > 0 ? (
                <div className="relative">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    autoplay={{
                      delay: 6000,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                    breakpoints={{
                      640: { slidesPerView: 1 },
                      768: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                    }}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="mySwiper pb-16"
                  >
                    {testimonials.map((t) => (
                      <SwiperSlide key={t._id as string}>
                        <div className="bg-white p-8 rounded-2xl shadow-lg h-full flex flex-col border border-blue-100 transform hover:scale-[1.02] transition duration-300">
                          <div className="flex-grow">
                            <svg
                              className="w-8 h-8 text-blue-300 mb-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="text-gray-700 italic text-lg mb-6">
                              &quot;{t.message}&quot;
                            </p>
                          </div>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-blue-900">
                                  {t.name}
                                </h4>
                                <div className="flex mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-5 h-5 ${
                                        i < t.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="..." />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  deleteTestimonial(t._id as string)
                                }
                                className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-full hover:bg-red-50 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="swiper-button-next"></div>
                  <div className="swiper-button-prev"></div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-inner border border-blue-100">
                  <svg
                    className="w-12 h-12 mx-auto text-blue-300 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-blue-800 mb-2">
                    No Testimonials Yet
                  </h3>
                  <p className="text-blue-600">
                    Be the first to share your experience!
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add Testimonial Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-200 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-blue-800 mb-6">
            Share Your Thoughts
          </h3>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-blue-700 mb-1"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="testimonial"
                className="block text-sm font-medium text-blue-700 mb-1"
              >
                Your Testimonial
              </label>
              <textarea
                id="testimonial"
                rows={4}
                placeholder="Share your experience..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-blue-700 mb-1"
              >
                Rating (1-5)
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border border-blue-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <button
                onClick={addTestimonial}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium px-8 py-3 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
              >
                Submit Testimonial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Swiper Navigation CSS */}
      <style jsx>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #1e40af;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #eff6ff;
          transform: scale(1.1);
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 1.2rem;
        }
      `}</style>
    </section>
  );
}
