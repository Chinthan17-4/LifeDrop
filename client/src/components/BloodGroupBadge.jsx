import React from "react";

const BG_COLORS = {
  "O+": "bg-red-100 text-red-700 border-red-200",
  "O-": "bg-red-200 text-red-800 border-red-300",
  "A+": "bg-blue-100 text-blue-700 border-blue-200",
  "A-": "bg-blue-200 text-blue-800 border-blue-300",
  "B+": "bg-green-100 text-green-700 border-green-200",
  "B-": "bg-green-200 text-green-800 border-green-300",
  "AB+": "bg-purple-100 text-purple-700 border-purple-200",
  "AB-": "bg-purple-200 text-purple-800 border-purple-300",
};

export default function BloodGroupBadge({ bloodGroup, size = "md" }) {
  const colors = BG_COLORS[bloodGroup] || "bg-gray-100 text-gray-600 border-gray-200";
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5 font-bold",
    xl: "text-2xl px-6 py-2 font-bold",
  };
  return (
    <span className={`inline-flex items-center rounded-full border font-semibold ${colors} ${sizes[size]}`}>
      {bloodGroup}
    </span>
  );
}
