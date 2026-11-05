import React from "react";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Top Left Crimson Orb */}
      <div
        className="absolute -top-32 -left-32 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full blur-[110px] opacity-75 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(198,40,40,0.22) 0%, rgba(229,57,53,0.12) 50%, transparent 80%)",
          animationDuration: "8s",
        }}
      />

      {/* Top Right Rose/Blush Orb */}
      <div
        className="absolute top-10 -right-32 w-96 sm:w-[600px] h-96 sm:h-[600px] rounded-full blur-[120px] opacity-65"
        style={{
          background: "radial-gradient(circle, rgba(244,114,182,0.18) 0%, rgba(251,113,133,0.12) 50%, transparent 80%)",
        }}
      />

      {/* Center Left Coral Glow */}
      <div
        className="absolute top-1/2 -left-20 -translate-y-1/2 w-80 sm:w-[450px] h-80 sm:h-[450px] rounded-full blur-[100px] opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(253,186,116,0.16) 0%, rgba(248,113,113,0.10) 50%, transparent 80%)",
        }}
      />

      {/* Bottom Right Crimson/Ruby Orb */}
      <div
        className="absolute -bottom-32 -right-20 w-96 sm:w-[550px] h-96 sm:h-[550px] rounded-full blur-[130px] opacity-70 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(198,40,40,0.20) 0%, rgba(244,63,94,0.12) 50%, transparent 80%)",
          animationDuration: "10s",
        }}
      />

      {/* Subtle fine glass noise grid texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(#C62828 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

