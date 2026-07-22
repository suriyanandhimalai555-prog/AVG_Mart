import React, { useState, useRef } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaStore,
  FaMapMarkerAlt,
  FaTruck,
  FaUniversity,
  FaCreditCard,
  FaCheck,
  FaChevronRight,
  FaChevronLeft,
  FaCircleNotch,
} from "react-icons/fa";
import Logo from "../../assets/logo.png";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const STEPS = [
  { id: 1, label: "Seller account creation" },
  { id: 2, label: "Verify tax details" },
  { id: 3, label: "Store name" },
  { id: 4, label: "Shipping preferences & Pickup address" },
  { id: 5, label: "Bank details" },
];

const SellerRegister = () => {
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Complete Form State covering all 5 steps
  const [formData, setFormData] = useState({
    // Step 1: Account details
    owner_name: "",
    email: "",
    password: "",
    phone: "",

    // Step 2: Tax Details
    gst_number: "",
    pan_number: "",

    // Step 3: Store details
    store_name: "",
    store_description: "",

    // Step 4: Shipping & Pickup
    pickup_address: "",
    city: "",
    state: "",
    pincode: "",
    shipping_type: "standard",

    // Step 5: Bank details
    account_holder: "",
    account_number: "",
    ifsc_code: "",
    bank_name: "",
  });

  // 3D Tilt State
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    const rotateYVal = (e.clientX - centerX) / (box.width / 2);
    const rotateXVal = (e.clientY - centerY) / (box.height / 2);

    setRotateY(rotateYVal * 8);
    setRotateX(-rotateXVal * 8);

    const glowXPercentage = ((e.clientX - box.left) / box.width) * 100;
    const glowYPercentage = ((e.clientY - box.top) / box.height) * 100;
    setGlowX(glowXPercentage);
    setGlowY(glowYPercentage);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const validateCurrentStep = () => {
    setErrorMessage("");
    if (currentStep === 1) {
      if (!formData.owner_name || !formData.email || !formData.password || !formData.phone) {
        setErrorMessage("Please fill in all account creation fields.");
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.gst_number) {
        setErrorMessage("Please enter your GST number.");
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.store_name) {
        setErrorMessage("Please enter your store name.");
        return false;
      }
    } else if (currentStep === 4) {
      if (!formData.pickup_address || !formData.city || !formData.state || !formData.pincode) {
        setErrorMessage("Please complete your pickup address details.");
        return false;
      }
    } else if (currentStep === 5) {
      if (!formData.account_number || !formData.ifsc_code || !formData.account_holder) {
        setErrorMessage("Please fill in required bank details.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "seller");
      localStorage.setItem("userName", data.user?.store_name || formData.store_name);

      toast.success("Merchant Account Created & Saved Successfully!");
      navigate("/seller/dashboard");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#071640] text-white flex items-center justify-center p-4 md:p-8 relative overflow-hidden select-none perspective-1000">
      
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1200px; }
        .preserve-3d { transform-style: preserve-3d; transition: transform 0.15s ease-out, box-shadow 0.3s ease; }
        .translate-z-3d { transform: translateZ(25px); }
      `}} />

      {/* BACKGROUND AMBIENT GLOW */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-lime-400/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[140px]" />
      </div>

      {/* 3D GLASS CONTAINER */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 35px rgba(0, 0, 0, 0.5), 0 0 40px rgba(165, 206, 0, 0.05)`
        }}
        className="w-full max-w-4xl bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-10 preserve-3d relative z-10 group hover:border-lime-400/30 transition-colors duration-300"
      >
        <div 
          style={{ background: `radial-gradient(circle 400px at ${glowX}% ${glowY}%, rgba(165, 206, 0, 0.1), transparent)` }}
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />

        {/* HEADER */}
        <div className="flex flex-col items-center text-center space-y-2 mb-8 translate-z-3d">
          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 shadow-inner">
            <img src={Logo} alt="AVG MART" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white">
            SELLER <span className="text-lime-400 font-light">ONBOARDING</span>
          </h2>
        </div>

        {/* STEPPER TRACKER */}
        <div className="mb-10 translate-z-3d">
          <div className="relative w-full mb-6 px-2">
            <div className="absolute top-3 left-0 right-0 h-[2px] bg-white/10 z-0" />
            <div 
              className="absolute top-3 left-0 h-[2px] bg-lime-400 transition-all duration-500 ease-out z-0"
              style={{ width: `${progressPercentage}%` }}
            />

            <div className="relative z-10 flex justify-between items-start">
              {STEPS.map((step) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center w-28 text-center group cursor-default">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border ${
                        isCompleted
                          ? "bg-lime-400 text-[#071640] border-lime-400"
                          : isActive
                          ? "bg-[#071640] text-lime-400 border-lime-400 ring-4 ring-lime-400/20"
                          : "bg-[#071640] text-white/40 border-white/20"
                      }`}
                    >
                      {isCompleted ? <FaCheck className="text-[10px]" /> : isActive ? <div className="w-2 h-2 bg-lime-400 rounded-full animate-ping" /> : null}
                    </div>

                    <span
                      className={`text-[10px] leading-tight font-semibold mt-2.5 transition-colors duration-300 ${
                        isActive
                          ? "text-lime-400 font-bold"
                          : isCompleted
                          ? "text-white/80"
                          : "text-white/30"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center translate-z-3d">
            {errorMessage}
          </div>
        )}

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="translate-z-3d">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Full Name / Owner Name</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type="text"
                    name="owner_name"
                    required
                    value={formData.owner_name}
                    onChange={handleChange}
                    placeholder="Suriya Anand"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Email Address</label>
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seller@domain.com"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Phone Number</label>
                <div className="relative flex items-center">
                  <FaPhone className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Password</label>
                <div className="relative flex items-center">
                  <FaKey className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-12 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-white/30 hover:text-white"
                  >
                    {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">GSTIN Number</label>
                <div className="relative flex items-center">
                  <FaBuilding className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type="text"
                    name="gst_number"
                    required
                    value={formData.gst_number}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white uppercase focus:border-lime-400/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">PAN Number</label>
                <div className="relative flex items-center">
                  <FaCreditCard className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type="text"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white uppercase focus:border-lime-400/40"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Display Store Name</label>
                <div className="relative flex items-center">
                  <FaStore className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type="text"
                    name="store_name"
                    required
                    value={formData.store_name}
                    onChange={handleChange}
                    placeholder="Apex Digital Store"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Store Description</label>
                <textarea
                  name="store_description"
                  rows="3"
                  value={formData.store_description}
                  onChange={handleChange}
                  placeholder="Tell buyers what products your store specializes in..."
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl p-3 text-xs outline-none text-white focus:border-lime-400/40 resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Pickup Address / Hub Location</label>
                <div className="relative flex items-center">
                  <FaMapMarkerAlt className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type="text"
                    name="pickup_address"
                    required
                    value={formData.pickup_address}
                    onChange={handleChange}
                    placeholder="Building No, Street Name, Industrial Area"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="560001"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Shipping Mode</label>
                <div className="relative flex items-center">
                  <FaTruck className="absolute left-4 text-white/20 text-xs" />
                  <select
                    name="shipping_type"
                    value={formData.shipping_type}
                    onChange={handleChange}
                    className="w-full bg-[#071640] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                  >
                    <option value="standard">AVG Logistics Fulfilled</option>
                    <option value="self">Self Ship / Local Express</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Account Holder Name</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type="text"
                    name="account_holder"
                    required
                    value={formData.account_holder}
                    onChange={handleChange}
                    placeholder="Suriya Anand / Apex Digital"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Bank Name</label>
                <input
                  type="text"
                  name="bank_name"
                  required
                  value={formData.bank_name}
                  onChange={handleChange}
                  placeholder="State Bank of India"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">IFSC Code</label>
                <input
                  type="text"
                  name="ifsc_code"
                  required
                  value={formData.ifsc_code}
                  onChange={handleChange}
                  placeholder="SBIN0001234"
                  className="w-full bg-white/[0.01] border border-white/10 rounded-xl px-4 py-3 text-xs outline-none text-white uppercase focus:border-lime-400/40"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Bank Account Number</label>
                <div className="relative flex items-center">
                  <FaUniversity className="absolute left-4 text-white/20 text-xs" />
                  <input
                    type="password"
                    name="account_number"
                    required
                    value={formData.account_number}
                    onChange={handleChange}
                    placeholder="918237192837"
                    className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-white focus:border-lime-400/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CONTROL BUTTONS */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-white/10">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all"
              >
                <FaChevronLeft className="text-[10px]" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3.5 bg-lime-400 hover:bg-lime-300 text-[#071640] font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(165,206,0,0.2)] transition-all"
              >
                <span>Continue</span>
                <FaChevronRight className="text-[10px]" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 bg-lime-400 disabled:bg-lime-400/50 text-[#071640] font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 shadow-[0_0_25px_rgba(165,206,0,0.35)] transition-all"
              >
                {isSubmitting ? (
                  <FaCircleNotch className="animate-spin text-sm" />
                ) : (
                  <>
                    <span>Submit & Save to DB</span>
                    <FaCheck className="text-xs" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-white/30 font-medium">
            Already registered?{" "}
            <Link to="/seller/login" className="text-lime-400 font-bold hover:underline">
              Seller Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SellerRegister;