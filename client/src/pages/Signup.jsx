import React, { useState, useRef } from "react";
import {
  FaGoogle,
  FaEnvelope,
  FaKey,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaChevronRight,
  FaCircleNotch,
} from "react-icons/fa";
import Logo from "../assets/logo.png";

const Signup = () => {
  const cardRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // 3D Tilt Matrix State variables
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Real-time 3D Mouse Tracking Calculation Engine
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    
    // Find the center coordinates of the card container
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;

    // Get cursor position offset from center (-1 to 1 range)
    const rotateYVal = (e.clientX - centerX) / (box.width / 2);
    const rotateXVal = (e.clientY - centerY) / (box.height / 2);

    // Calculate dynamic tilt angles (Max 12 degrees for the larger signup frame)
    setRotateY(rotateYVal * 12);
    setRotateX(-rotateXVal * 12);

    // Track dynamic light flare surface positioning
    const glowXPercentage = ((e.clientX - box.left) / box.width) * 100;
    const glowYPercentage = ((e.clientY - box.top) / box.height) * 100;
    setGlowX(glowXPercentage);
    setGlowY(glowYPercentage);
  };

  // Return card to perfect alignment when mouse leaves frame
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsAccepted) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("New System Node Provisioned.", formData);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#071640] text-white flex items-center justify-center p-4 relative overflow-hidden select-none perspective-1000">
      
      {/* 3D RENDER SPACE CUSTOM SYSTEM STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .perspective-1000 {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out, box-shadow 0.3s ease;
        }
        .translate-z-3d {
          transform: translateZ(40px);
        }
      `}} />

      {/* MATRIX BACKGROUND EMISSION WIREFRAMES */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lime-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[140px]" />
        
        {/* Floating background graphic rings */}
        <div className="absolute top-1/3 right-12 w-80 h-80 border border-white/[0.02] rounded-full pointer-events-none" style={{ animation: 'subtle-float 7s infinite ease-in-out' }} />
        <div className="absolute bottom-1/3 left-12 w-72 h-72 border border-lime-400/[0.02] rounded-full pointer-events-none" style={{ animation: 'subtle-float 9s infinite ease-in-out 1.5s' }} />
      </div>

      {/* DYNAMIC 3D FLOATING POD FRAME */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 35px rgba(0, 0, 0, 0.5), 0 0 40px rgba(165, 206, 0, 0.05)`
        }}
        className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 preserve-3d relative z-10 group hover:border-lime-400/40 transition-colors duration-300"
      >
        
        {/* INTERACTIVE DYNAMIC HOLOGRAPHIC FLASH TRACKER LAYER */}
        <div 
          style={{
            background: `radial-gradient(circle 250px at ${glowX}% ${glowY}%, rgba(165, 206, 0, 0.12), transparent)`
          }}
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />

        {/* Brand Core Icon Node */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6 translate-z-3d">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 shadow-inner group-hover:border-lime-400/30 transition-all duration-300">
            <img src={Logo} alt="AVG MART Core" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">
              AVG <span className="text-lime-400 font-light">MART</span>
            </h2>
            <p className="text-white/30 text-[9px] font-black tracking-[0.25em] uppercase mt-1">
              Initialize New Operator Node
            </p>
          </div>
        </div>

        {/* MAIN GOOGLE SIGNUP PIPELINE CONTROLLER */}
        <div className="space-y-4 translate-z-3d">
          <button
            onClick={() => console.log("Spawning Google Signup Pipeline...")}
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.99] group/btn"
          >
            <FaGoogle className="text-lime-400 text-sm group-hover/btn:scale-110 transition-transform" />
            <span>Create via Google Account</span>
          </button>

          {/* METRIC SEPARATOR */}
          <div className="flex items-center py-1">
            <div className="flex-1 h-[1px] bg-white/5" />
            <span className="px-4 text-[9px] font-black tracking-[0.25em] text-white/20 uppercase">Or Build Profile</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          {/* DYNAMIC FORM SHELL */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Input Node: Operator Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Full Name</label>
              <div className="relative flex items-center">
                <FaUser className="absolute left-4 text-white/20 text-xs" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Operator Name"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-medium placeholder-white/20 transition-all focus:border-lime-400/40 focus:bg-white/[0.04]"
                />
              </div>
            </div>

            {/* Input Node: Terminal Email Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Email Address</label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-white/20 text-xs" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="operator@avgmart.com"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-medium placeholder-white/20 transition-all focus:border-lime-400/40 focus:bg-white/[0.04]"
                />
              </div>
            </div>

            {/* Input Node: Security Pass Token Key */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Password</label>
              <div className="relative flex items-center">
                <FaKey className="absolute left-4 text-white/20 text-xs" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Minimum 8 characters..."
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-12 py-3 text-xs outline-none font-medium placeholder-white/20 transition-all focus:border-lime-400/40 focus:bg-white/[0.04]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                </button>
              </div>
            </div>

            {/* Micro Cyber Checkbox Framework */}
            <div className="flex items-start gap-3 pt-1 select-none">
              <div className="relative flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-lime-400 focus:ring-0 outline-none cursor-pointer accent-lime-400"
                />
              </div>
              <label htmlFor="terms" className="text-[11px] text-white/40 leading-tight font-medium cursor-pointer">
                I authorize the security protocols and accept terms of deployment link networks.
              </label>
            </div>

            {/* REGISTRATION CORE SUBMIT TRIGGER ACCENT NODE */}
            <button
              type="submit"
              disabled={isSubmitting || !termsAccepted}
              className="w-full bg-lime-400 disabled:bg-lime-400/40 disabled:text-[#071640]/50 disabled:cursor-not-allowed text-[#071640] font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4 group/submit hover:shadow-[0_0_25px_rgba(165,206,0,0.35)] transition-all duration-300"
            >
              {isSubmitting ? (
                <FaCircleNotch className="text-sm animate-spin" />
              ) : (
                <>
                  <span>Signup</span>
                  <FaChevronRight className="text-[9px] transform group-hover/submit:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

          {/* LOWER CONSOLE ROUTE REDIRECT CONTROLLER */}
          <div className="pt-2 text-center">
            <p className="text-xs text-white/30 font-medium">
              Already have an account?{" "}
              <a href="/login" className="text-lime-400 font-bold hover:underline transition-all">
                Login
              </a>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Signup;