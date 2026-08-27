// import React, { useState, useRef } from "react";
// import {
//   FaGoogle,
//   FaEnvelope,
//   FaKey,
//   FaEye,
//   FaEyeSlash,
//   FaChevronRight,
// } from "react-icons/fa";
// import Logo from "../assets/logo.png";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import { GoogleLogin } from "@react-oauth/google";
// import { EcommerceLoader, ButtonCartLoader } from "../components/EcommerceLoader";

// const Login = () => {
//   const cardRef = useRef(null);
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loadingText, setLoadingText] = useState("Logging in...");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const [rotateX, setRotateX] = useState(0);
//   const [rotateY, setRotateY] = useState(0);
//   const [glowX, setGlowX] = useState(50);
//   const [glowY, setGlowY] = useState(50);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleMouseMove = (e) => {
//     if (!cardRef.current) return;
//     const card = cardRef.current;
//     const box = card.getBoundingClientRect();
//     const centerX = box.left + box.width / 2;
//     const centerY = box.top + box.height / 2;

//     setRotateY(((e.clientX - centerX) / (box.width / 2)) * 15);
//     setRotateX(-((e.clientY - centerY) / (box.height / 2)) * 15);

//     setGlowX(((e.clientX - box.left) / box.width) * 100);
//     setGlowY(((e.clientY - box.top) / box.height) * 100);
//   };

//   const handleMouseLeave = () => {
//     setRotateX(0);
//     setRotateY(0);
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     setIsSubmitting(true);
//     setLoadingText("Verifying Google Credentials...");
//     setErrorMessage("");
//     try {
//       const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/google`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token: credentialResponse.credential }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Google auth failed.");

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("userRole", data.user.role);
//       localStorage.setItem("userName", data.user.name);

//       toast.success(`Welcome, ${data.user.name || "Operator"}!`);

//       if (data.user.role === "admin") navigate("/admin/dashboard");
//       else if (data.user.role === "branch_admin") navigate("/branch-admin/dashboard");
//       else navigate("/profile");
//     } catch (error) {
//       setErrorMessage(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const loginWithGoogle = useGoogleLogin({
//     onSuccess: handleGoogleSuccess,
//     onError: () => setErrorMessage("Google Sign-In was unsuccessful. Try again."),
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setLoadingText("Authenticating User...");
//     setErrorMessage("");

//     try {
//       const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: formData.email, password: formData.password }),
//       });

//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Invalid email or password.");

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("userRole", data.user.role);
//       localStorage.setItem("userName", data.user.name);

//       toast.success(`Welcome back, ${data.user.name || "Operator"}!`);

//       if (data.user.role === "admin") navigate("/admin/dashboard");
//       else if (data.user.role === "branch_admin") navigate("/branch-admin/dashboard");
//       else navigate("/profile");
//     } catch (error) {
//       setErrorMessage(error.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#071640] text-white flex items-center justify-center p-4 relative overflow-hidden select-none perspective-1000">
//       <style dangerouslySetInnerHTML={{ __html: `
//         @keyframes subtle-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
//         .perspective-1000 { perspective: 1200px; }
//         .preserve-3d { transform-style: preserve-3d; transition: transform 0.15s ease-out, box-shadow 0.3s ease; }
//         .translate-z-3d { transform: translateZ(40px); }
//       ` }} />

//       <div className="absolute inset-0 pointer-events-none z-0">
//         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-lime-400/10 rounded-full blur-[140px] animate-pulse" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[140px]" />
//       </div>

//       <div
//         ref={cardRef}
//         onMouseMove={handleMouseMove}
//         onMouseLeave={handleMouseLeave}
//         style={{
//           transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
//           boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 35px rgba(0, 0, 0, 0.5), 0 0 40px rgba(165, 206, 0, 0.05)`
//         }}
//         className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 preserve-3d relative z-10 group hover:border-lime-400/40 transition-colors duration-300 overflow-hidden"
//       >
//         {/* REUSABLE SEPARATE E-COMMERCE LOADER */}
//         {isSubmitting && <EcommerceLoader message={loadingText} />}

//         <div 
//           style={{ background: `radial-gradient(circle 250px at ${glowX}% ${glowY}%, rgba(165, 206, 0, 0.12), transparent)` }}
//           className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
//         />

//         <div className="flex flex-col items-center text-center space-y-3 mb-8 translate-z-3d">
//           <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2.5 shadow-inner group-hover:border-lime-400/30 transition-all duration-300">
//             <img src={Logo} alt="AVG MART Core" className="w-full h-full object-contain" />
//           </div>
//           <div>
//             <h2 className="text-xl font-black uppercase tracking-widest text-white">
//               AVG <span className="text-lime-400 font-light">MART</span>
//             </h2>
//             <p className="text-white/30 text-[9px] font-black tracking-[0.25em] uppercase mt-1">
//               Secure Entry Log
//             </p>
//           </div>
//         </div>

//         <div className="space-y-5 translate-z-3d">
//           <button
//             type="button"
//             onClick={() => loginWithGoogle()}
//             disabled={isSubmitting}
//             className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3.5 px-4 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.99] group/btn"
//           >
//             <FaGoogle className="text-lime-400 text-sm group-hover/btn:scale-110 transition-transform" />
//             <span>Login with Google</span>
//           </button>

//           <div className="flex items-center py-2">
//             <div className="flex-1 h-[1px] bg-white/5" />
//             <span className="px-4 text-[9px] font-black tracking-[0.25em] text-white/20 uppercase">OR SECURED PROTOCOL</span>
//             <div className="flex-1 h-[1px] bg-white/5" />
//           </div>

//           {errorMessage && (
//             <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
//               {errorMessage}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4 text-left">
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Email Address</label>
//               <div className="relative flex items-center">
//                 <FaEnvelope className="absolute left-4 text-white/20 text-xs" />
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="operator@avgmart.com"
//                   className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-xs outline-none font-medium text-white placeholder-white/20 transition-all focus:border-lime-400/40 focus:bg-white/[0.04]"
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <div className="flex justify-between items-center">
//                 <label className="text-[10px] font-black uppercase tracking-widest text-lime-400">Password</label>
//                 <a href="/forgot-password" className="text-[10px] text-white/30 hover:text-lime-400 font-bold tracking-wider transition-colors">Forgot Password?</a>
//               </div>
//               <div className="relative flex items-center">
//                 <FaKey className="absolute left-4 text-white/20 text-xs" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   required
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="••••••••••••••••"
//                   className="w-full bg-white/[0.01] border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-xs outline-none font-medium text-white placeholder-white/20 transition-all focus:border-lime-400/40 focus:bg-white/[0.04]"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 text-white/30 hover:text-white transition-colors"
//                 >
//                   {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-lime-400 disabled:bg-lime-400/50 disabled:cursor-not-allowed text-[#071640] font-black text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 mt-6 group/submit hover:shadow-[0_0_25px_rgba(165,206,0,0.35)] transition-all duration-300"
//             >
//               {isSubmitting ? (
//                 <ButtonCartLoader text="Signing In..." />
//               ) : (
//                 <>
//                   <span>Login</span>
//                   <FaChevronRight className="text-[9px] transform group-hover/submit:translate-x-1 transition-transform" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="pt-4 text-center">
//             <p className="text-xs text-white/30 font-medium">
//               Don’t have an account?{" "}
//               <a href="/signup" className="text-lime-400 font-bold hover:underline transition-all">
//                 Signup
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useRef } from "react";
import {
  FaGoogle,
  FaEnvelope,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaChevronRight,
} from "react-icons/fa";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { EcommerceLoader, ButtonCartLoader } from "../components/EcommerceLoader";

const Login = () => {
  const cardRef = useRef(null);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("Logging in...");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;

    setRotateY(((e.clientX - centerX) / (box.width / 2)) * 12);
    setRotateX(-((e.clientY - centerY) / (box.height / 2)) * 12);

    setGlowX(((e.clientX - box.left) / box.width) * 100);
    setGlowY(((e.clientY - box.top) / box.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    setLoadingText("Verifying Google Credentials...");
    setErrorMessage("");
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google auth failed.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);

      toast.success(`Welcome, ${data.user.name || "User"}!`);

      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "branch_admin") navigate("/branch-admin/dashboard");
      else navigate("/profile");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoadingText("Authenticating User...");
    setErrorMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid email or password.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);

      toast.success(`Welcome back, ${data.user.name || "User"}!`);

      if (data.user.role === "admin") navigate("/admin/dashboard");
      else if (data.user.role === "branch_admin") navigate("/branch-admin/dashboard");
      else navigate("/profile");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-4 relative overflow-hidden select-none perspective-1000 font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1200px; }
        .preserve-3d { transform-style: preserve-3d; transition: transform 0.15s ease-out, box-shadow 0.3s ease; }
        .translate-z-3d { transform: translateZ(35px); }
      ` }} />

      {/* LIGHT AMBIENT BACKGROUND GLOW */}
      {/* <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 animate-pulse" 
          style={{ backgroundColor: '#A5CE00' }}
        />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[140px]" />
      </div> */}

      {/* 3D TILT CONTAINER CARD */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 35px rgba(0, 0, 0, 0.08), 0 0 30px rgba(165, 206, 0, 0.15)`
        }}
        className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 md:p-10 preserve-3d relative z-10 group transition-colors duration-300 overflow-hidden shadow-sm"
      >
        {/* REUSABLE LOADER */}
        {isSubmitting && <EcommerceLoader message={loadingText} />}

        {/* MOUSE TRACKING GLOW SPOTLIGHT */}
        <div 
          style={{ background: `radial-gradient(circle 250px at ${glowX}% ${glowY}%, rgba(165, 206, 0, 0.18), transparent)` }}
          className="absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        />

        {/* LOGO & BRANDING */}
        <div className="flex flex-col items-center text-center space-y-3 mb-8 translate-z-3d">
          <div 
            onClick={() => navigate("/")}
            className="w-14 h-14 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center p-2.5 shadow-inner cursor-pointer"
          >
            <img src={Logo} alt="AVG MART Core" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">
              AVG <span style={{ color: '#A5CE00' }}>MART</span>
            </h2>
            <p className="text-gray-400 text-[10px] font-extrabold tracking-wider uppercase mt-0.5">
              Secure User Login
            </p>
          </div>
        </div>

        <div className="space-y-5 translate-z-3d">
          {/* GOOGLE SIGN IN */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMessage("Google login failed. Please try again.")}
            useOneTap={false}
            theme="outline"
            size="large"
            text="continue_with"
            shape="rectangular"
            width="400"
          />

          <div className="flex items-center py-1">
            <div className="flex-1 h-[1px] bg-gray-200" />
            <span className="px-3 text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">OR</span>
            <div className="flex-1 h-[1px] bg-gray-200" />
          </div>

          {/* ERROR ALERT */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
              {errorMessage}
            </div>
          )}

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Email Address</label>
              <div className="relative flex items-center">
                <FaEnvelope className="absolute left-4 text-gray-400 text-xs" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl pl-11 pr-4 py-3 text-xs outline-none font-medium text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Password</label>
                <a href="/forgot-password" className="text-[10px] text-gray-500 hover:text-black font-bold tracking-wider transition-colors">Forgot Password?</a>
              </div>
              <div className="relative flex items-center">
                <FaKey className="absolute left-4 text-gray-400 text-xs" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••••"
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl pl-11 pr-11 py-3 text-xs outline-none font-medium text-gray-900 placeholder-gray-400 transition-all"
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#A5CE00] hover:bg-[#8DA800] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 mt-6 transition-all shadow-md cursor-pointer active:scale-[0.98]"
            >
              {isSubmitting ? (
                <ButtonCartLoader text="Signing In..." />
              ) : (
                <>
                  <span>Login</span>
                  <FaChevronRight className="text-[9px]" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-xs text-gray-500 font-semibold">
              Don’t have an account?{" "}
              <a href="/signup" className="text-gray-900 font-black hover:underline transition-all">
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;