"use client";

import { IProperty, IServiceOffered } from "@/models/property";
import { useState, useEffect } from "react";
import Image from "next/image";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Define a plain interface for form state (without Mongoose document methods)
interface PropertyFormState {
  name: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  imageUrls: string[];
  servicesOffered: IServiceOffered[];
}

export default function AdminProperties() {
  const [form, setForm] = useState<PropertyFormState>({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    imageUrls: [],
    servicesOffered: [],
  });

  const [currentRoom, setCurrentRoom] = useState<IServiceOffered>({
    roomType: "",
    pricePerNight: 0,
    amenities: "",
    images: [],
  });

  const [roomImageInput, setRoomImageInput] = useState("");
  const [propertyImageInput, setPropertyImageInput] = useState("");
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
  const [propertyImageFile, setPropertyImageFile] = useState<File | null>(null);
  const [roomImageFile, setRoomImageFile] = useState<File | null>(null);
  const [isUploadingPropertyImage, setIsUploadingPropertyImage] =
    useState(false);
  const [isUploadingRoomImage, setIsUploadingRoomImage] = useState(false);
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const res = await fetch("/api/admin/property");
    const data = await res.json();
    setProperties(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoomChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentRoom({ ...currentRoom, [name]: value });
  };

const handleAddPropertyImage = async () => {
  if (!propertyImageFile) return;

  try {
    setIsUploadingPropertyImage(true);
    const storageRef = ref(storage, `properties/${Date.now()}_${propertyImageFile.name}`);
    const snapshot = await uploadBytes(storageRef, propertyImageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    setForm(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, downloadURL],
    }));
    setPropertyImageInput(""); // Clear input
    setPropertyImageFile(null); // Clear file
  } catch (error) {
    console.error("Error uploading property image:", error);
    alert("Error uploading image");
  } finally {
    setIsUploadingPropertyImage(false);
  }
};

const handleAddRoomImage = async () => {
  if (!roomImageFile) return;

  try {
    setIsUploadingRoomImage(true);
    const storageRef = ref(storage, `rooms/${Date.now()}_${roomImageFile.name}`);
    const snapshot = await uploadBytes(storageRef, roomImageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);

    setCurrentRoom(prev => ({
      ...prev,
      images: [...prev.images, downloadURL],
    }));
    setRoomImageInput(""); // Clear input
    setRoomImageFile(null); // Clear file
  } catch (error) {
    console.error("Error uploading room image:", error);
    alert("Error uploading image");
  } finally {
    setIsUploadingRoomImage(false);
  }
};

  const handleRemovePropertyImage = (index: number) => {
    const updated = [...form.imageUrls];
    updated.splice(index, 1);
    setForm({ ...form, imageUrls: updated });
  };

  const handleRemoveRoomImage = (index: number) => {
    const updated = [...currentRoom.images];
    updated.splice(index, 1);
    setCurrentRoom({ ...currentRoom, images: updated });
  };

  const handleAddRoom = () => {
    if (currentRoom.roomType.trim()) {
      if (editingRoomIndex !== null) {
        // Editing existing room
        const updatedRooms = [...form.servicesOffered];
        updatedRooms[editingRoomIndex] = currentRoom;
        setForm({ ...form, servicesOffered: updatedRooms });
        setEditingRoomIndex(null);
      } else {
        // Adding new room
        setForm({
          ...form,
          servicesOffered: [...form.servicesOffered, currentRoom],
        });
      }
      setCurrentRoom({
        roomType: "",
        pricePerNight: 0,
        amenities: "",
        images: [],
      });
    }
  };

  const handleEditRoom = (index: number) => {
    setCurrentRoom(form.servicesOffered[index]);
    setEditingRoomIndex(index);
  };

  const handleRemoveRoom = (index: number) => {
    const updated = [...form.servicesOffered];
    updated.splice(index, 1);
    setForm({ ...form, servicesOffered: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one room is added
    if (form.servicesOffered.length === 0) {
      alert("Please add at least one room type");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const body = editingId ? { ...form, _id: editingId } : form;
console.log("well on", body);
    const res = await fetch("/api/admin/property", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert(editingId ? "Property updated!" : "Property created!");
      resetForm();
      fetchProperties();
    } else {
      alert("Error saving property.");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      location: "",
      description: "",
      imageUrls: [],
      servicesOffered: [],
    });
    setCurrentRoom({
      roomType: "",
      pricePerNight: 0,
      amenities: "",
      images: [],
    });
    setEditingId(null);
    setEditingRoomIndex(null);
  };

  const handleEdit = (property: IProperty) => {
    setForm({
      name: property.name,
      email: property.email,
      phone: property.phone,
      location: property.location,
      description: property.description,
      imageUrls: property.imageUrls,
      servicesOffered: property.servicesOffered,
    });
    setEditingId(property._id as string);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    const res = await fetch(`/api/admin/property?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Property deleted.");
      fetchProperties();
    } else {
      alert("Error deleting property.");
    }
  };
const handlePropertyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setPropertyImageFile(e.target.files[0]);
    setPropertyImageInput(e.target.value);
  }
};

const handleRoomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    setRoomImageFile(e.target.files[0]);
    setRoomImageInput(e.target.value);
  }
};
  return (
   <div className="max-w-6xl mx-auto p-4 md:p-6">
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    {/* Form Section */}
    <div className="p-4 md:p-6 border-b border-gray-200">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        {editingId ? "✏️ Edit Property" : "➕ Add New Property"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Basic Info Grid - Stack on mobile, 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Luxury Villa"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="owner@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+254 794 369 806"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Nairobi, Kenya"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
              required
            />
          </div>
        </div>

        {/* Property Images - Stack upload controls on mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Images
          </label>
          <div className="flex flex-col md:flex-row gap-2 mb-3">
            <input
              type="file"
              accept="image/*"
              onChange={handlePropertyFileChange}
              value={propertyImageInput}
              className="flex-1 px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
              disabled={isUploadingPropertyImage}
            />
            <button
              type="button"
              onClick={handleAddPropertyImage}
              disabled={!propertyImageFile || isUploadingPropertyImage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-1 disabled:bg-blue-400 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {isUploadingPropertyImage ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Upload
                </>
              )}
            </button>
          </div>

          {form.imageUrls.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Property Images:
              </h4>
              <div className="flex flex-wrap gap-2">
                {form.imageUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <Image
                      src={url}
                      alt={`Property ${idx + 1}`}
                      width={80}
                      height={80}
                      className="h-16 w-16 md:h-20 md:w-20 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/100?text=Image+Error";
                      }}
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePropertyImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Room Types Section */}
        <div className="border-t border-gray-200 pt-4 md:pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3 md:mb-4">
            Room Types
          </h3>

          <div className="bg-gray-50 p-3 md:p-4 rounded-lg mb-4 md:mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2 md:mb-3">
              {editingRoomIndex !== null ? "Edit Room" : "Add New Room"}
            </h4>

            {/* Room fields - Stack on mobile, 3 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Type
                </label>
                <input
                  type="text"
                  name="roomType"
                  placeholder="Deluxe Suite"
                  value={currentRoom.roomType}
                  onChange={handleRoomChange}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Night (KSH)
                </label>
                <input
                  type="number"
                  name="pricePerNight"
                  placeholder="25000"
                  value={currentRoom.pricePerNight}
                  onChange={handleRoomChange}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </label>
                <input
                  type="text"
                  name="amenities"
                  placeholder="WiFi, AC, TV"
                  value={currentRoom.amenities}
                  onChange={handleRoomChange}
                  className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
                />
              </div>
            </div>

            {/* Room Images - Stack upload controls on mobile */}
            <div className="mb-3 md:mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Images
              </label>
              <div className="flex flex-col md:flex-row gap-2 mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleRoomFileChange}
                  value={roomImageInput}
                  className="flex-1 px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
                  disabled={isUploadingRoomImage}
                />
                <button
                  type="button"
                  onClick={handleAddRoomImage}
                  disabled={!roomImageFile || isUploadingRoomImage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center justify-center gap-1 disabled:bg-blue-400 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  {isUploadingRoomImage ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Upload
                    </>
                  )}
                </button>
              </div>

              {currentRoom.images.length > 0 && (
                <div className="bg-gray-100 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Room Images:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentRoom.images.map((url, idx) => (
                      <div key={idx} className="relative group">
                        <Image
                          src={url}
                          alt={`Room ${idx + 1}`}
                          width={80}
                          height={80}
                          className="h-16 w-16 md:h-20 md:w-20 object-cover rounded border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/100?text=Image+Error";
                          }}
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveRoomImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddRoom}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-1 w-full md:w-auto"
            >
              {editingRoomIndex !== null ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Update Room
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Room
                </>
              )}
            </button>
          </div>

          {form.servicesOffered.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                Added Rooms:
              </h4>
              {form.servicesOffered.map((room, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
                >
                  <div className="flex-1">
                    <h5 className="font-medium">{room.roomType}</h5>
                    <p className="text-sm text-gray-600">
                      KSH {room.pricePerNight}/night
                    </p>
                    {room.amenities && (
                      <p className="text-xs text-gray-500 mt-1">
                        {room.amenities}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 self-end md:self-auto">
                    <button
                      type="button"
                      onClick={() => handleEditRoom(idx)}
                      className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveRoom(idx)}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Description
          </label>
          <textarea
            name="description"
            placeholder="Describe the property..."
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm md:text-base"
          />
        </div>

        {/* Form Actions - Stack buttons on mobile */}
        <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition w-full md:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 w-full md:w-auto"
          >
            {editingId ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Update Property
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>

    {/* Properties List */}
    <div className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">
        Your Properties
      </h2>

      {properties.length === 0 ? (
        <div className="text-center py-6 md:py-8 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <p className="mt-2 text-sm md:text-base">
            No properties found. Add your first property above.
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {properties.map((property) => (
            <div
              key={property._id as string}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <div className="p-3 md:p-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-base md:text-lg text-gray-800">
                      {property.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {property.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-xs md:text-sm text-gray-500">
                      {property.servicesOffered.length} room types
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mt-1">
                      From KSH{" "}
                      {Math.min(
                        ...property.servicesOffered.map(
                          (r) => r.pricePerNight
                        )
                      )}
                      /night
                    </span>
                  </div>
                </div>

                {property.description && (
                  <p className="text-xs md:text-sm text-gray-600 mt-2 line-clamp-2">
                    {property.description}
                  </p>
                )}

                {property.imageUrls.length > 0 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {property.imageUrls.slice(0, 4).map((url, idx) => (
                      <Image
                        key={idx}
                        src={url}
                        alt={`Property ${idx + 1}`}
                        width={64}
                        height={64}
                        className="h-14 w-14 md:h-16 md:w-16 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/100?text=Image+Error";
                        }}
                        unoptimized
                      />
                    ))}
                    {property.imageUrls.length > 4 && (
                      <div className="h-14 w-14 md:h-16 md:w-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                        +{property.imageUrls.length - 4} more
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 mt-3 md:mt-4">
                  <button
                    onClick={() => handleEdit(property)}
                    className="text-xs md:text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 md:px-3 md:py-1 rounded flex items-center gap-1 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 md:h-4 md:w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property._id as string)}
                    className="text-xs md:text-sm bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 md:px-3 md:py-1 rounded flex items-center gap-1 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 md:h-4 md:w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
  );
}
