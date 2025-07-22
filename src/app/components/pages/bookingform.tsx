"use client";

import { useState } from "react";

interface BookingFormProps {
  roomType?: string;
  roomTypes?: string[];
  propertyId: string;
    onClose?: () => void;
}

export default function BookingForm({ roomType, roomTypes, propertyId }: BookingFormProps) {
  const [selectedRoomType, setSelectedRoomType] = useState(
    roomType || roomTypes?.[0] || ""
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !fromDate || !endDate || !selectedRoomType || !propertyId) return;
    setLoading(true);
    const payload = {
      name,
      email,
      fromDate,
      endDate,
      people,
      roomType: selectedRoomType,
      propertyId,
    };

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert("Booking submitted!");
      setName("");
      setEmail("");
      setFromDate("");
      setEndDate("");
      setPeople(1);
      if (!roomType) setSelectedRoomType(roomTypes?.[0] || "");
    } else {
      alert("Something went wrong.");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg space-y-4 my-8"
      >
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Book Now</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-blue-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-blue-200 rounded-lg p-2 md:p-3"
              required
            />
          </div>

          <div>
            <label className="block text-blue-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-blue-200 rounded-lg p-2 md:p-3"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-700 mb-1">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full border border-blue-200 rounded-lg p-2 md:p-3"
                required
              />
            </div>

            <div>
              <label className="block text-blue-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-blue-200 rounded-lg p-2 md:p-3"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-blue-700 mb-1">Number of People</label>
            <input
              type="number"
              min={1}
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
              className="w-full border border-blue-200 rounded-lg p-2 md:p-3"
              required
            />
          </div>

          {roomType ? (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-700 font-semibold">
                Room Type: <span className="text-blue-900">{roomType}</span>
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-blue-700 mb-1">
                Select Room Type
              </label>
              <select
                value={selectedRoomType}
                onChange={(e) => setSelectedRoomType(e.target.value)}
                className="w-full border border-blue-200 rounded-lg p-2 md:p-3"
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Booking"}{" "}
          </button>
        </div>
      </form>
    </div>
  );
}
