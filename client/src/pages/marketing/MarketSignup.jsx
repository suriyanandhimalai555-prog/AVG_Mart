import React, { useState, useRef } from "react";
import {
  FaUser,
  FaCity,
  FaPhone,
  FaEnvelope,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaChevronRight,
  FaCircleNotch,
} from "react-icons/fa";
import Logo from "../../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const MarketSignup = () => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    email: "",
    password: "",
  });

  // 3D Tilt State variables
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

    setRotateY(rotateYVal * 10);
    setRotateX(-rotateXVal * 10);

    const glowXPercentage = ((e.clientX - box.left) / box.width) * 100;
    const glowYPercentage = ((e.clientY - box.top) / box.height) * 100;
    setGlowX(glowXPercentage);
    setGlowY(glowYPercentage);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/api/marketer/signup`, formData);
      toast.success("Account created successfully! Please login.");
      navigate("/marketing/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4 relative overflow-hidden select-none perspective-1000">
      {/* <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .perspective-1000 { perspective: 1200px; }
        .preserve-3d { transform-style: preserve-3d; transition: transform 0.15s ease-out, box-shadow 0.3s ease; }
        .translate-z-3d { transform: translateZ(30px); }
      `,
        }}
      /> */}

      {/* BACKGROUND EFFECTS */}
      {/* <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-20"
          style={{ backgroundColor: '#A5CE00' }}
        />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0A224E]/5 rounded-full blur-[140px]" />
        <div
          className="absolute top-1/4 left-10 w-72 h-72 border border-gray-200/60 rounded-full pointer-events-none"
          style={{ animation: "subtle-float 6s infinite ease-in-out" }}
        />
        <div
          className="absolute bottom-1/4 right-10 w-96 h-96 border border-gray-200/40 rounded-full pointer-events-none"
          style={{ animation: "subtle-float 8s infinite ease-in-out 1s" }}
        />
      </div> */}

      {/* 3D CARD BOX */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(10, 34, 78, 0.08), 0 10px 40px rgba(0, 0, 0, 0.04)`,
        }}
        className="w-full max-w-2xl bg-white border border-gray-200/80 rounded-3xl p-6 sm:p-8 md:p-10 preserve-3d relative z-10 group transition-colors duration-300 my-auto"
      >
        <div
          style={{
            background: `radial-gradient(circle 250px at ${glowX}% ${glowY}%, rgba(165, 206, 0, 0.15), transparent)`,
          }}
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6 translate-z-3d">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center p-2 shadow-xs group-hover:border-[#A5CE00] transition-all duration-300">
            <img src={Logo} alt="AVG MART" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-[#0A224E]">
              JOIN <span style={{ color: '#A5CE00' }}>MARKETING</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase mt-1">
              Generate Your Referral Code
            </p>
          </div>
        </div>

        <div className="space-y-5 translate-z-3d">
          {/* Error Message Panel */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* 2 Inputs per row Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 placeholder-gray-400 transition-all focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="marketer@avgmart.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 placeholder-gray-400 transition-all focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <FaPhone className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 placeholder-gray-400 transition-all focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  City
                </label>
                <div className="relative flex items-center">
                  <FaCity className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Bengaluru"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 placeholder-gray-400 transition-all focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              {/* Password - Takes Full Row */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  Password
                </label>
                <div className="relative flex items-center">
                  <FaKey className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-12 py-3 text-xs outline-none font-bold text-gray-900 placeholder-gray-400 transition-all focus:border-[#0A224E] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: '#A5CE00' }}
                className="w-full md:w-1/2 disabled:opacity-50 disabled:cursor-not-allowed text-[#0A224E] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 group/submit shadow-md hover:brightness-95 transition-all duration-300 cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <FaCircleNotch className="text-sm animate-spin" />
                ) : (
                  <>
                    <span>Create Marketer Account</span>
                    <FaChevronRight className="text-[9px] transform group-hover/submit:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-2 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium">
              Already registered?{" "}
              <Link to="/marketing/login" className="text-[#0A224E] font-black hover:underline transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSignup;