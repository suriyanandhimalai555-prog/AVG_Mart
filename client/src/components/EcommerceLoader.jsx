import React from "react";

export const EcommerceLoader = ({ message = "Processing..." }) => {
  return (
    <div className="absolute inset-0 bg-[#071640]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Custom Keyframe Styles */}
      <style>{`
        @keyframes scanline {
          0%, 100% { transform: translateY(-12px); opacity: 0.2; }
          50% { transform: translateY(12px); opacity: 0.9; }
        }
        @keyframes itemMove {
          0% { transform: translateX(-40px) scale(0.7); opacity: 0; }
          30% { transform: translateX(-10px) scale(1); opacity: 1; }
          70% { transform: translateX(10px) scale(1); opacity: 1; }
          100% { transform: translateX(40px) scale(0.7); opacity: 0; }
        }
        @keyframes cartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-scan { animation: scanline 1.8s ease-in-out infinite; }
        .animate-item { animation: itemMove 2s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-cart-pulse { animation: cartPulse 1.5s ease-in-out infinite; }
      `}</style>

      {/* Main Loader Visual */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-2">
        {/* Ambient Backlight Glow */}
        <div className="absolute inset-2 bg-lime-400/20 rounded-full blur-xl animate-pulse" />

        {/* Outer Scanner Ring */}
        <div className="absolute inset-0 rounded-full border border-lime-400/20 border-t-lime-400 animate-spin" style={{ animationDuration: "3s" }} />

        {/* E-Commerce Scanner & Cart Scene */}
        <div className="relative z-10 flex flex-col items-center animate-cart-pulse">
          {/* Animated Product Box */}
          <div className="animate-item mb-1">
            <div className="w-6 h-6 bg-lime-400/20 border border-lime-400/60 rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(165,206,0,0.3)]">
              <span className="text-[10px] text-lime-400 font-bold">📦</span>
            </div>
          </div>

          {/* Cart Icon SVG */}
          <svg className="w-10 h-10 text-lime-400 drop-shadow-[0_0_8px_rgba(165,206,0,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>

          {/* Holographic Laser Scanner Beam */}
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-lime-400 to-transparent animate-scan shadow-[0_0_8px_#a5ce00]" />
        </div>
      </div>

      {/* Typography & Status Bar */}
      <div className="space-y-1 z-10">
        <p className="text-lime-400 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
          {message}
        </p>
        <p className="text-white/40 text-[9px] font-semibold tracking-widest uppercase">
          AVG MART • SECURE AUTHENTICATION
        </p>
      </div>
    </div>
  );
};

export const ButtonCartLoader = ({ text = "Authenticating..." }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="w-3.5 h-3.5 border-2 border-[#071640] border-t-transparent rounded-full animate-spin" />
      <span className="animate-pulse">{text}</span>
    </div>
  );
};

export default EcommerceLoader;