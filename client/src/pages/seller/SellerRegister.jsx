import React, { useState, useRef, useEffect } from "react";
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
  FaTag,
} from "react-icons/fa";
import Logo from "../../assets/logo.png";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const STEPS = [
  { id: 1, label: "Account creation" },
  { id: 2, label: "Verify tax details" },
  { id: 3, label: "Store name" },
  { id: 4, label: "Pickup address" },
  { id: 5, label: "Bank details" },
];

const SellerRegister = () => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    referral_code: "",

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

  // Track the initial URL referral code so we know if it was pre-filled via link
  const initialUrlRefCode = searchParams.get("referral_code")?.toUpperCase() || "";

  // Set referral code initial value ONLY ONCE when page mounts
  useEffect(() => {
    const refCodeFromUrl = searchParams.get("referral_code");
    if (refCodeFromUrl) {
      setFormData((prev) => ({
        ...prev,
        referral_code: refCodeFromUrl.toUpperCase(),
      }));
    }
  }, [searchParams]);

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
        setErrorMessage("Please fill in all required account creation fields.");
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4 md:p-8 relative overflow-hidden select-none perspective-1000">
      
      {/* <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1200px; }
        .preserve-3d { transform-style: preserve-3d; transition: transform 0.15s ease-out, box-shadow 0.3s ease; }
        .translate-z-3d { transform: translateZ(25px); }
      `}} /> */}

      {/* BACKGROUND AMBIENT GLOW */}
      {/* <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-20"
          style={{ backgroundColor: '#A5CE00' }}
        />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0A224E]/5 rounded-full blur-[140px]" />
      </div> */}

      {/* 3D GLASS CONTAINER */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(10, 34, 78, 0.08), 0 10px 40px rgba(0, 0, 0, 0.04)`
        }}
        className="w-full max-w-4xl bg-white border border-gray-200/80 rounded-3xl p-6 md:p-10 preserve-3d relative z-10 group transition-colors duration-300"
      >
        <div 
          style={{ background: `radial-gradient(circle 400px at ${glowX}% ${glowY}%, rgba(165, 206, 0, 0.12), transparent)` }}
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />

        {/* HEADER */}
        <div className="flex flex-col items-center text-center space-y-2 mb-8 translate-z-3d">
          <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center p-2 shadow-xs group-hover:border-[#A5CE00] transition-all duration-300">
            <img src={Logo} alt="AVG MART" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">
              AVG <span style={{ color: '#A5CE00' }}>MART</span>
            </h2>
          <h2 className="text-xl font-black uppercase tracking-wider text-[#0A224E]">
            SELLER <span style={{ color: '#A5CE00' }}>ONBOARDING</span>
          </h2>
        </div>

        {/* STEPPER TRACKER */}
        <div className="mb-10 translate-z-3d">
          <div className="relative w-full mb-6 px-2">
            <div className="absolute top-3 left-0 right-0 h-[2px] bg-gray-200 z-0" />
            <div 
              className="absolute top-3 left-0 h-[2px] transition-all duration-500 ease-out z-0"
              style={{ width: `${progressPercentage}%`, backgroundColor: '#A5CE00' }}
            />

            <div className="relative z-10 flex justify-between items-start">
              {STEPS.map((step) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                  <div key={step.id} className="flex flex-col items-center w-28 text-center group cursor-default">
                    <div
                      style={isCompleted ? { backgroundColor: '#A5CE00', borderColor: '#A5CE00' } : {}}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border ${
                        isCompleted
                          ? "text-[#0A224E]"
                          : isActive
                          ? "bg-white text-[#0A224E] border-[#0A224E] ring-4 ring-emerald-500/10 font-black"
                          : "bg-gray-100 text-gray-400 border-gray-300"
                      }`}
                    >
                      {isCompleted ? <FaCheck className="text-[10px]" /> : isActive ? <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: '#A5CE00' }} /> : null}
                    </div>

                    <span
                      className={`text-[10px] leading-tight font-semibold mt-2.5 transition-colors duration-300 ${
                        isActive
                          ? "text-[#0A224E] font-black"
                          : isCompleted
                          ? "text-gray-700 font-bold"
                          : "text-gray-400"
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
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center translate-z-3d">
            {errorMessage}
          </div>
        )}

        {/* FORM CONTENT */}
        <form onSubmit={handleSubmit} className="translate-z-3d">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Full Name / Owner Name</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="owner_name"
                    required
                    value={formData.owner_name}
                    onChange={handleChange}
                    placeholder="Muthu"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Email Address</label>
                <div className="relative flex items-center">
                  <FaEnvelope className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seller@domain.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Phone Number</label>
                <div className="relative flex items-center">
                  <FaPhone className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Password</label>
                <div className="relative flex items-center">
                  <FaKey className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-12 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              {/* Editable Referral Code Field */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">
                  Referral Code <span className="text-gray-400 font-normal lowercase">(optional)</span>
                </label>
                <div className="relative flex items-center">
                  <FaTag className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="referral_code"
                    value={formData.referral_code}
                    onChange={handleChange}
                    placeholder="Enter marketer referral code (e.g. MKT-8832)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-32 py-3 text-xs outline-none font-bold text-gray-900 uppercase focus:border-[#0A224E] focus:bg-white"
                  />
                  {initialUrlRefCode && formData.referral_code === initialUrlRefCode && (
                    <span className="absolute right-3 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-md font-bold">
                      Applied via Link
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">GSTIN Number</label>
                <div className="relative flex items-center">
                  <FaBuilding className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="gst_number"
                    required
                    value={formData.gst_number}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 uppercase focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">PAN Number</label>
                <div className="relative flex items-center">
                  <FaCreditCard className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handleChange}
                    placeholder="ABCDE1234F"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 uppercase focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Display Store Name</label>
                <div className="relative flex items-center">
                  <FaStore className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="store_name"
                    required
                    value={formData.store_name}
                    onChange={handleChange}
                    placeholder="Apex Digital Store"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Store Description</label>
                <textarea
                  name="store_description"
                  rows="3"
                  value={formData.store_description}
                  onChange={handleChange}
                  placeholder="Tell buyers what products your store specializes in..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white resize-none"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Pickup Address / Hub Location</label>
                <div className="relative flex items-center">
                  <FaMapMarkerAlt className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="pickup_address"
                    required
                    value={formData.pickup_address}
                    onChange={handleChange}
                    placeholder="Building No, Street Name, Industrial Area"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Bengaluru"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Karnataka"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="560001"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Shipping Mode</label>
                <div className="relative flex items-center">
                  <FaTruck className="absolute left-4 text-gray-400 text-xs" />
                  <select
                    name="shipping_type"
                    value={formData.shipping_type}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E]"
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
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Account Holder Name</label>
                <div className="relative flex items-center">
                  <FaUser className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="text"
                    name="account_holder"
                    required
                    value={formData.account_holder}
                    onChange={handleChange}
                    placeholder="Suriya Anand / Apex Digital"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Bank Name</label>
                <input
                  type="text"
                  name="bank_name"
                  required
                  value={formData.bank_name}
                  onChange={handleChange}
                  placeholder="State Bank of India"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">IFSC Code</label>
                <input
                  type="text"
                  name="ifsc_code"
                  required
                  value={formData.ifsc_code}
                  onChange={handleChange}
                  placeholder="SBIN0001234"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none font-bold text-gray-900 uppercase focus:border-[#0A224E] focus:bg-white"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-[#0A224E]">Bank Account Number</label>
                <div className="relative flex items-center">
                  <FaUniversity className="absolute left-4 text-gray-400 text-xs" />
                  <input
                    type="password"
                    name="account_number"
                    required
                    value={formData.account_number}
                    onChange={handleChange}
                    placeholder="918237192837"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-bold text-gray-900 focus:border-[#0A224E] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CONTROL BUTTONS */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <FaChevronLeft className="text-[10px]" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                style={{ backgroundColor: '#A5CE00' }}
                className="px-8 py-3.5 text-[#0A224E] font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md hover:brightness-95 transition-all cursor-pointer active:scale-98"
              >
                <span>Continue</span>
                <FaChevronRight className="text-[10px]" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: '#A5CE00' }}
                className="px-8 py-3.5 disabled:opacity-50 text-[#0A224E] font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 shadow-md hover:brightness-95 transition-all cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <FaCircleNotch className="animate-spin text-sm" />
                ) : (
                  <>
                    <span>Submit & Onboard</span>
                    <FaCheck className="text-xs" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 font-medium">
            Already registered?{" "}
            <Link to="/seller/login" className="text-[#0A224E] font-black hover:underline">
              Seller Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SellerRegister;