import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Bell, Shield, Users, Droplets, ArrowRight, Zap } from "lucide-react";

const STATS = [
  { label: "Active Donors", value: "2,400+", icon: Users },
  { label: "Blood Requests", value: "580+", icon: Droplets },
  { label: "Cities Covered", value: "12", icon: MapPin },
  { label: "Lives Saved", value: "1,100+", icon: Heart },
];

const FEATURES = [
  { icon: MapPin, title: "Find Nearby Donors", desc: "Locate available blood donors in your city using map-based search.", color: "#C62828", bg: "#FDECEC" },
  { icon: Bell, title: "Emergency Alerts", desc: "Send urgent blood requests to all matching donors instantly.", color: "#EA580C", bg: "#FFF7ED" },
  { icon: Shield, title: "Smart Matching", desc: "AI-powered matching based on blood group, location and availability.", color: "#7C3AED", bg: "#F5F3FF" },
  { icon: Zap, title: "Real-Time Updates", desc: "Get notified the moment a donor accepts your request.", color: "#0284C7", bg: "#F0F9FF" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Landing() {
  return (
    <div className="bg-transparent">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-[#C62828]/20 text-[#C62828] px-4 py-1.5 rounded-full text-xs font-semibold mb-8 shadow-sm">
          <Heart className="w-3.5 h-3.5 fill-[#C62828]" />
          SDG 3 — Good Health and Well-being
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-5">
          Connecting Donors.
          <br />
          <span className="text-gradient">Saving Lives.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">
          LifeDrop bridges the gap between blood donors and recipients — fast, free, and reliable.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register"
            className="flex items-center gap-2 bg-[#C62828] text-white px-7 py-3.5 rounded-2xl font-semibold text-sm shadow-[0_4px_20px_rgba(198,40,40,0.4)] hover:bg-[#8E0000] hover:shadow-[0_6px_28px_rgba(198,40,40,0.5)] transition-all active:scale-[0.98]">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/find-donors"
            className="flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-gray-200/60 text-gray-700 px-7 py-3.5 rounded-2xl font-semibold text-sm hover:bg-white/90 hover:shadow-sm transition-all">
            Find Donors
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">Free to use · No registration required to browse</p>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="glass p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <s.icon className="w-5 h-5 text-[#C62828] mx-auto mb-2 opacity-80" />
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Everything you need</h2>
          <p className="text-gray-400 mt-2 text-sm">A complete platform for blood donor management</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(f => (
            <div key={f.title} className="glass card-hover p-6 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
                style={{ backgroundColor: f.bg }}>
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blood groups */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold text-center text-gray-900 tracking-tight mb-8">Blood Groups We Support</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {BLOOD_GROUPS.map(bg => (
            <div key={bg} className="glass-sm card-hover w-20 h-20 flex items-center justify-center">
              <p className="text-2xl font-extrabold text-gradient">{bg}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="relative overflow-hidden bg-[#C62828] rounded-3xl px-8 py-14 text-center shadow-[0_8px_40px_rgba(198,40,40,0.35)]">
          {/* subtle background blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Ready to save a life?</h2>
            <p className="text-red-200 mb-8 text-sm">Join thousands of donors making a difference every day.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register?role=donor"
                className="bg-white text-[#C62828] px-7 py-3.5 rounded-2xl font-semibold text-sm hover:bg-red-50 transition-all shadow-sm">
                Register as Donor
              </Link>
              <Link to="/register?role=recipient"
                className="bg-white/15 backdrop-blur-sm border border-white/30 text-white px-7 py-3.5 rounded-2xl font-semibold text-sm hover:bg-white/25 transition-all">
                I Need Blood
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100/60 py-8 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#C62828] rounded-lg flex items-center justify-center shadow-sm">
              <Heart className="w-3 h-3 text-white fill-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm">LifeDrop</span>
          </div>
          <p className="text-xs text-gray-400">© 2024 LifeDrop · SDG 3 – Good Health and Well-being · Demo Application</p>
          <div className="flex gap-5 text-xs text-gray-400">
            <Link to="/find-donors" className="hover:text-[#C62828] transition-colors">Find Donors</Link>
            <Link to="/login" className="hover:text-[#C62828] transition-colors">Sign In</Link>
            <Link to="/chatbot" className="hover:text-[#C62828] transition-colors">AI Assistant</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
