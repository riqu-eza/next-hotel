"use client";

import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FiTrash2, FiEye, FiEdit, FiCalendar, FiUser, FiMail, FiHome, FiUsers, FiTrendingUp, FiClock } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface Booking {
  _id: string;
  name: string;
  email: string;
  fromDate: string;
  endDate: string;
  people: number;
  roomType?: string;
  propertyId: string;
  createdAt: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<string>("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBookings(bookings.filter((b) => b._id !== id));
      } else {
        console.error("Failed to delete booking");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.propertyId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const now = new Date();
    const bookingDate = new Date(booking.fromDate);
    
    let matchesTimeRange = true;
    if (timeRange === "week") {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesTimeRange = bookingDate >= oneWeekAgo;
    } else if (timeRange === "month") {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      matchesTimeRange = bookingDate >= oneMonthAgo;
    }
    
    return matchesSearch && matchesTimeRange;
  });

  // Calculate analytics data
  const totalBookings = bookings.length;
  const upcomingBookings = bookings.filter(b => new Date(b.fromDate) > new Date()).length;
  const averageGroupSize = bookings.length > 0 
    ? (bookings.reduce((sum, b) => sum + b.people, 0) / bookings.length)
    : 0;

  // Prepare data for charts
  const bookingsByMonth = getBookingsByMonth(bookings);
  const roomTypeDistribution = getRoomTypeDistribution(bookings);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Booking Analytics Dashboard</h2>
            <p className="text-gray-600">Manage and analyze your property bookings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search bookings..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="month">Last Month</option>
              <option value="week">Last Week</option>
            </select>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Total Bookings</p>
                <h3 className="text-3xl font-bold mt-1">{totalBookings}</h3>
                <p className="text-sm text-gray-500 mt-1">All properties</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiTrendingUp className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Upcoming Bookings</p>
                <h3 className="text-3xl font-bold mt-1">{upcomingBookings}</h3>
                <p className="text-sm text-gray-500 mt-1">Future reservations</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiCalendar className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500">Avg. Group Size</p>
                <h3 className="text-3xl font-bold mt-1">{averageGroupSize.toFixed(1)}</h3>
                <p className="text-sm text-gray-500 mt-1">Guests per booking</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FiUsers className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Bookings by Month</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Room Type Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {roomTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm || timeRange !== "all" ? "Try adjusting your filters" : "All bookings are up to date"}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiMail className="mr-1" size={14} />
                              {booking.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiCalendar className="mr-2 text-gray-400" />
                          {new Date(booking.fromDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiCalendar className="mr-2 text-gray-400" />
                          {new Date(booking.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiUsers className="mr-2 text-gray-400" />
                          {booking.people} {booking.people > 1 ? 'guests' : 'guest'}
                        </div>
                        {booking.roomType && (
                          <div className="text-sm text-gray-500">
                            {booking.roomType}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiHome className="mr-2 text-gray-400" />
                          {booking.propertyId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => console.log('View booking', booking._id)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50"
                            title="View"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => console.log('Edit booking', booking._id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions for analytics data
function getBookingsByMonth(bookings: Booking[]) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const currentYear = new Date().getFullYear();
  const monthlyData = Array(12).fill(0).map((_, i) => ({
    month: months[i],
    bookings: 0
  }));

  bookings.forEach(booking => {
    const date = new Date(booking.fromDate);
    if (date.getFullYear() === currentYear) {
      monthlyData[date.getMonth()].bookings++;
    }
  });

  return monthlyData;
}

function getRoomTypeDistribution(bookings: Booking[]) {
  const roomTypes: Record<string, number> = {};

  bookings.forEach(booking => {
    const type = booking.roomType || "Unknown";
    roomTypes[type] = (roomTypes[type] || 0) + 1;
  });

  return Object.entries(roomTypes).map(([name, value]) => ({
    name,
    value
  }));
}