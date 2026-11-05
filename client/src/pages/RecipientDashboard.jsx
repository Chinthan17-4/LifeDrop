import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Plus, MapPin, Clock, AlertCircle, Users, Droplets, Bell, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import BloodGroupBadge from "../components/BloodGroupBadge";
import StatCard from "../components/StatCard";
import RequestCard from "../components/RequestCard";
import { DEMO_DONORS, BLOOD_COMPATIBILITY } from "../data/donors";

export default function RecipientDashboard() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [requests] = useState(() => {
    const stored = localStorage.getItem("ld_my_requests");
    return stored ? JSON.parse(stored) : [];
  });

  const compatible = user?.bloodGroup
    ? DEMO_DONORS.filter((d) => BLOOD_COMPATIBILITY[user.bloodGroup]?.includes(d.bloodGroup) && d.available)
    : DEMO_DONORS.filter((d) => d.available);

  const activeRequests = requests.filter((r) => r.status === "pending" || r.status === "matched");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Hello, <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Find matching donors or raise immediate requests.</p>
        </div>
        <div className="flex gap-2.5">
          <Link
            to="/notifications"
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-xs font-semibold text-gray-600 hover:text-gray-900 transition-all"
          >
            <Bell className="w-4 h-4 text-gray-500" />
            Alerts
            {unreadCount > 0 && (
              <span className="w-5 h-5 bg-[#C62828] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link to="/recipient/create-request" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Request Blood
          </Link>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <div className="glass p-5 border-l-4 border-l-[#C62828] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200/60 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-[#C62828]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Urgent or Critical Situation?</h3>
            <p className="text-xs text-gray-400 mt-0.5">Broadcast an instant emergency notification to nearby verified donors.</p>
          </div>
        </div>
        <Link
          to="/recipient/create-request?emergency=true"
          className="btn-primary whitespace-nowrap text-center text-xs self-start sm:self-auto"
        >
          🚨 Urgent Emergency Request
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Droplets} label="Requests Placed" value={requests.length} color="#C62828" bg="#FDECEC" />
        <StatCard icon={Clock} label="Active Tracking" value={activeRequests.length} color="#EA580C" bg="#FFF7ED" />
        <StatCard icon={Users} label="Nearby Matches" value={compatible.length} color="#10B981" bg="#ECFDF5" />
        <StatCard
          icon={Heart}
          label="Fulfilled"
          value={requests.filter((r) => r.status === "fulfilled").length}
          color="#3B82F6"
          bg="#EFF6FF"
        />
      </div>

      {/* Recent Requests Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Your Recent Requests</h2>
          <Link to="/recipient/my-requests" className="text-xs font-semibold text-[#C62828] hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="glass py-12 text-center text-gray-400">
            <Droplets className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#C62828]" />
            <p className="text-xs font-medium">No blood requests created yet.</p>
            <Link to="/recipient/create-request" className="mt-2.5 inline-flex text-xs font-bold text-[#C62828] hover:underline">
              Create your first request
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.slice(0, 4).map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </div>

      {/* Compatible Donors Quick View */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Available Donors for {user?.bloodGroup || "Your Area"}</h2>
          <Link to="/find-donors" className="text-xs font-semibold text-[#C62828] hover:underline flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {compatible.slice(0, 3).map((d) => (
            <div key={d.id} className="glass card-hover p-4 flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"
                style={{ backgroundColor: d.avatarColor }}
              >
                {d.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{d.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <BloodGroupBadge bloodGroup={d.bloodGroup} size="sm" />
                  <span className="text-xs text-gray-400 font-medium truncate flex items-center gap-0.5">
                    <MapPin className="w-3 h-3" /> {d.city}
                  </span>
                </div>
              </div>
              <Link
                to={`/donor/${d.id}`}
                className="text-xs font-bold text-[#C62828] hover:bg-[#FDECEC] px-2.5 py-1 rounded-lg transition-colors"
              >
                Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
