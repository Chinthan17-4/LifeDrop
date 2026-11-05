import React, { useState, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle, Heart, ArrowLeft, Send } from "lucide-react";
import { BLOOD_GROUPS, CITIES, DEMO_DONORS } from "../data/donors";
import { HOSPITALS } from "../data/hospitals";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { generateId } from "../utils/helpers";
import { useGoogleMaps } from "../hooks/useGoogleMaps";
import DonorCard from "../components/DonorCard";

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

export default function CreateRequest() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [params] = useSearchParams();
  const isEmergencyParam = params.get("emergency") === "true";
  const { status: mapsStatus } = useGoogleMaps(MAPS_API_KEY);
  const hospitalRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [submitted, setSubmitted] = useState(false);
  const [matchedDonors, setMatchedDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: user?.bloodGroup || "",
    units: "1",
    hospital: "",
    city: user?.city || "",
    neededBy: "",
    isEmergency: isEmergencyParam,
    note: "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  // Attach Places Autocomplete to hospital input when Google Maps is ready
  useEffect(() => {
    if (mapsStatus !== "ready" || !hospitalRef.current || autocompleteRef.current) return;
    if (!window.google?.maps?.places) return;

    const ac = new window.google.maps.places.Autocomplete(hospitalRef.current, {
      componentRestrictions: { country: "IN" },
      types: ["hospital", "health"],
      fields: ["name", "formatted_address", "address_components"],
    });

    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (place.name) {
        setForm((p) => ({ ...p, hospital: place.name }));
        setErrors((p) => ({ ...p, hospital: "" }));
        // Try to auto-fill city from address components
        const cityComp = place.address_components?.find(
          (c) => c.types.includes("locality") || c.types.includes("administrative_area_level_2")
        );
        if (cityComp) {
          const matchedCity = CITIES.find((c) =>
            cityComp.long_name.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(cityComp.long_name.toLowerCase())
          );
          if (matchedCity) {
            setForm((p) => ({ ...p, city: matchedCity }));
            setErrors((p) => ({ ...p, city: "" }));
          }
        }
      }
    });

    autocompleteRef.current = ac;
  }, [mapsStatus]);

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required";
    if (!form.bloodGroup) e.bloodGroup = "Select blood group";
    if (!form.hospital.trim()) e.hospital = "Hospital location is required";
    if (!form.city) e.city = "City location is required";
    if (!form.neededBy) e.neededBy = "Target date is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const matched = DEMO_DONORS.filter((d) => d.available && d.bloodGroup === form.bloodGroup).slice(0, 4);
    setMatchedDonors(matched);

    const request = {
      id: generateId("REQ"),
      ...form,
      units: parseInt(form.units),
      status: form.isEmergency ? "emergency" : "pending",
      createdAt: new Date().toISOString(),
      requestedBy: user?.id,
    };
    const existing = JSON.parse(localStorage.getItem("ld_my_requests") || "[]");
    localStorage.setItem("ld_my_requests", JSON.stringify([request, ...existing]));

    addNotification({
      type: "request",
      title: form.isEmergency ? "🚨 Emergency Broadcast Live!" : "Blood Request Published",
      message: `Your request for ${form.bloodGroup} blood at ${form.hospital} is now broadcasting.`,
      urgent: form.isEmergency,
    });

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="glass p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200/60 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Request Dispatched</h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            {form.isEmergency
              ? "Urgent notification distributed to all compatible active donors in the area."
              : "Your request is registered and waiting for donors to confirm readiness."}
          </p>

          <div className="flex gap-2.5 justify-center pt-2">
            <Link
              to="/recipient/my-requests"
              className="py-2.5 px-4 rounded-xl glass text-xs font-semibold text-gray-700 hover:bg-gray-100"
            >
              Track in My Requests
            </Link>
            <Link to="/recipient/dashboard" className="btn-primary text-xs py-2.5 px-4">
              Return to Dashboard
            </Link>
          </div>
        </div>

        {matchedDonors.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Immediate Matching Donors ({matchedDonors.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {matchedDonors.map((d) => (
                <DonorCard key={d.id} donor={d} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <Link
        to="/recipient/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" /> Cancel & Return
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Create Blood Request</h1>
        <p className="text-gray-400 text-sm mt-0.5">Publish a direct request to connect with compatible life-savers.</p>
      </div>

      {/* Emergency Toggle Card */}
      <div
        onClick={() => set("isEmergency", !form.isEmergency)}
        className={`glass p-4 sm:p-5 flex items-center justify-between cursor-pointer transition-all border-2 ${
          form.isEmergency ? "border-[#C62828] bg-red-50/50" : "border-transparent"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              form.isEmergency ? "bg-[#C62828] text-white" : "bg-gray-100 text-gray-400"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-gray-900">
              {form.isEmergency ? "🚨 Emergency Broadcast Enabled" : "Urgent Emergency Situation?"}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Pings all active matching donors instantly.</p>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            form.isEmergency ? "border-[#C62828] bg-[#C62828]" : "border-gray-300"
          }`}
        >
          {form.isEmergency && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
      </div>

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="glass p-6 sm:p-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Patient Full Name *
            </label>
            <input
              type="text"
              value={form.patientName}
              onChange={(e) => set("patientName", e.target.value)}
              className="input-field"
              placeholder="e.g. Ramesh Kumar"
            />
            {errors.patientName && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.patientName}</p>}
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Blood Group *
            </label>
            <select
              value={form.bloodGroup}
              onChange={(e) => set("bloodGroup", e.target.value)}
              className="input-field"
            >
              <option value="">Select blood type</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
            {errors.bloodGroup && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.bloodGroup}</p>}
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Units Required
            </label>
            <select
              value={form.units}
              onChange={(e) => set("units", e.target.value)}
              className="input-field"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} {n > 1 ? "Units" : "Unit"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Hospital Center *
            </label>
            <input
              ref={hospitalRef}
              type="text"
              list="hospital-suggestions"
              value={form.hospital}
              onChange={(e) => {
                const val = e.target.value;
                set("hospital", val);
                const matched = HOSPITALS.find((h) => h.name.toLowerCase() === val.toLowerCase());
                if (matched && matched.city && !form.city) {
                  set("city", matched.city);
                }
              }}
              className="input-field"
              placeholder="e.g. Kasturba Medical College & Hospital"
            />
            <datalist id="hospital-suggestions">
              {HOSPITALS.map((h) => (
                <option key={h.id} value={h.name}>
                  {h.city} — {h.address}
                </option>
              ))}
            </datalist>
            {errors.hospital && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.hospital}</p>}
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              City Region *
            </label>
            <select
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className="input-field"
            >
              <option value="">Select city</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.city}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Needed By Date *
            </label>
            <input
              type="date"
              value={form.neededBy}
              onChange={(e) => set("neededBy", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="input-field"
            />
            {errors.neededBy && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.neededBy}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block mb-1.5">
              Clinical Context / Special Notes
            </label>
            <textarea
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              rows={3}
              className="input-field resize-none"
              placeholder="e.g. Operation planned for 9 AM, critical need for matching donor..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Scanning matching donors...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {form.isEmergency ? "Broadcast Emergency Request" : "Submit Blood Request"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
