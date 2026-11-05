import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Award, Clock, Bell, ToggleLeft, ToggleRight, MapPin, Users, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import BloodGroupBadge from "../components/BloodGroupBadge";
import StatCard from "../components/StatCard";
import RequestCard from "../components/RequestCard";
import { formatDate, isDonorEligible } from "../utils/helpers";

const DEMO_INCOMING_REQUESTS = [
  {
    id: "REQ001",
    bloodGroup: "O+",
    patientName: "Rajesh Nair",
    hospital: "KMC Hospital",
    city: "Mangaluru",
    units: 2,
    neededBy: "2024-11-10",
    status: "pending",
    isEmergency: true,
    note: "Urgent surgery scheduled. Need O+ blood immediately.",
  },
  {
    id: "REQ002",
    bloodGroup: "O+",
    patientName: "Sunita Bhat",
    hospital: "AJ Hospital",
    city: "Mangaluru",
    units: 1,
    neededBy: "2024-11-15",
    status: "pending",
    isEmergency: false,
    note: "Scheduled operation. Any help appreciated.",
  },
];

export default function DonorDashboard() {
  const { user, updateUser } = useAuth();
  const { unreadCount } = useNotifications();
  const [available, setAvailable] = useState(user?.available ?? true);
  const [requests, setRequests] = useState(() => {
    const stored = localStorage.getItem("ld_donor_requests");
    return stored ? JSON.parse(stored) : DEMO_INCOMING_REQUESTS;
  });
  const [toggleLoading, setToggleLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const donationCount = user?.donationCount || 0;
  const eligible = isDonorEligible(user?.lastDonation);

  const handleToggle = async () => {
    setToggleLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const newVal = !available;
    setAvailable(newVal);
    updateUser({ available: newVal });
    setToggleLoading(false);
  };

  const handleAccept = (id) => {
    setRequests((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status: "matched" } : r));
      localStorage.setItem("ld_donor_requests", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDecline = (id) => {
    setRequests((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r));
      localStorage.setItem("ld_donor_requests", JSON.stringify(updated));
      return updated;
    });
  };

  const handleConfirmDonation = () => {
    updateUser({
      donationCount: donationCount + 1,
      lastDonation: new Date().toISOString().split("T")[0],
    });
    setShowConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Thank you for making a difference.</p>
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
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Heart className="w-4 h-4 fill-white" /> Log Donation
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="glass-dark p-7 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200/60 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirm Donation</h3>
              <p className="text-xs text-gray-400 mt-1">Did you complete a successful blood donation today?</p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl glass text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonation}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donor Profile Hero Card */}
      <div className="glass p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C62828] to-[#8E0000] text-white text-xl font-bold flex items-center justify-center shadow-[0_4px_16px_rgba(198,40,40,0.35)] flex-shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() || "D"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                <BloodGroupBadge bloodGroup={user?.bloodGroup} size="sm" />
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                    eligible
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                      : "bg-amber-50 text-amber-700 border-amber-200/60"
                  }`}
                >
                  {eligible ? "✓ Ready to Donate" : "⏳ Cool-down Period"}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {user?.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Last: {user?.lastDonation ? formatDate(user.lastDonation) : "Never"}
                </span>
                <span>
                  ID: <span className="font-mono text-gray-600">{user?.id}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Status</span>
            <button
              onClick={handleToggle}
              disabled={toggleLoading}
              className={`mt-1 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                available
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100"
                  : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {toggleLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : available ? (
                <ToggleRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-gray-400" />
              )}
              {available ? "Available" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Heart} label="Donations" value={donationCount} color="#C62828" bg="#FDECEC" />
        <StatCard icon={Users} label="Lives Saved" value={donationCount * 3} color="#10B981" bg="#ECFDF5" />
        <StatCard
          icon={Award}
          label="Donor Tier"
          value={donationCount >= 10 ? "Gold" : donationCount >= 5 ? "Silver" : "Bronze"}
          color="#F59E0B"
          bg="#FFFBEB"
        />
        <StatCard
          icon={Clock}
          label="Days Since Last"
          value={user?.lastDonation ? Math.floor((Date.now() - new Date(user.lastDonation)) / 86400000) : "—"}
          color="#3B82F6"
          bg="#EFF6FF"
        />
      </div>

      {/* Ineligible notification banner */}
      {!eligible && (
        <div className="glass p-4 border-l-4 border-l-amber-500 flex gap-3 items-center">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            Standard guidelines recommend at least 56 days between whole blood donations to ensure your body fully recovers.
          </p>
        </div>
      )}

      {/* Incoming Requests */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Active Incoming Requests</h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/70 border border-gray-200/60 text-gray-500">
            {requests.filter((r) => r.status === "pending").length} Pending
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="glass py-12 text-center text-gray-400">
            <Heart className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#C62828]" />
            <p className="text-xs font-medium">No pending requests right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                showActions={true}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fast Navigation Shortcut Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {[
          { to: "/find-donors", icon: Users, label: "Search Donors", desc: "Browse compatibility list" },
          { to: "/map", icon: MapPin, label: "Live Donor Map", desc: "Interactive regional radius" },
          { to: "/chatbot", icon: Heart, label: "AI Medical Guide", desc: "Instant eligibility insights" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="glass card-hover p-4 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C62828]/10 text-[#C62828] flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#C62828] transition-colors">
                  {item.label}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">{item.desc}</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#C62828] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
