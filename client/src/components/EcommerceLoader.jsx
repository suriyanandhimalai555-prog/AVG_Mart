import React from "react";

export const EcommerceLoader = ({ message = "Processing..." }) => {
  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden rounded-2xl">
      {/* Custom Keyframe Styles */}
      <style>{`
        @keyframes scanline {
          0%, 100% { transform: translateY(-10px); opacity: 0.3; }
          50% { transform: translateY(10px); opacity: 0.9; }
        }
        @keyframes itemMove {
          0% { transform: translateX(-35px) scale(0.7); opacity: 0; }
          30% { transform: translateX(-8px) scale(1); opacity: 1; }
          70% { transform: translateX(8px) scale(1); opacity: 1; }
          100% { transform: translateX(35px) scale(0.7); opacity: 0; }
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
      <div className="relative w-24 h-24 flex items-center justify-center mb-2">
        {/* Ambient Backlight Glow */}
        <div 
          className="absolute inset-2 rounded-full blur-lg opacity-40 animate-pulse" 
          style={{ backgroundColor: '#A5CE00' }}
        />

        {/* Outer Scanner Ring */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-gray-200 animate-spin" 
          style={{ borderTopColor: '#A5CE00', animationDuration: "2s" }} 
        />

        {/* E-Commerce Scanner & Cart Scene */}
        <div className="relative z-10 flex flex-col items-center animate-cart-pulse">
          {/* Animated Product Box */}
          <div className="animate-item mb-1">
            <div 
              className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center shadow-sm"
            >
              <span className="text-[10px]">📦</span>
            </div>
          </div>

          {/* Cart Icon SVG */}
          <svg 
            className="w-8 h-8 text-gray-900" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>

          {/* Laser Scanner Beam */}
          <div 
            className="w-14 h-[2px] animate-scan" 
            style={{
              background: 'linear-gradient(to right, transparent, #A5CE00, transparent)',
              boxShadow: '0 0 8px #A5CE00'
            }}
          />
        </div>
      </div>

      {/* Typography & Status Bar */}
      <div className="space-y-1 z-10">
        <p className="text-gray-900 text-xs font-black uppercase tracking-wider animate-pulse">
          {message}
        </p>
        <p className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">
          AVG MART • SECURE
        </p>
      </div>
    </div>
  );
};

export const ButtonCartLoader = ({ text = "Processing..." }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <span 
        className="w-3.5 h-3.5 border-2 border-gray-300 rounded-full animate-spin" 
        style={{ borderTopColor: '#A5CE00' }}
      />
      <span className="animate-pulse font-bold">{text}</span>
    </div>
  );
};

export default EcommerceLoader;