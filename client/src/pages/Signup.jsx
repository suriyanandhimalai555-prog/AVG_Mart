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
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const Signup = () => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  // Real-time 3D Mouse Tracking Calculation
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    const rotateYVal = (e.clientX - centerX) / (box.width / 2);
    const rotateXVal = (e.clientY - centerY) / (box.height / 2);

    setRotateY(rotateYVal * 12);
    setRotateX(-rotateXVal * 12);

    const glowXPercentage = ((e.clientX - box.left) / box.width) * 100;
    const glowYPercentage = ((e.clientY - box.top) / box.height) * 100;
    setGlowX(glowXPercentage);
    setGlowY(glowYPercentage);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // BACKEND INTEGRATION SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) return;
    
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong during signup.");
      }

      toast.success("Profile created successfully! Please log in.");

      // Automatically send them to login page after successful registration
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071640] text-white flex items-center justify-center p-4 relative overflow-hidden select-none perspective-1000">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .perspective-1000 { perspective: 1200px; }
        .preserve-3d { transform-style: preserve-3d; transition: transform 0.15s ease-out, box-shadow 0.3s ease; }
        .translate-z-3d { transform: translateZ(40px); }
      `}} />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lime-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-12 w-80 h-80 border border-white/[0.02] rounded-full pointer-events-none" style={{ animation: 'subtle-float 7s infinite ease-in-out' }} />
        <div className="absolute bottom-1/3 left-12 w-72 h-72 border border-lime-400/[0.02] rounded-full pointer-events-none" style={{ animation: 'subtle-float 9s infinite ease-in-out 1.5s' }} />
      </div>

      {/* 3D CARD CONTAINER */}
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
        
        <div 
          style={{ background: `radial-gradient(circle 250px at ${glowX}% ${glowY}%, rgba(165, 206, 0, 0.12), transparent)` }}
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6 translate-z-3d">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 shadow-inner group-hover:border-lime-400/30 transition-all duration-300">
            <img src={Logo} alt="AVG MART Core" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white">
              AVG <span className="text-lime-400 font-light">MART</span>
            </h2>
            <p className="text-white/30 text-[9px] font-black tracking-[0.25em] uppercase mt-1">
              Create New Account
            </p>
          </div>
        </div>

        <div className="space-y-4 translate-z-3d">
          <button
            type="button"
            className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.99] group/btn"
          >
            <FaGoogle className="text-lime-400 text-sm group-hover/btn:scale-110 transition-transform" />
            <span>Signup via Google</span>
          </button>

          <div className="flex items-center py-1">
            <div className="flex-1 h-[1px] bg-white/5" />
            <span className="px-4 text-[9px] font-black tracking-[0.25em] text-white/20 uppercase">Or Build Profile</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          {/* Error Message Panel */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Input Node: Name */}
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
                  placeholder="Your Name"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-medium text-white placeholder-white/20 transition-all focus:border-lime-400/40 focus:bg-white/[0.04]"
                />
              </div>
            </div>

            {/* Input Node: Email */}
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
                  placeholder="name@example.com"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-medium text-white placeholder-white/20 transition-all focus:border-lime-400/40 focus:bg-white/[0.04]"
                />
              </div>
            </div>

            {/* Input Node: Password */}
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
                  placeholder="Minimum 8 characters"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-12 py-3 text-xs outline-none font-medium text-white placeholder-white/20 transition-all focus:border-lime-400/40 focus:bg-white/[0.04]"
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

            {/* Terms and conditions check */}
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
                I accept the terms and conditions.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !termsAccepted}
              className="w-full bg-lime-400 disabled:bg-lime-400/40 disabled:text-[#071640]/50 disabled:cursor-not-allowed text-[#071640] font-black text-xs uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4 group/submit hover:shadow-[0_0_25px_rgba(165,206,0,0.35)] transition-all duration-300"
            >
              {isSubmitting ? (
                <FaCircleNotch className="text-sm animate-spin" />
              ) : (
                <>
                  <span>Create Profile</span>
                  <FaChevronRight className="text-[9px] transform group-hover/submit:translate-x-1 transition-transform" />
                </>
              )}
            </button>

          </form>

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