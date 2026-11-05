import React from "react";
import { Clock, MapPin, AlertCircle, CheckCircle, XCircle, Loader } from "lucide-react";
import BloodGroupBadge from "./BloodGroupBadge";
import { formatDate } from "../utils/helpers";

const STATUS_CONFIG = {
  pending:   { label: "Pending",   icon: Loader,      bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200/60" },
  matched:   { label: "Matched",   icon: CheckCircle, bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200/60" },
  fulfilled: { label: "Fulfilled", icon: CheckCircle, bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200/60" },
  cancelled: { label: "Cancelled", icon: XCircle,     bg: "bg-gray-50",    text: "text-gray-400",   border: "border-gray-200/60" },
  emergency: { label: "Emergency", icon: AlertCircle, bg: "bg-red-50",     text: "text-red-600",    border: "border-red-200/60" },
};

export default function RequestCard({ request, onAccept, onDecline, showActions }) {
  const cfg = STATUS_CONFIG[request.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  return (
    <div className={`glass p-5 ${request.isEmergency ? "border-l-4 border-l-[#C62828]" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{request.patientName}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              <MapPin className="w-3 h-3" />
              <span>{request.hospital}, {request.city}</span>
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>By {formatDate(request.neededBy)}</span>
        </div>
        <div>
          Units: <span className="font-semibold text-gray-700">{request.units}</span>
        </div>
        {request.isEmergency && (
          <div className="col-span-2 flex items-center gap-1 text-[#C62828] font-semibold">
            <AlertCircle className="w-3 h-3" /> Emergency Request
          </div>
        )}
      </div>

      {request.note && (
        <p className="mt-2.5 text-xs text-gray-500 bg-gray-50/60 rounded-xl px-3 py-2 border border-gray-100/60">{request.note}</p>
      )}

      {showActions && request.status === "pending" && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onAccept?.(request.id)}
            className="flex-1 text-sm font-semibold bg-[#C62828] text-white px-3 py-2.5 rounded-xl shadow-[0_2px_10px_rgba(198,40,40,0.3)] hover:bg-[#8E0000] hover:shadow-[0_4px_16px_rgba(198,40,40,0.4)] transition-all"
          >
            Accept
          </button>
          <button
            onClick={() => onDecline?.(request.id)}
            className="flex-1 text-sm font-semibold bg-white/60 border border-gray-200/80 text-gray-500 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}
