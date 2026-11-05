import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Search, Info, X, Navigation, ExternalLink,
  Users, Droplets, Hospital as HospitalIcon, Filter,
} from "lucide-react";
import { DEMO_DONORS, BLOOD_GROUPS } from "../data/donors";
import { HOSPITALS, BLOOD_BANKS } from "../data/hospitals";
import BloodGroupBadge from "../components/BloodGroupBadge";
import { rankDonorsByDistance, buildDirectionsUrl } from "../utils/mapHelpers";
import { getDistanceKm } from "../utils/helpers";

const DEFAULT_CENTER = [12.9141, 74.856]; // Mangaluru centre

export default function DonorMap() {
  const [leafletReady, setLeafletReady] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState(null);
  const [L, setL] = useState(null);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, leaflet]) => {
      const LDefault = leaflet.default;
      // Fix default marker icons for Vite/Webpack bundlers
      delete LDefault.Icon.Default.prototype._getIconUrl;
      LDefault.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
      setL(LDefault);
      setLeafletComponents(rl);
      setLeafletReady(true);
    }).catch(() => setLeafletReady(false));
  }, []);

  if (!leafletReady || !LeafletComponents || !L) {
    return <MapLoadingState />;
  }

  return <MapView LC={LeafletComponents} L={L} />;
}

// ─── Full Map View ─────────────────────────────────────────────────────────────
function MapView({ LC, L }) {
  const { MapContainer, TileLayer, Marker, Popup, useMap, Circle } = LC;

  const [selectedBG, setSelectedBG] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showHospitals, setShowHospitals] = useState(true);
  const [showBloodBanks, setShowBloodBanks] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [nearbyDonors, setNearbyDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter donors
  const filteredDonors = DEMO_DONORS.filter((d) => {
    if (selectedBG && d.bloodGroup !== selectedBG) return false;
    if (availableOnly && !d.available) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.bloodGroup.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const availableCount = filteredDonors.filter((d) => d.available).length;

  // Get user geolocation
  const handleLocate = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert("Location access denied. Please enable location permissions.")
    );
  };

  // Build custom DivIcon for donors
  const donorIcon = (available) =>
    L.divIcon({
      className: "",
      html: `
        <div style="
          width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
          background:${available ? "#16A34A" : "#9CA3AF"};
          border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
        ">
          <div style="transform:rotate(45deg);color:white;font-size:10px;font-weight:800">
            ●
          </div>
        </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -34],
    });

  const hospitalIcon = () =>
    L.divIcon({
      className: "",
      html: `
        <div style="
          width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
          background:#1D4ED8;
          border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
        ">
          <div style="transform:rotate(45deg);color:white;font-size:14px;text-align:center;line-height:28px;">
            🏥
          </div>
        </div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -36],
    });

  const bloodBankIcon = () =>
    L.divIcon({
      className: "",
      html: `
        <div style="
          width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
          background:#C62828;
          border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
        ">
          <div style="transform:rotate(45deg);color:white;font-size:14px;text-align:center;line-height:28px;">
            💉
          </div>
        </div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -36],
    });

  const userIcon = () =>
    L.divIcon({
      className: "",
      html: `
        <div style="
          width:20px;height:20px;border-radius:50%;
          background:#C62828;
          border:3px solid white;
          box-shadow:0 0 0 4px rgba(198,40,40,0.25),0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -14],
    });

  // Map pan-to-user helper component
  function PanToUser({ location }) {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.flyTo([location.lat, location.lng], 13, { duration: 1.2 });
      }
    }, [location]);
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Regional Blood Donor Map
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Donors, hospitals &amp; blood banks across coastal Karnataka.
          </p>
        </div>
        <button
          onClick={handleLocate}
          className="flex items-center gap-2 glass-sm px-3.5 py-2.5 text-xs font-bold text-[#C62828] hover:bg-red-50 transition-colors flex-shrink-0"
        >
          <Navigation className="w-3.5 h-3.5" />
          My Location
        </button>
      </div>

      {/* Demo notice */}
      <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/60 rounded-xl px-4 py-2.5 text-xs font-semibold text-amber-700">
        <Info className="w-3.5 h-3.5 flex-shrink-0" />
        DEMO DATA — Marker positions are approximate city-level locations. No private donor addresses shown.
      </div>

      {/* Stats bar */}
      <div className="glass p-4 grid grid-cols-4 gap-3 text-center">
        <div>
          <p className="text-xl font-extrabold text-gray-900">{filteredDonors.length}</p>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">Donors</p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-emerald-600">{availableCount}</p>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">Available</p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-blue-600">{HOSPITALS.length}</p>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">Hospitals</p>
        </div>
        <div>
          <p className="text-xl font-extrabold text-[#C62828]">{BLOOD_BANKS.length}</p>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-0.5">Blood Banks</p>
        </div>
      </div>

      {/* Search + Filter bar */}
      <div className="glass p-4 space-y-3">
        <div className="flex gap-2.5 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-48 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search donor name, city or blood group…"
              className="input-field pl-10 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Blood group filter */}
          <select
            value={selectedBG}
            onChange={(e) => setSelectedBG(e.target.value)}
            className="input-field w-auto text-xs py-2.5"
          >
            <option value="">All Blood Types</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        {/* Layer Toggles */}
        <div className="flex gap-2 flex-wrap items-center">
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 glass-sm px-3.5 py-2 cursor-pointer hover:bg-white/80 transition-all rounded-xl">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#C62828]"
            />
            Available Only
          </label>
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showHospitals
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white/60 border-gray-200 text-gray-500"
            }`}
          >
            🏥 Hospitals
          </button>
          <button
            onClick={() => setShowBloodBanks(!showBloodBanks)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              showBloodBanks
                ? "bg-[#C62828] text-white border-[#C62828] shadow-sm"
                : "bg-white/60 border-gray-200 text-gray-500"
            }`}
          >
            💉 Blood Banks
          </button>
          <button
            onClick={() => { setSelectedBG(""); setAvailableOnly(false); setShowHospitals(true); setShowBloodBanks(true); setSearchQuery(""); }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white/60 text-gray-500 hover:text-gray-900 transition-all"
          >
            <X className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="glass p-2 shadow-glass-lg">
        <div className="rounded-xl overflow-hidden" style={{ height: "520px" }}>
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Pan to user when location obtained */}
            {userLocation && <PanToUser location={userLocation} />}

            {/* User location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon()}>
                <Popup>
                  <div className="text-xs font-bold text-gray-900">📍 Your Location</div>
                </Popup>
              </Marker>
            )}

            {/* Donor markers */}
            {filteredDonors.map((d) => {
              const dist = userLocation
                ? getDistanceKm(userLocation.lat, userLocation.lng, d.lat, d.lng).toFixed(1)
                : null;
              return (
                <Marker key={d.id} position={[d.lat, d.lng]} icon={donorIcon(d.available)}>
                  <Popup maxWidth={240}>
                    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: "4px", minWidth: "200px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                        <div style={{
                          width: "36px", height: "36px", borderRadius: "10px",
                          background: d.avatarColor, color: "white", fontWeight: "700",
                          fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {d.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: "800", fontSize: "13px", color: "#111827" }}>{d.name}</div>
                          <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "2px" }}>
                            {d.city} · Age {d.age}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                        <span style={{ background: "#FDECEC", color: "#C62828", padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", border: "1px solid #fecaca" }}>
                          {d.bloodGroup}
                        </span>
                        <span style={{
                          background: d.available ? "#ECFDF5" : "#F9FAFB",
                          color: d.available ? "#15803D" : "#9CA3AF",
                          padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "700"
                        }}>
                          {d.available ? "● Available" : "○ Unavailable"}
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "6px" }}>
                        🏆 {d.donationCount} donations{dist ? ` · 📍 ~${dist} km` : ""}
                      </div>
                      <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "8px", fontStyle: "italic" }}>
                        ⚠️ Demo Profile — Approx. city location only
                      </div>
                      <a href={`/donor/${d.id}`} style={{
                        display: "block", textAlign: "center",
                        background: "#C62828", color: "white",
                        padding: "6px 12px", borderRadius: "8px",
                        fontSize: "11px", fontWeight: "700", textDecoration: "none"
                      }}>
                        View Full Profile →
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Hospital markers */}
            {showHospitals && HOSPITALS.map((h) => (
              <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon()}>
                <Popup maxWidth={240}>
                  <FacilityPopup facility={h} type="hospital" userLocation={userLocation} />
                </Popup>
              </Marker>
            ))}

            {/* Blood bank markers */}
            {showBloodBanks && BLOOD_BANKS.map((bb) => (
              <Marker key={bb.id} position={[bb.lat, bb.lng]} icon={bloodBankIcon()}>
                <Popup maxWidth={240}>
                  <FacilityPopup facility={bb} type="bloodbank" userLocation={userLocation} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Map Legend */}
      <div className="glass-sm p-4 flex flex-wrap gap-5 text-xs font-semibold text-gray-500">
        <span className="font-bold text-gray-700 uppercase tracking-wide text-[11px]">Legend:</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Available Donor</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-gray-400" /> Unavailable Donor</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600" /> Hospital</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#C62828]" /> Blood Bank</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#C62828] ring-2 ring-[#C62828] ring-offset-1 opacity-80" />
          Your Location
        </span>
      </div>

      {/* Donor Directory */}
      <DonorDirectory donors={filteredDonors} userLocation={userLocation} />
    </div>
  );
}

// ─── Facility Popup (inline HTML for Leaflet) ─────────────────────────────────
function FacilityPopup({ facility, type, userLocation }) {
  const dist = userLocation
    ? getDistanceKm(userLocation.lat, userLocation.lng, facility.lat, facility.lng).toFixed(1)
    : null;
  const isHospital = type === "hospital";
  const color = isHospital ? "#1D4ED8" : "#C62828";

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", padding: "4px", minWidth: "200px" }}>
      <div style={{ fontSize: "18px", marginBottom: "6px" }}>{isHospital ? "🏥" : "💉"}</div>
      <div style={{ fontWeight: "800", fontSize: "13px", color: "#111827", marginBottom: "2px" }}>{facility.name}</div>
      <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "8px" }}>{facility.address}</div>
      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "8px" }}>
        {dist && (
          <span style={{ background: "#EFF6FF", color: "#1D4ED8", padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
            📍 {dist} km
          </span>
        )}
        {facility.operatingHours && (
          <span style={{ background: "#F3F4F6", color: "#374151", padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
            🕐 {facility.operatingHours}
          </span>
        )}
        {facility.bloodBank && (
          <span style={{ background: "#FDECEC", color: "#C62828", padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "700" }}>
            💉 Blood Bank
          </span>
        )}
      </div>
      {facility.phone && (
        <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "8px" }}>📞 {facility.phone}</div>
      )}
      <div style={{ fontSize: "10px", color: "#9CA3AF", fontStyle: "italic", marginBottom: "8px" }}>
        ⚠️ Demo Data — Approximate location shown
      </div>
      <a
        href={buildDirectionsUrl(facility)}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block", textAlign: "center",
          background: color, color: "white",
          padding: "6px 12px", borderRadius: "8px",
          fontSize: "11px", fontWeight: "700", textDecoration: "none"
        }}
      >
        Open in Google Maps →
      </a>
    </div>
  );
}

// ─── Donor Directory List ─────────────────────────────────────────────────────
function DonorDirectory({ donors, userLocation }) {
  const ranked = userLocation ? rankDonorsByDistance(donors, userLocation) : donors;

  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        Donor Directory ({donors.length} Profiles)
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {ranked.map((d) => (
          <Link key={d.id} to={`/donor/${d.id}`} className="glass card-hover p-4 flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: d.avatarColor }}
            >
              {d.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{d.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <BloodGroupBadge bloodGroup={d.bloodGroup} size="sm" />
                <span className="text-xs text-gray-400 font-medium">{d.city}</span>
                {d.distance != null && (
                  <span className="text-xs font-bold text-[#C62828]">{d.distance.toFixed(1)} km</span>
                )}
              </div>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${d.available ? "bg-emerald-500" : "bg-gray-300"}`} />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────
function MapLoadingState() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Regional Blood Donor Map</h1>
        <p className="text-gray-400 text-sm mt-0.5">Loading map engine…</p>
      </div>
      <div className="glass p-2">
        <div className="rounded-xl bg-gray-50 flex items-center justify-center flex-col gap-4" style={{ height: "520px" }}>
          <div
            className="w-12 h-12 border-t-[#C62828] rounded-full animate-spin border-gray-200"
            style={{ borderWidth: 3, borderTopColor: "#C62828" }}
          />
          <p className="text-sm font-semibold text-gray-500">Loading map…</p>
        </div>
      </div>
    </div>
  );
}
