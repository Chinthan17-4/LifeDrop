import { getDistanceKm } from "./helpers";

// Approx lat/lng centers for each city (used for distance ranking)
export const CITY_COORDS = {
  Mangaluru: { lat: 12.8698, lng: 74.8426 },
  Surathkal: { lat: 12.9947, lng: 74.7943 },
  Deralakatte: { lat: 12.8422, lng: 74.9029 },
  Udupi: { lat: 13.3409, lng: 74.7421 },
  Manipal: { lat: 13.3525, lng: 74.7797 },
  Kankanady: { lat: 12.8777, lng: 74.8524 },
  Kadri: { lat: 12.8805, lng: 74.8422 },
  Bejai: { lat: 12.8653, lng: 74.8451 },
};

/**
 * Rank donors by distance from a reference point.
 * @param {Array} donors
 * @param {{ lat: number, lng: number }} refPoint
 * @returns {Array} donors sorted by distance with `.distance` field added
 */
export function rankDonorsByDistance(donors, refPoint) {
  if (!refPoint) return donors;
  return donors
    .map((d) => ({
      ...d,
      distance: getDistanceKm(refPoint.lat, refPoint.lng, d.lat, d.lng),
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Build a Google Maps Directions URL for navigation.
 * Does NOT expose private donor addresses — only city-level for donors.
 */
export function buildDirectionsUrl(destination) {
  const dest = encodeURIComponent(`${destination.name}, ${destination.address}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
}

/**
 * Donor custom SVG marker data URL — available = green, unavailable = gray
 */
export function getDonorMarkerSVG(available) {
  const fill = available ? "#16A34A" : "#9CA3AF";
  const stroke = available ? "#15803D" : "#6B7280";
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
        <ellipse cx="18" cy="40" rx="8" ry="3" fill="rgba(0,0,0,0.15)"/>
        <path d="M18 2 C10 2 4 8.3 4 16 C4 25 18 40 18 40 C18 40 32 25 32 16 C32 8.3 26 2 18 2 Z"
          fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
        <circle cx="18" cy="16" r="8" fill="white" fill-opacity="0.9"/>
        <text x="18" y="20" text-anchor="middle" fill="${fill}" font-size="10" font-weight="bold" font-family="system-ui">🩸</text>
      </svg>
    `)
  );
}

/**
 * Hospital marker SVG
 */
export function getHospitalMarkerSVG() {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
        <ellipse cx="18" cy="40" rx="8" ry="3" fill="rgba(0,0,0,0.15)"/>
        <path d="M18 2 C10 2 4 8.3 4 16 C4 25 18 40 18 40 C18 40 32 25 32 16 C32 8.3 26 2 18 2 Z"
          fill="#1D4ED8" stroke="#1E40AF" stroke-width="1.5"/>
        <circle cx="18" cy="16" r="8" fill="white" fill-opacity="0.9"/>
        <text x="18" y="20" text-anchor="middle" fill="#1D4ED8" font-size="11" font-weight="bold" font-family="system-ui">🏥</text>
      </svg>
    `)
  );
}

/**
 * Blood bank marker SVG
 */
export function getBloodBankMarkerSVG() {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
        <ellipse cx="18" cy="40" rx="8" ry="3" fill="rgba(0,0,0,0.15)"/>
        <path d="M18 2 C10 2 4 8.3 4 16 C4 25 18 40 18 40 C18 40 32 25 32 16 C32 8.3 26 2 18 2 Z"
          fill="#C62828" stroke="#8E0000" stroke-width="1.5"/>
        <circle cx="18" cy="16" r="8" fill="white" fill-opacity="0.9"/>
        <text x="18" y="20" text-anchor="middle" fill="#C62828" font-size="11" font-weight="bold" font-family="system-ui">💉</text>
      </svg>
    `)
  );
}

/**
 * User location marker SVG
 */
export function getUserMarkerSVG() {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="#C62828" fill-opacity="0.15" stroke="#C62828" stroke-width="2"/>
        <circle cx="14" cy="14" r="6" fill="#C62828"/>
        <circle cx="14" cy="14" r="3" fill="white"/>
      </svg>
    `)
  );
}

