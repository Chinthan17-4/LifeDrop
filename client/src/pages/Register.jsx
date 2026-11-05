import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Heart, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BLOOD_GROUPS, CITIES } from "../data/donors";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(params.get("role") || "");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", age: "", bloodGroup: "", city: "", weight: "",
  });

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(""); };

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!role) { setError("Please select your role."); return; }
    if (!form.name || !form.email || !form.password) { setError("Fill all required fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords don't match."); return; }
    setError(""); setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bloodGroup || !form.city || !form.age) { setError("Fill all required fields."); return; }
    if (parseInt(form.age) < 18 || parseInt(form.age) > 65) { setError("Age must be 18–65."); return; }
    setLoading(true);
    const result = await register({ ...form, role, age: parseInt(form.age) });
    setLoading(false);
    if (result.success) navigate(role === "donor" ? "/donor/dashboard" : "/recipient/dashboard");
    else setError(result.error);
  };

  const inputCls = (err) =>
    `input-field ${err ? "border-red-300 focus:ring-red-200 focus:border-red-400" : ""}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#C62828] rounded-2xl shadow-[0_4px_20px_rgba(198,40,40,0.4)] mb-4">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create account</h1>
          <p className="text-gray-400 text-sm mt-1">Join LifeDrop today</p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${step >= 1 ? "bg-[#C62828]" : "bg-gray-200"}`}></div>
          <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${step >= 2 ? "bg-[#C62828]" : "bg-gray-200"}`}></div>
        </div>

        <div className="glass-dark p-8">
          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Step 1 — Account Details</p>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">I am a</label>
                <div className="grid grid-cols-2 gap-2">
                  {["donor", "recipient"].map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                        role === r
                          ? "border-[#C62828] bg-[#C62828]/5 text-[#C62828] shadow-sm"
                          : "border-gray-200/60 text-gray-500 bg-white/40 hover:border-gray-300"
                      }`}>
                      {r === "donor" ? "🩸 Donor" : "🏥 Recipient"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name *</label>
                <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                  className="input-field" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email *</label>
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  className="input-field" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password *</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
                    className="input-field pr-10" placeholder="Min. 6 characters" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirm Password *</label>
                <input type="password" value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)}
                  className="input-field" placeholder="Re-enter password" />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50/80 border border-red-200/60 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full py-3">Continue →</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Step 2 — Personal Details</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Age *</label>
                  <input type="number" value={form.age} onChange={e => set("age", e.target.value)}
                    min="18" max="65" className="input-field" placeholder="18–65" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => set("phone", e.target.value)}
                    className="input-field" placeholder="+91" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Blood Group *</label>
                <select value={form.bloodGroup} onChange={e => set("bloodGroup", e.target.value)} className="input-field">
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">City *</label>
                <select value={form.city} onChange={e => set("city", e.target.value)} className="input-field">
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {role === "donor" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Weight (kg)</label>
                  <input type="number" value={form.weight} onChange={e => set("weight", e.target.value)}
                    className="input-field" placeholder="Min. 50 kg" />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50/80 border border-red-200/60 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => { setStep(1); setError(""); }}
                  className="flex-1 bg-white/60 border border-gray-200/80 text-gray-500 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary py-3">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </span>
                  ) : "Create Account"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#C62828] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
