"use client";

import { IContent } from "@/models/content";
import { useEffect, useState } from "react";

export default function AdminContent() {
  const [contents, setContents] = useState<IContent[]>([]);
  const [header, setHeader] = useState("");
  const [subheader, setSubheader] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHeader, setEditHeader] = useState("");
  const [editSubheader, setEditSubheader] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const res = await fetch("/api/admin/content");
    const data = await res.json();
    setContents(data);
  };

  const handleCreate = async () => {
    if (!header.trim() || !subheader.trim()) return;
    
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ header, subheader }),
    });
    setHeader("");
    setSubheader("");
    await fetchContent();
  };

  const handleUpdate = async (id: string) => {
    if (!editHeader.trim() || !editSubheader.trim()) return;
    
    await fetch(`/api/admin/content/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ header: editHeader, subheader: editSubheader }),
    });
    setEditingId(null);
    await fetchContent();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    
    await fetch(`/api/admin/content/${id}`, {
      method: "DELETE",
    });
    await fetchContent();
  };

  const startEditing = (content: IContent) => {
    setEditingId(content._id as string);
    setEditHeader(content.header);
    setEditSubheader(content.subheader);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Content Management</h2>
      
      {/* Create Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Add New Content</h3>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Header"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Subheader"
            value={subheader}
            onChange={(e) => setSubheader(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 font-medium"
          >
            Add Content
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-700 p-6 border-b">Content List</h3>
        <ul className="divide-y divide-gray-200">
          {contents.map((c) => (
            <li key={c._id as string} className="p-6 hover:bg-gray-50">
              {editingId === c._id ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                    <input
                      type="text"
                      value={editHeader}
                      onChange={(e) => setEditHeader(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editSubheader}
                      onChange={(e) => setEditSubheader(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(c._id as string)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Content
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{c.header}</h4>
                    <p className="text-gray-600 mt-1">{c.subheader}</p>
                  </div>
                  <div className="flex space-x-2 mt-4 md:mt-0">
                    <button
                      onClick={() => startEditing(c)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id as string)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}