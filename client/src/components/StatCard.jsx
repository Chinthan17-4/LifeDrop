import React from "react";

export default function StatCard({ icon: Icon, label, value, color = "#C62828", bg = "#FDECEC" }) {
  return (
    <div className="glass card-hover p-5 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        <p className="text-xs text-gray-400 font-medium mt-0.5 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}
