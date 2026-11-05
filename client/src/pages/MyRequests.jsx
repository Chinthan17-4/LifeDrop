import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Droplets, Trash2 } from "lucide-react";
import RequestCard from "../components/RequestCard";

const STATUS_OPTIONS = ["all", "pending", "matched", "fulfilled", "cancelled", "emergency"];

export default function MyRequests() {
  const [requests, setRequests] = useState(() => {
    return JSON.parse(localStorage.getItem("ld_my_requests") || "[]");
  });
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const handleDelete = (id) => {
    const updated = requests.filter((r) => r.id !== id);
    setRequests(updated);
    localStorage.setItem("ld_my_requests", JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">My Requests</h1>
          <p className="text-gray-400 text-sm mt-0.5">Manage and monitor statuses of your active blood requests.</p>
        </div>
        <Link to="/recipient/create-request" className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus className="w-4 h-4" /> New Blood Request
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="glass-sm p-1.5 flex flex-wrap gap-1">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              filter === s
                ? "bg-[#C62828] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-900 hover:bg-white/60"
            }`}
          >
            {s}{" "}
            {s !== "all" && (
              <span className="opacity-75 text-[10px]">({requests.filter((r) => r.status === s).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Result list */}
      {filtered.length === 0 ? (
        <div className="glass py-16 text-center text-gray-400">
          <Droplets className="w-10 h-10 text-gray-300 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-gray-700">No requests in this category</p>
          <p className="text-xs text-gray-400 mt-0.5">Change status filters or create a new request.</p>
          {filter === "all" && (
            <Link to="/recipient/create-request" className="mt-3 inline-block btn-primary text-xs py-2 px-4">
              Post Request
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((req) => (
            <div key={req.id} className="relative group">
              <RequestCard request={req} />
              <button
                onClick={() => handleDelete(req.id)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove request"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
