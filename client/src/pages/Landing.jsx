import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Bell, Shield, Users, Droplets, ArrowRight, Zap, Sparkles } from "lucide-react";

const STATS = [
  { label: "Active Donors", value: "2,400+", icon: Users },
  { label: "Blood Requests", value: "580+", icon: Droplets },
  { label: "Cities Covered", value: "12", icon: MapPin },
  { label: "Lives Saved", value: "1,100+", icon: Heart },
];

const FEATURES = [
  { icon: MapPin, title: "Find Nearby Donors", desc: "Locate available blood donors in your city using real-time map-based search.", color: "#C62828", bg: "rgba(253,236,236,0.85)" },
  { icon: Bell, title: "Emergency Alerts", desc: "Broadcast urgent requests instantly to all matching donors within radius.", color: "#EA580C", bg: "rgba(255,247,237,0.85)" },
  { icon: Shield, title: "Smart Matching", desc: "Intelligent matching factoring exact blood group compatibility and distance.", color: "#7C3AED", bg: "rgba(245,243,255,0.85)" },
  { icon: Zap, title: "Real-Time Updates", desc: "Instant confirmations and notifications when a verified donor accepts.", color: "#0284C7", bg: "rgba(240,249,255,0.85)" },
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Landing() {
  return (
    <div className="bg-transparent pb-10">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 glass-sm px-4 py-2 rounded-full text-xs font-bold mb-8 text-[#C62828] border border-red-200/60 shadow-sm">
          <Heart className="w-3.5 h-3.5 fill-[#C62828]" />
          <span>SDG 3 — Good Health and Well-being</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#C62828] animate-ping" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6">
          Connecting Donors.
          <br />
          <span className="text-gradient">Saving Lives.</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          LifeDrop bridges the critical gap between blood donors and emergency recipients — fast, direct, and completely free.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/register"
            className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base shadow-[0_6px_24px_rgba(198,40,40,0.38)] hover:shadow-[0_8px_32px_rgba(198,40,40,0.48)] w-full sm:w-auto"
          >
            Get Started Now <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/find-donors"
            className="btn-secondary flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-base w-full sm:w-auto"
          >
            Find Donors Near You
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400 font-medium">Free healthcare platform · Instant search without login</p>
      </section>

      {/* Stats Counter Glass Panel */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="glass p-8 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center group">
              <div className="w-10 h-10 rounded-xl bg-red-50/70 border border-red-200/50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <s.icon className="w-5 h-5 text-[#C62828]" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-[#C62828] uppercase tracking-widest">Platform Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-1.5">
            Engineered for Critical Response
          </h2>
          <p className="text-gray-400 mt-2 text-sm max-w-md mx-auto">
            A cohesive suite of tools connecting clinical needs with willing community donors.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="glass card-hover p-6 sm:p-7 text-center flex flex-col items-center">
              <div
                className="w-13 h-13 rounded-2xl flex items-center justify-center mb-4.5 p-3.5 shadow-sm border border-white/60"
                style={{ backgroundColor: f.bg }}
              >
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blood Groups Supported */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#C62828] uppercase tracking-widest">Compatibility</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            All Blood Groups Supported
          </h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
          {BLOOD_GROUPS.map((bg) => (
            <div
              key={bg}
              className="glass card-hover aspect-square flex flex-col items-center justify-center p-2 rounded-2xl border border-white/90"
            >
              <Droplets className="w-3.5 h-3.5 text-[#C62828] mb-1 opacity-70" />
              <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{bg}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Glass CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center shadow-[0_20px_60px_-15px_rgba(198,40,40,0.45)] border border-white/30"
          style={{
            background: "linear-gradient(135deg, rgba(198,40,40,0.96) 0%, rgba(183,28,28,0.92) 50%, rgba(142,0,0,0.96) 100%)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Ambient inner highlights */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-red-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold mb-4 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              Be a Life Saver
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-3.5 tracking-tight leading-tight">
              Ready to save a life today?
            </h2>
            <p className="text-red-100 mb-8 text-sm sm:text-base leading-relaxed">
              Join hundreds of registered donors in coastal Karnataka making a real-time difference.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/register?role=donor"
                className="w-full sm:w-auto bg-white text-[#C62828] px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-red-50 hover:shadow-lg transition-all"
              >
                Register as Blood Donor
              </Link>
              <Link
                to="/register?role=recipient"
                className="w-full sm:w-auto bg-white/15 backdrop-blur-md border border-white/40 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/25 transition-all"
              >
                Request Urgent Blood
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frosted Glass Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="glass p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#C62828] rounded-xl flex items-center justify-center shadow-sm">
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-base tracking-tight">LifeDrop</span>
          </div>
          <p className="text-xs text-gray-400 font-medium text-center">
            © 2024 LifeDrop · SDG 3 – Good Health and Well-being · Healthcare Demo Platform
          </p>
          <div className="flex gap-4 text-xs font-semibold text-gray-500">
            <Link to="/find-donors" className="hover:text-[#C62828] transition-colors">Find Donors</Link>
            <Link to="/map" className="hover:text-[#C62828] transition-colors">Donor Map</Link>
            <Link to="/chatbot" className="hover:text-[#C62828] transition-colors">AI Assistant</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
