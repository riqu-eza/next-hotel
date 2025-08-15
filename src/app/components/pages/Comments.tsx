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
  const [posting, setPosting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTestimonials = async () => {
    const res = await fetch("/api/testimonials");
    const data = await res.json();
    setTestimonials(data);
    setLoading(false);
  };

  const addTestimonial = async () => {
    if (!name || !message || !rating) return;

    setPosting(true);
    setSuccessMessage("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, rating }),
      });

      if (res.ok) {
        setName("");
        setMessage("");
        setRating(5);
        setSuccessMessage("✅ Your testimonial has been posted!");
        fetchTestimonials();
      } else {
        setSuccessMessage("❌ Failed to post testimonial. Please try again.");
      }
    } catch (error) {
      setSuccessMessage("⚠️ An error occurred while posting.");
    } finally {
      setPosting(false);
      setTimeout(() => setSuccessMessage(""), 3000); // Hide after 3 sec
    }
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 mb-3 md:mb-4">
            Customer Testimonials
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-600 max-w-3xl mx-auto">
            Hear what our customers have to say about their experiences
          </p>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16 md:mb-20">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {testimonials.length > 0 ? (
                <div className="relative px-4 sm:px-0">
                  <Swiper
                    slidesPerView={1}
                    spaceBetween={24}
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
                      480: { slidesPerView: 1.2, spaceBetween: 20 },
                      640: { slidesPerView: 1.5, spaceBetween: 24 },
                      768: { slidesPerView: 2, spaceBetween: 28 },
                      1024: { slidesPerView: 3, spaceBetween: 32 },
                      1280: { slidesPerView: 3, spaceBetween: 32 },
                    }}
                    modules={[Pagination, Navigation, Autoplay]}
                    className="mySwiper pb-12 md:pb-16"
                  >
                    {testimonials.map((t) => (
                      <SwiperSlide key={t._id as string}>
                        <div className="bg-white p-6 sm:p-8 rounded-xl md:rounded-2xl shadow-lg h-full flex flex-col border border-blue-100 hover:shadow-xl transition-all duration-300 mx-2">
                          <div className="flex-grow">
                            <svg
                              className="w-7 h-7 sm:w-8 sm:h-8 text-blue-300 mb-3 sm:mb-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="text-gray-700 italic text-base sm:text-lg mb-4 sm:mb-6 line-clamp-4">
                              &quot;{t.message}&quot;
                            </p>
                          </div>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-blue-900 text-sm sm:text-base">
                                  {t.name}
                                </h4>
                                <div className="flex mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
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
                                className="text-red-500 hover:text-red-700 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full hover:bg-red-50 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="swiper-button-next !hidden sm:!flex"></div>
                  <div className="swiper-button-prev !hidden sm:!flex"></div>
                </div>
              ) : (
                <div className="text-center py-10 sm:py-12 bg-white rounded-lg sm:rounded-xl shadow-inner border border-blue-100 max-w-2xl mx-auto">
                  <svg
                    className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-blue-300 mb-3 sm:mb-4"
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
                  <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-blue-800 mb-1 sm:mb-2">
                    No Testimonials Yet
                  </h3>
                  <p className="text-blue-600 text-sm sm:text-base">
                    Be the first to share your experience!
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add Testimonial Form */}
        <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg border border-blue-200 max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-blue-800 mb-4 sm:mb-6">
            Share Your Thoughts
          </h3>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-blue-700 mb-1"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@email.com"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-3 text-black py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div>
              <label
                htmlFor="testimonial"
                className="block text-xs sm:text-sm font-medium text-blue-700 mb-1"
              >
                Your Testimonial
              </label>
              <textarea
                id="testimonial"
                rows={4}
                placeholder="Share your experience..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="rating"
                className="block text-xs sm:text-sm font-medium text-blue-700 mb-1"
              >
                Rating (1-5)
              </label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border border-blue-200 rounded-lg px-3 py-2 sm:px-4 text-black sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <div className="flex justify-center">
                <button
                  onClick={addTestimonial}
                  disabled={posting}
                  className={`${
                    posting ? "opacity-60 cursor-not-allowed" : ""
                  }  bg-blue-600   text-white font-medium px-6 py-2 sm:px-8 sm:py-3 rounded-lg transition-all duration-300`}
                >
                  {posting ? "Posting..." : "Submit Testimonial"}
                </button>
              </div>

              {successMessage && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                  {successMessage}
                </div>
              )}
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
          width: 36px;
          height: 36px;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          top: 42%;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #eff6ff;
          transform: scale(1.1);
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 1rem;
        }
        @media (min-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 40px;
            height: 40px;
          }
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </section>
  );
}
