import React, { useState, useRef } from "react";
import {
  FaEnvelope,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaChevronRight,
  FaCircleNotch,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";
import Logo from "../../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const SellerForgotPassword = () => {
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // 1: Email, 2: OTP Verification, 3: New Password Reset
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show/Hide Password States
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3D Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

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

    setGlowX(((e.clientX - box.left) / box.width) * 100);
    setGlowY(((e.clientY - box.top) / box.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // STEP 1: Send OTP to Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/seller/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to send OTP.");

      toast.success("6-digit OTP sent to your email!");
      setStep(2);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2: Verify OTP First
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setErrorMessage("Please enter a valid OTP.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/seller/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid OTP.");

      toast.success("OTP Verified! Set your new password.");
      setStep(3);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}/api/seller/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to reset password.");

      toast.success("Password reset successful! Please login.");
      navigate("/seller/login");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4 relative overflow-hidden select-none perspective-1000">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
        className="w-full max-w-md bg-white border border-gray-200/80 rounded-3xl p-8 md:p-10 preserve-3d relative z-10 group transition-colors duration-300 shadow-xl"
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
              {step === 1 && "Step 1: Request Recovery OTP"}
              {step === 2 && "Step 2: Verify 6-Digit OTP"}
              {step === 3 && "Step 3: Reset Password"}
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

          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  Registered Seller Email
                </label>
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="merchant@avgmart.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 placeholder-gray-400 transition-all focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: '#A5CE00' }}
                className="w-full disabled:opacity-50 text-[#0A224E] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4 shadow-md cursor-pointer hover:brightness-95 transition-all"
              >
                {isSubmitting ? (
                  <FaCircleNotch className="text-sm animate-spin" />
                ) : (
                  <>
                    <span>Send OTP</span>
                    <FaChevronRight className="text-[9px]" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: ENTER & VERIFY OTP ONLY */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  Enter 6-Digit OTP Sent to Email
                </label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none font-bold text-gray-900 text-center tracking-widest placeholder-gray-400 focus:border-[#0A224E] focus:bg-white text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: '#A5CE00' }}
                className="w-full disabled:opacity-50 text-[#0A224E] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4 shadow-md cursor-pointer hover:brightness-95 transition-all"
              >
                {isSubmitting ? (
                  <FaCircleNotch className="text-sm animate-spin" />
                ) : (
                  <>
                    <span>Verify OTP</span>
                    <FaCheckCircle className="text-xs" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 3: ENTER NEW PASSWORD (SHOWN ONLY AFTER OTP VERIFICATION) */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-left">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <FaKey className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-12 py-3 text-xs outline-none font-bold text-gray-900 placeholder-gray-400 transition-all focus:border-[#0A224E] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <FaKey className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-12 py-3 text-xs outline-none font-bold text-gray-900 placeholder-gray-400 transition-all focus:border-[#0A224E] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: '#A5CE00' }}
                className="w-full disabled:opacity-50 text-[#0A224E] font-black text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4 shadow-md cursor-pointer hover:brightness-95 transition-all"
              >
                {isSubmitting ? (
                  <FaCircleNotch className="text-sm animate-spin" />
                ) : (
                  "Update & Save Password"
                )}
              </button>
            </form>
          )}

          <div className="mt-4 text-center border-t border-gray-100 pt-4">
            <Link
              to="/seller/login"
              className="text-xs text-[#0A224E] font-bold flex items-center justify-center gap-1.5 mx-auto hover:underline cursor-pointer"
            >
              <FaArrowLeft className="text-[10px]" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerForgotPassword;