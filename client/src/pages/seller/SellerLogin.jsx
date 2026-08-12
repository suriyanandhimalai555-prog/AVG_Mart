import React, { useState, useRef } from "react";
import {
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

const SellerLogin = () => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/seller/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid seller credentials.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userRole", "seller");
      localStorage.setItem("userName", data.user.name || data.user.store_name);

      toast.success(`Welcome back, ${data.user.name || data.user.store_name}!`);
      navigate("/seller/profile");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4 relative overflow-hidden select-none perspective-1000">
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
        className="w-full max-w-md bg-white border border-gray-200/80 rounded-3xl p-8 md:p-10 preserve-3d relative z-10 group transition-colors duration-300"
      >
        <div
          style={{
            background: `radial-gradient(circle 250px at ${glowX}% ${glowY}%, rgba(165, 206, 0, 0.15), transparent)`,
          }}
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8 translate-z-3d">
          <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center p-2.5 shadow-xs group-hover:border-[#A5CE00] transition-all duration-300">
            <img src={Logo} alt="AVG MART Core" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">
              AVG <span style={{ color: '#A5CE00' }}>MART</span>
            </h2>
          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-[#0A224E]">
              SELLER <span style={{ color: '#A5CE00' }}>PORTAL</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-black tracking-widest uppercase mt-1">
              Merchant Control Console
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
            {/* Input: Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                Seller Email
              </label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-gray-400 text-xs" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="merchant@avgmart.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 placeholder-gray-400 transition-all focus:border-[#0A224E] focus:bg-white"
                />
              </div>
            </div>

            {/* Input: Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  Password
                </label>
                <a
                  href="#"
                  className="text-[10px] text-gray-400 hover:text-[#0A224E] font-bold tracking-wider transition-colors"
                >
                  Forgot Key?
                </a>
              </div>
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
                  className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: '#A5CE00' }}
              className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-[#0A224E] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 mt-6 group/submit shadow-md hover:brightness-95 transition-all duration-300 cursor-pointer active:scale-98"
            >
              {isSubmitting ? (
                <FaCircleNotch className="text-sm animate-spin" />
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <FaChevronRight className="text-[9px] transform group-hover/submit:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium">
              Want to start selling?{" "}
              <Link
                to="/seller/signup"
                className="text-[#0A224E] font-black hover:underline transition-all"
              >
                Register Merchant Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;