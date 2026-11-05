import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(result.user.role === "donor" ? "/donor/dashboard" : "/recipient/dashboard");
    } else {
      setError(result.error);
    }
  };

  const fillDemo = (role) => {
    setForm({ email: `${role}@demo.com`, password: "demo1234" });
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#C62828] rounded-2xl shadow-[0_4px_20px_rgba(198,40,40,0.4)] mb-4">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to LifeDrop</p>
        </div>

        <div className="glass-dark p-8">
          {/* Demo credentials */}
          <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-3.5 mb-6">
            <p className="text-xs font-semibold text-blue-600 mb-2">🎯 Demo Accounts</p>
            <div className="flex gap-2">
              <button onClick={() => fillDemo("donor")}
                className="flex-1 text-xs bg-white/60 border border-blue-200/60 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100/60 transition-colors font-medium">
                Donor Demo
              </button>
              <button onClick={() => fillDemo("recipient")}
                className="flex-1 text-xs bg-white/60 border border-blue-200/60 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100/60 transition-colors font-medium">
                Recipient Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-field pr-10"
                  placeholder="Your password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50/80 border border-red-200/60 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#C62828] font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
