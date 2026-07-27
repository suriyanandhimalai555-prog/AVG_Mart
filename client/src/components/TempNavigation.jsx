import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaStore,
  FaBullhorn,
  FaUserShield,
  FaArrowRight,
  FaUserPlus,
  FaSignInAlt,
  FaHome,
} from "react-icons/fa";

const TempNavigation = () => {
  const navigate = useNavigate();

  const portalSections = [
    {
      title: "Customer Portal",
      icon: <FaUser className="text-lime-400" />,
      description: "Standard buyer authentication channels",
      routes: [
        { label: "Login", path: "/login", icon: <FaSignInAlt />, primary: true },
        { label: "Sign Up", path: "/signup", icon: <FaUserPlus /> },
      ],
    },
    {
      title: "Seller Portal",
      icon: <FaStore className="text-lime-400" />,
      description: "Merchant onboarding and management access",
      routes: [
        { label: "Seller Login", path: "/seller/login", icon: <FaSignInAlt />, primary: true },
        { label: "Seller Register", path: "/seller/signup", icon: <FaUserPlus /> },
      ],
    },
    {
      title: "Marketing Partner Portal",
      icon: <FaBullhorn className="text-lime-400" />,
      description: "Affiliate and marketing agent access",
      routes: [
        { label: "Marketer Login", path: "/marketing/login", icon: <FaSignInAlt />, primary: true },
        { label: "Marketer Signup", path: "/marketing/signup", icon: <FaUserPlus /> },
      ],
    },
    {
      title: "Admin & Branch Portals",
      icon: <FaUserShield className="text-lime-400" />,
      description: "Administrative & branch operations control",
      routes: [
        { label: "Super Admin Dashboard", path: "/admin/dashboard", icon: <FaArrowRight />, primary: true },
        { label: "Branch Admin Dashboard", path: "/branch-admin/dashboard", icon: <FaArrowRight /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#071640] text-white p-4 md:p-10 flex flex-col justify-between selection:bg-lime-400 selection:text-[#071640]">
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-white/10">
          <div>
            <span className="text-[10px] font-black tracking-widest text-lime-400 uppercase bg-lime-400/10 border border-lime-400/20 px-3 py-1 rounded-full">
              Developer & Navigation Switcher
            </span>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wider mt-2">
              Portal <span className="text-lime-400 font-light">Navigation Matrix</span>
            </h1>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all text-white/80 hover:text-white"
          >
            <FaHome className="text-lime-400" />
            <span>Back to Storefront</span>
          </Link>
        </div>

        {/* PORTAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portalSections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white/[0.02] border border-white/10 hover:border-lime-400/30 rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lg">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-wide">
                      {section.title}
                    </h2>
                    <p className="text-xs text-white/40">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {section.routes.map((route, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => navigate(route.path)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 ${
                      route.primary
                        ? "bg-lime-400 hover:bg-lime-300 text-[#071640] shadow-[0_0_15px_rgba(165,206,0,0.2)]"
                        : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                    }`}
                  >
                    <span>{route.icon}</span>
                    <span>{route.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-6xl mx-auto w-full pt-10 text-center border-t border-white/5 mt-10">
        <p className="text-xs text-white/30 font-mono">
          AVG Mart Onboarding & Auth Switcher • Dev Utility
        </p>
      </div>
    </div>
  );
};

export default TempNavigation;