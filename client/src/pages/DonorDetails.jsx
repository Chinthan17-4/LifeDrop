import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Award, Clock, Heart, CheckCircle, AlertCircle, MessageCircle, ShieldCheck } from "lucide-react";
import { DEMO_DONORS } from "../data/donors";
import BloodGroupBadge from "../components/BloodGroupBadge";
import { formatDate, timeAgo, isDonorEligible } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export default function DonorDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [contactSent, setContactSent] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const donor = DEMO_DONORS.find((d) => d.id === id);

  if (!donor) {
    return (
      <div className="glass py-20 text-center max-w-lg mx-auto mt-10">
        <Heart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-gray-700">Donor Profile Not Found</h2>
        <Link to="/find-donors" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#C62828] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Donor Search
        </Link>
      </div>
    );
  }

  const eligible = isDonorEligible(donor.lastDonation);

  const handleContact = () => {
    addNotification({
      type: "contact",
      title: "Contact Request Sent",
      message: `Your contact details were shared with ${donor.name}.`,
      urgent: false,
    });
    setContactSent(true);
  };

  const handleBloodRequest = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addNotification({
      type: "request",
      title: "Direct Request Sent",
      message: `Your direct request was dispatched to ${donor.name} (${donor.bloodGroup}).`,
      urgent: false,
    });
    setRequestSent(true);
  };

  const level =
    donor.donationCount >= 20
      ? "Platinum"
      : donor.donationCount >= 10
      ? "Gold"
      : donor.donationCount >= 5
      ? "Silver"
      : "Bronze";

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back button */}
      <Link
        to="/find-donors"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </Link>

      {/* Main Profile Glass Card */}
      <div className="glass p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
            style={{ backgroundColor: donor.avatarColor }}
          >
            {donor.avatar}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{donor.name}</h1>
              <BloodGroupBadge bloodGroup={donor.bloodGroup} size="md" />
            </div>

            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {donor.area}, {donor.city}
              </span>
              <span>Age: {donor.age} yrs</span>
              <span>Weight: {donor.weight} kg</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1.5 ${
                  donor.available
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                    : "bg-gray-50 text-gray-400 border-gray-200/60"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${donor.available ? "bg-emerald-500" : "bg-gray-300"}`} />
                {donor.available ? "Available" : "Unavailable"}
              </span>

              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-amber-50 text-amber-700 border-amber-200/60 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> {level} Member
              </span>

              {eligible && donor.available && (
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-blue-50 text-blue-700 border-blue-200/60 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Ready to Donate
                </span>
              )}
            </div>
          </div>
        </div>

        {donor.bio && (
          <p className="text-xs sm:text-sm text-gray-600 glass-sm rounded-2xl p-4 leading-relaxed italic border-white/80">
            "{donor.bio}"
          </p>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-sm border-white/90 p-4 text-center">
            <p className="text-xl sm:text-2xl font-extrabold text-[#C62828]">{donor.donationCount}</p>
            <p className="text-[11px] text-gray-400 font-semibold uppercase mt-0.5">Donations</p>
          </div>
          <div className="glass-sm border-white/90 p-4 text-center">
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-1">{formatDate(donor.lastDonation)}</p>
            <p className="text-[11px] text-gray-400 font-semibold uppercase mt-1">Last Date</p>
          </div>
          <div className="glass-sm border-white/90 p-4 text-center">
            <p className="text-xs sm:text-sm font-bold text-gray-900 mt-1">{timeAgo(donor.lastDonation)}</p>
            <p className="text-[11px] text-gray-400 font-semibold uppercase mt-1">Gap</p>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">Direct Verification Contacts</h2>

          <div className="flex items-center justify-between p-3.5 rounded-2xl glass-sm border-white/85">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Telephone</p>
                <p className="text-xs font-bold text-gray-900">{donor.phone}</p>
              </div>
            </div>
            <a
              href={`tel:${donor.phone}`}
              className="text-xs font-bold btn-secondary px-3.5 py-1.5"
            >
              Call
            </a>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 border border-gray-100/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Email ID</p>
                <p className="text-xs font-bold text-gray-900">{donor.email}</p>
              </div>
            </div>
            <a
              href={`mailto:${donor.email}`}
              className="text-xs font-bold border border-[#C62828]/40 text-[#C62828] px-3.5 py-1.5 rounded-xl hover:bg-[#FDECEC] transition-colors"
            >
              Email
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {!requestSent ? (
            <button onClick={handleBloodRequest} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 fill-white" /> Request Blood Direct
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 py-3 rounded-xl text-xs font-bold">
              <CheckCircle className="w-4 h-4" /> Request Dispatched to Donor
            </div>
          )}

          {!contactSent ? (
            <button
              onClick={handleContact}
              className="w-full bg-white/70 border border-gray-200/80 text-gray-700 py-3 rounded-xl font-bold text-xs hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Share My Contact Details
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-700 border border-blue-200/80 py-3 rounded-xl text-xs font-bold">
              <CheckCircle className="w-4 h-4" /> Contact Shared Successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
