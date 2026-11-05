import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Award, Phone } from "lucide-react";
import BloodGroupBadge from "./BloodGroupBadge";
import { timeAgo } from "../utils/helpers";

export default function DonorCard({ donor, distance }) {
  return (
    <div className="glass card-hover p-5">
      {donor.isDemo && (
        <div className="text-[10px] text-amber-600 bg-amber-50/80 border border-amber-200/60 rounded-lg px-2 py-0.5 inline-block mb-3 font-semibold tracking-wide uppercase">
          Demo
        </div>
      )}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm"
          style={{ background: `linear-gradient(135deg, ${donor.avatarColor || "#C62828"}, ${donor.avatarColor || "#C62828"}cc)` }}
        >
          {donor.avatar || donor.name?.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{donor.name}</h3>
            <BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" />
          </div>

          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
              donor.available
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : "bg-gray-50 text-gray-400 border border-gray-200/60"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${donor.available ? "bg-emerald-400" : "bg-gray-300"}`}></span>
              {donor.available ? "Available" : "Unavailable"}
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span>{donor.city}</span>
              {distance != null && (
                <span className="text-[#C62828] font-semibold">· {distance.toFixed(1)} km</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{timeAgo(donor.lastDonation)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Award className="w-3 h-3" />
              <span>{donor.donationCount} donations</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>Age {donor.age}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/donor/${donor.id}`}
          className="flex-1 text-center text-sm font-semibold border border-[#C62828]/30 text-[#C62828] px-3 py-2 rounded-xl hover:bg-[#C62828]/5 hover:border-[#C62828]/50 transition-all bg-white/40"
        >
          View Profile
        </Link>
        {donor.available && (
          <a
            href={`tel:${donor.phone}`}
            className="flex items-center gap-1.5 text-sm font-semibold bg-[#C62828] text-white px-3 py-2 rounded-xl shadow-[0_2px_10px_rgba(198,40,40,0.3)] hover:bg-[#8E0000] hover:shadow-[0_4px_16px_rgba(198,40,40,0.4)] transition-all"
          >
            <Phone className="w-3.5 h-3.5" /> Contact
          </a>
        )}
      </div>
    </div>
  );
}
