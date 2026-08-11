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
      icon: <FaUser className="text-emerald-600" />,
      description: "Standard buyer authentication channels",
      routes: [
        { label: "Login", path: "/login", icon: <FaSignInAlt />, primary: true },
        { label: "Sign Up", path: "/signup", icon: <FaUserPlus /> },
      ],
    },
    {
      title: "Seller Portal",
      icon: <FaStore className="text-emerald-600" />,
      description: "Merchant onboarding and management access",
      routes: [
        { label: "Seller Login", path: "/seller/login", icon: <FaSignInAlt />, primary: true },
        { label: "Seller Register", path: "/seller/signup", icon: <FaUserPlus /> },
      ],
    },
    {
      title: "Marketing Partner Portal",
      icon: <FaBullhorn className="text-emerald-600" />,
      description: "Affiliate and marketing agent access",
      routes: [
        { label: "Marketer Login", path: "/marketing/login", icon: <FaSignInAlt />, primary: true },
        { label: "Marketer Signup", path: "/marketing/signup", icon: <FaUserPlus /> },
      ],
    },
    {
      title: "Admin & Branch Portals",
      icon: <FaUserShield className="text-emerald-600" />,
      description: "Administrative & branch operations control",
      routes: [
        { label: "Super Admin", path: "/admin/dashboard", icon: <FaArrowRight />, primary: true },
        { label: "Branch Admin", path: "/branch-admin/dashboard", icon: <FaArrowRight /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 md:p-8 flex flex-col justify-between font-sans">
      {/* HEADER SECTION */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200">
          <div>
            <span 
              className="text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-md text-white inline-block mb-1"
              style={{ backgroundColor: '#A5CE00' }}
            >
              Developer Switcher
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
              Portal <span style={{ color: '#A5CE00' }}>Navigation Matrix</span>
            </h1>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl text-xs font-bold transition-all text-gray-700 shadow-xs"
          >
            <FaHome className="text-emerald-600" />
            <span>Back to Storefront</span>
          </Link>
        </div>

        {/* PORTAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portalSections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-gray-900 tracking-tight">
                      {section.title}
                    </h2>
                    <p className="text-xs text-gray-400 font-medium">{section.description}</p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {section.routes.map((route, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => navigate(route.path)}
                    className={`flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-98 ${
                      route.primary
                        ? "bg-[#A5CE00] hover:bg-[#8DA800] text-white shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700"
                    }`}
                  >
                    <span>{route.icon}</span>
                    <span className="truncate">{route.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-6xl mx-auto w-full pt-8 text-center border-t border-gray-200 mt-10">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          AVG Mart Onboarding & Auth Switcher • Dev Utility
        </p>
      </div>
    </div>
  );
};

export default TempNavigation;