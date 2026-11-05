// Calculate distance between two lat/lng points (Haversine formula)
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? "s" : ""} ago`;
}

export function isDonorEligible(lastDonation) {
  if (!lastDonation) return true;
  const diff = Date.now() - new Date(lastDonation).getTime();
  const days = Math.floor(diff / 86400000);
  return days >= 56; // 8 weeks minimum gap
}

export function getBloodGroupColor(bg) {
  const colors = {
    "O+": "#C62828", "O-": "#B71C1C",
    "A+": "#1565C0", "A-": "#0D47A1",
    "B+": "#2E7D32", "B-": "#1B5E20",
    "AB+": "#6A1B9A", "AB-": "#4A148C",
  };
  return colors[bg] || "#6B7280";
}

export function generateId(prefix = "ID") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}

export function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}
