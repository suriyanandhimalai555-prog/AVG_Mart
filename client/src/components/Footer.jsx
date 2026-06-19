import React from "react";
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPaperPlane,
  FaLock,
  FaRedo,
  FaTruck,
  FaArrowUp,
} from "react-icons/fa";

import Logo from "../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Products",
      items: ["Smart Watches", "Mobile Phones", "Cameras", "Accessories"],
    },
    {
      title: "Support",
      items: ["Track Order", "Returns", "Warranty", "Help Center"],
    },
    {
      title: "Company",
      items: ["About Us", "Careers", "Press", "Contact"],
    },
  ];

  const socialLinks = [
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaGithub />, href: "#", label: "Github" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#0b246a] text-white pt-24 pb-8 px-6 md:px-12 border-t border-white/10 relative overflow-hidden select-none">
      
      {/* Premium Cyber Ambient Glow Overlays */}
      <div className="absolute -bottom-10 -right-10 w-[400px] h-[400px] bg-lime-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Top Feature Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-16 border-b border-white/10">
          <div className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300 group">
            <FaTruck className="text-lime-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white">Fast Shipping</h4>
              <p className="text-white/60 text-xs mt-1 font-medium">Secure delivery networks operating worldwide.</p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300 group">
            <FaLock className="text-lime-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white">Secure Payments</h4>
              <p className="text-white/60 text-xs mt-1 font-medium">100% fully encrypted operational transactions.</p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-white/5 border border-white/5 rounded-xl hover:border-white/20 transition-all duration-300 group">
            <FaRedo className="text-lime-400 text-2xl group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-white">Easy Returns</h4>
              <p className="text-white/60 text-xs mt-1 font-medium">Hassle-free 14-day safety vault protocol.</p>
            </div>
          </div>
        </div>

        {/* Massive Aesthetic Bottom Backdrop Typography */}
        {/* <div className="w-full select-none pointer-events-none opacity-[0.015] font-black tracking-[0.6em] text-white text-center text-[7vw] md:text-[9vw] uppercase leading-none mt-10">
          AVG MART
        </div> */}

        {/* Middle Structure Block */}
        <div className="grid lg:grid-cols-12 gap-12 py-16 text-left">

          {/* Brand Identity Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={Logo}
                alt="AVG MART Identity Logo"
                className="w-8 h-8 object-contain"
              />
              <h2 className="text-2xl font-black uppercase tracking-wider text-white">
                AVG <span className="text-lime-400 font-light">MART</span>
              </h2>
            </div>

            <p className="text-white/60 text-xs font-medium max-w-sm leading-relaxed">
              Premium setups, hardware gear, core electronics, and streamlined accessories engineered to run without limits.
            </p>

            <div className="flex gap-2.5 pt-2">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  aria-label={item.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-lime-400 hover:text-[#0b246a] hover:border-transparent hover:scale-105 shadow-md transition-all duration-300"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Links Matrix Mapping */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerLinks.map((group, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lime-400 text-[11px] font-black uppercase tracking-[0.2em]">
                  {group.title}
                </h3>

                <ul className="space-y-3">
                  {group.items.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href="#"
                        className="text-white/50 hover:text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 group/link"
                      >
                        <span className="w-1 h-1 bg-white/0 rounded-full transition-all duration-200 group-hover/link:w-1.5 group-hover/link:bg-lime-400" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Operational Newsletter Sub-System */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-white">
              Newsletter Transmissions
            </h3>

            <p className="text-white/60 text-xs font-medium leading-relaxed">
              Subscribe to unlock early tier notifications on upcoming hardware inventory drops.
            </p>

            <div className="relative flex items-center group mt-2">
              <input
                type="email"
                placeholder="Enter operator email..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none font-medium placeholder-white/20 focus:border-lime-400/50 focus:bg-white/[0.08] transition-all pr-12"
              />

              <button
                onClick={(e) => e.preventDefault()}
                aria-label="Submit transmission"
                className="absolute right-1.5 p-2 rounded-lg bg-lime-400 text-[#0b246a] active:scale-95 hover:shadow-[0_0_15px_rgba(164,206,0,0.4)] transition-all duration-300"
              >
                <FaPaperPlane className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Lower Core Copyright & Legals */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 relative">
          
          {/* Back to Top Capsule Button */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-1.5 bg-[#0b246a] border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white/60 hover:text-lime-400 hover:border-lime-400/40 transition-all duration-300 shadow-xl"
            >
              Back to Top <FaArrowUp className="text-[9px] transform group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <p className="text-white/40 text-[11px] font-bold tracking-wider">
            © {currentYear} AVG MART SYNDICATE. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-6 text-[11px] font-bold tracking-wider">
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              PRIVACY_POLICY
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors">
              TERMS_OF_SERVICE
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;