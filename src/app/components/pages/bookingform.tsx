"use client";

import { useState } from "react";

interface BookingFormProps {
  roomType?: string;
  roomTypes?: string[];
  propertyId: string;
  onClose?: () => void;
}

export default function BookingForm({
  roomType,
  roomTypes,
  propertyId,
}: BookingFormProps) {
  const [selectedRoomType, setSelectedRoomType] = useState(
    roomType || roomTypes?.[0] || ""
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !fromDate || !endDate || !selectedRoomType || !propertyId) return;

    setLoading(true);
    setSuccessMessage(""); // clear any previous message

    const payload = {
      name,
      email,
      fromDate,
      endDate,
      people,
      roomType: selectedRoomType,
      propertyId,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMessage("✅ Booking successful! Please check your email for confirmation.");
        setName("");
        setEmail("");
        setFromDate("");
        setEndDate("");
        setPeople(1);
        if (!roomType) setSelectedRoomType(roomTypes?.[0] || "");
      } else {
        setSuccessMessage("❌ Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-4 my-8"
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Book Now</h2>

        {successMessage && (
          <div
            className={`p-3 rounded-lg text-sm ${
              successMessage.startsWith("✅")
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {successMessage}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-blue-700 mb-1 font-medium">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-blue-300 rounded-lg p-2 md:p-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-blue-700 mb-1 font-medium">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-blue-300 rounded-lg p-2 md:p-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            required
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-700 mb-1 font-medium">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border-2 border-blue-300 rounded-lg p-2 md:p-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label className="block text-blue-700 mb-1 font-medium">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-2 border-blue-300 rounded-lg p-2 md:p-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              required
            />
          </div>
        </div>

        {/* People */}
        <div>
          <label className="block text-blue-700 mb-1 font-medium">Number of People</label>
          <input
            type="number"
            min={1}
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="w-full border-2 border-blue-300 rounded-lg p-2 md:p-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
            required
          />
        </div>

        {/* Room Type */}
        {roomType ? (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-700 font-semibold">
              Room Type: <span className="text-blue-900">{roomType}</span>
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-blue-700 mb-1 font-medium">Select Room Type</label>
            <select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="w-full border-2 border-blue-300 rounded-lg p-2 md:p-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
              required
            >
              {roomTypes?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
}
