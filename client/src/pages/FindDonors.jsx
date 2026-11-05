import React, { useState, useMemo } from "react";
import { Search, X, SlidersHorizontal, MapPin } from "lucide-react";
import { DEMO_DONORS, BLOOD_GROUPS, CITIES } from "../data/donors";
import DonorCard from "../components/DonorCard";
import { getDistanceKm } from "../utils/helpers";

const CITY_COORDS = {
  Mangaluru: { lat: 12.8698, lng: 74.8426 },
  Surathkal: { lat: 12.9947, lng: 74.7943 },
  Deralakatte: { lat: 12.8422, lng: 74.9029 },
  Udupi: { lat: 13.3409, lng: 74.7421 },
  Manipal: { lat: 13.3525, lng: 74.7797 },
  Kankanady: { lat: 12.8777, lng: 74.8524 },
  Kadri: { lat: 12.8805, lng: 74.8422 },
  Bejai: { lat: 12.8653, lng: 74.8451 },
};

export default function FindDonors() {
  const [search, setSearch] = useState("");
  const [selectedBG, setSelectedBG] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  const refCoords = selectedCity ? CITY_COORDS[selectedCity] : null;

  const filtered = useMemo(() => {
    let list = [...DEMO_DONORS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.bloodGroup.toLowerCase().includes(q)
      );
    }
    if (selectedBG) list = list.filter((d) => d.bloodGroup === selectedBG);
    if (selectedCity) list = list.filter((d) => d.city === selectedCity);
    if (availableOnly) list = list.filter((d) => d.available);

    list = list.map((d) => ({
      ...d,
      distance: refCoords ? getDistanceKm(refCoords.lat, refCoords.lng, d.lat, d.lng) : null,
    }));

    if (sortBy === "distance" && refCoords) list.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    else if (sortBy === "donations") list.sort((a, b) => b.donationCount - a.donationCount);
    else list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [search, selectedBG, selectedCity, availableOnly, sortBy, refCoords]);

  const clearFilters = () => {
    setSearch("");
    setSelectedBG("");
    setSelectedCity("");
    setAvailableOnly(false);
  };

  const hasFilters = search || selectedBG || selectedCity || availableOnly;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Find Donors</h1>
        <p className="text-gray-400 text-sm mt-0.5">Explore available community life-savers by blood group and city.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass p-4 sm:p-5 space-y-3.5">
        <div className="flex gap-2.5">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, blood group, or city..."
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              showFilters
                ? "bg-[#C62828]/10 border-[#C62828] text-[#C62828]"
                : "border-gray-200/80 bg-white/60 text-gray-600 hover:bg-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {hasFilters && <span className="w-2 h-2 bg-[#C62828] rounded-full" />}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="border-t border-gray-100/80 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Blood Type</label>
              <select
                value={selectedBG}
                onChange={(e) => setSelectedBG(e.target.value)}
                className="input-field py-2 text-xs"
              >
                <option value="">All Groups</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="input-field py-2 text-xs"
              >
                <option value="">All Regions</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Sort Order</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field py-2 text-xs"
              >
                <option value="name">Alphabetical</option>
                <option value="distance">Proximity (Select City first)</option>
                <option value="donations">Experience (Donations)</option>
              </select>
            </div>
            <div className="sm:col-span-3 flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-600">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#C62828] rounded"
                />
                Available Donors Only
              </label>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs font-bold text-[#C62828] hover:underline"
                >
                  <X className="w-3.5 h-3.5" /> Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Blood Group Quick Pill Selection */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            onClick={() => setSelectedBG("")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              !selectedBG
                ? "bg-[#C62828] text-white border-[#C62828] shadow-[0_2px_10px_rgba(198,40,40,0.35)]"
                : "glass-sm border-white/80 text-gray-600 hover:bg-white/90"
            }`}
          >
            All
          </button>
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              onClick={() => setSelectedBG(bg === selectedBG ? "" : bg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedBG === bg
                  ? "bg-[#C62828] text-white border-[#C62828] shadow-[0_2px_10px_rgba(198,40,40,0.35)]"
                  : "glass-sm border-white/80 text-gray-600 hover:bg-white/90"
              }`}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Found <span className="text-gray-900 font-bold">{filtered.length}</span> Donor Profiles
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="glass py-16 text-center text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#C62828]" />
            <p className="text-sm font-semibold text-gray-600">No matching donors found</p>
            <p className="text-xs text-gray-400 mt-0.5">Try widening your filters or clearing search terms.</p>
            <button onClick={clearFilters} className="mt-3 text-xs font-bold text-[#C62828] hover:underline">
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((donor) => (
              <DonorCard key={donor.id} donor={donor} distance={donor.distance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
