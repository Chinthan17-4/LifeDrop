import React, { useState, useEffect } from "react";
import { MapPin, SlidersHorizontal } from "lucide-react";
import { DEMO_DONORS, BLOOD_GROUPS } from "../data/donors";
import BloodGroupBadge from "../components/BloodGroupBadge";
import { Link } from "react-router-dom";

export default function DonorMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState(null);
  const [selectedBG, setSelectedBG] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")])
      .then(([rl, L]) => {
        delete L.default.Icon.Default.prototype._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
        setLeafletComponents(rl);
        setMapLoaded(true);
      })
      .catch(() => setMapLoaded(false));

    navigator.geolocation?.getCurrentPosition((pos) => {
      setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  const filtered = DEMO_DONORS.filter((d) => {
    if (selectedBG && d.bloodGroup !== selectedBG) return false;
    if (availableOnly && !d.available) return false;
    return true;
  });

  const center = userLocation || { lat: 12.8698, lng: 74.8426 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Regional Donor Map</h1>
          <p className="text-gray-400 text-sm mt-0.5">Explore geographic distribution and proximity of life-savers.</p>
        </div>

        {/* Filter controls */}
        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={selectedBG}
            onChange={(e) => setSelectedBG(e.target.value)}
            className="input-field text-xs py-2 w-auto"
          >
            <option value="">All Blood Types</option>
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-white/60 border border-gray-200/80 rounded-xl px-3 py-2 cursor-pointer hover:bg-white transition-all">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#C62828]"
            />
            Available Only
          </label>
        </div>
      </div>

      {/* Map Glass Wrapper */}
      <div className="glass p-2 overflow-hidden shadow-glass-lg relative">
        {mapLoaded && LeafletComponents ? (
          <MapView LC={LeafletComponents} filtered={filtered} center={center} userLocation={userLocation} />
        ) : (
          <div className="h-[460px] flex items-center justify-center flex-col gap-3 text-gray-400">
            <MapPin className="w-8 h-8 opacity-40 text-[#C62828] animate-bounce" />
            <p className="text-xs font-semibold">Initializing OpenStreetMap rendering engine...</p>
          </div>
        )}
      </div>

      {/* Dynamic Summary Bar */}
      <div className="glass p-4 flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-gray-600">
        <span className="flex items-center gap-1.5">
          📍 <strong>{filtered.length}</strong> Registered Donors Mapped
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <strong>{filtered.filter((d) => d.available).length}</strong> Ready & Active
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-400" />
          <strong>{filtered.filter((d) => !d.available).length}</strong> In Resting Gap
        </span>
      </div>

      <DonorListFallback donors={filtered} />
    </div>
  );
}

function MapView({ LC, filtered, center, userLocation }) {
  const { MapContainer, TileLayer, Marker, Popup, Circle } = LC;

  return (
    <div className="h-[460px] w-full rounded-xl overflow-hidden">
      <MapContainer center={[center.lat, center.lng]} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>📍 Current User Station</Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={10000}
              pathOptions={{ color: "#C62828", fillColor: "#C62828", fillOpacity: 0.05, weight: 1.5 }}
            />
          </>
        )}
        {filtered.map((donor) => (
          <Marker key={donor.id} position={[donor.lat, donor.lng]}>
            <Popup>
              <div className="p-1 min-w-[150px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-7 h-7 rounded-xl text-white text-[10px] flex items-center justify-center font-bold"
                    style={{ backgroundColor: donor.avatarColor }}
                  >
                    {donor.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-gray-900 leading-none">{donor.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{donor.city}</p>
                  </div>
                </div>
                <p className="text-[11px] font-semibold text-gray-700">Type: {donor.bloodGroup}</p>
                <p
                  className={`text-[10px] font-bold mt-1 ${
                    donor.available ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {donor.available ? "✓ Available" : "✗ Offline"}
                </p>
                <Link
                  to={`/donor/${donor.id}`}
                  className="mt-2 block text-center text-[10px] font-bold text-white bg-[#C62828] py-1 rounded-lg hover:bg-[#8E0000]"
                >
                  View Profile
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function DonorListFallback({ donors }) {
  return (
    <div className="space-y-3 pt-2">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
        Regional Directory ({donors.length})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {donors.map((d) => (
          <Link
            key={d.id}
            to={`/donor/${d.id}`}
            className="glass card-hover p-4 flex items-center gap-3.5"
          >
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
                <span className="text-xs text-gray-400 font-medium truncate">{d.city}</span>
              </div>
            </div>
            <span
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                d.available ? "bg-emerald-500 shadow-sm" : "bg-gray-300"
              }`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
