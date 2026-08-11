import React, { useState, useEffect } from "react";
import { Sparkles, Terminal, ShieldCheck, Cpu, Globe2, ArrowUpRight, Award, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { EcommerceLoader } from "../components/EcommerceLoader";

const About = () => {
  const [loading, setLoading] = useState(true);
  
  // Local state to track 3D tilt interaction for structural cards
  const [tiltStyle, setTiltStyle] = useState({ card1: {}, card2: {}, card3: {} });

  // Simulate loading sequence on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Interactive mouse tracker computing real-time 3D rotation geometry
  const handleMouseMove = (e, cardKey) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -12; // Vertical rotation pitch
    const rotateY = ((x / rect.width) - 0.5) * 12;   // Horizontal rotation yaw

    setTiltStyle((prev) => ({
      ...prev,
      [cardKey]: {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: "transform 0.1s ease-out",
      },
    }));
  };

  const resetTilt = (cardKey) => {
    setTiltStyle((prev) => ({
      ...prev,
      [cardKey]: {
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: "transform 0.5s ease-out",
      },
    }));
  };

  if (loading) {
    return <EcommerceLoader message="LOADING ABOUT AVG MART..." />;
  }

  return (
    <>
      <Navbar />

      {/* Structural Layout Root Container */}
      <div className="bg-gray-50 text-gray-900 min-h-screen py-10 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
        
        {/* Parallax Depth Background Layers */}
        {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ backgroundColor: '#A5CE00' }}
        /> */}

        <div className="max-w-7xl mx-auto relative z-10 space-y-12 sm:space-y-16">
          
          {/* HERO HEADER SEGMENT */}
          <div className="space-y-4 text-left border-b border-gray-200/80 pb-8 sm:pb-12">
            <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest uppercase bg-white border border-gray-200 px-3.5 py-1.5 rounded-full text-[#0A224E] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" style={{ color: '#A5CE00' }} /> Corporate Core Infrastructure
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#0A224E] leading-none">
              AVG <span style={{ color: '#A5CE00' }}>MART</span>
            </h1>
            <p className="text-xs sm:text-base text-gray-600 font-medium max-w-2xl leading-relaxed">
              We engineer hyper-curated transactional pipelines delivering ultra-grade apparel, tactical equipment, and terminal accessories straight to your doorstep.
            </p>
          </div>

          {/* INTERACTIVE 3D FEATURE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* CARD 01 - CORE ARCHITECTURE */}
            <div
              onMouseMove={(e) => handleMouseMove(e, "card1")}
              onMouseLeave={() => resetTilt("card1")}
              style={tiltStyle.card1}
              className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-[340px] text-left transition-all duration-300 relative group shadow-sm hover:shadow-xl cursor-default overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 w-full h-[3px] opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ backgroundColor: '#A5CE00' }}
              />
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-[#0A224E] group-hover:bg-[#0A224E] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <Cpu className="w-5 h-5 transform group-hover:rotate-12 transition-transform" style={{ color: '#A5CE00' }} />
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#0A224E]">Next-Gen Supply</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Autonomous stock replenishment vectors matching exact high-velocity fashion metrics. Every item is cross-verified, quality tested, and dispatched seamlessly.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="font-mono text-[10px] font-bold text-gray-400">SUBSYSTEM_ALPHA_01</span>
                <Terminal className="w-4 h-4 text-gray-300 group-hover:text-[#0A224E] transition-colors" />
              </div>
            </div>

            {/* CARD 02 - GLOBAL ESCALATION */}
            <div
              onMouseMove={(e) => handleMouseMove(e, "card2")}
              onMouseLeave={() => resetTilt("card2")}
              style={tiltStyle.card2}
              className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-[340px] text-left transition-all duration-300 relative group shadow-sm hover:shadow-xl cursor-default overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 w-full h-[3px] opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ backgroundColor: '#A5CE00' }}
              />
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-[#0A224E] group-hover:bg-[#0A224E] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <Globe2 className="w-5 h-5" style={{ color: '#A5CE00' }} />
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#0A224E]">Global Distribution</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  We bridge geographic boundaries with immediate cross-border fulfillment networks. Real-time fleet operations ensure low-latency deliveries nationwide.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="font-mono text-[10px] font-bold text-gray-400">SUBSYSTEM_BETA_02</span>
                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A224E] transition-colors" />
              </div>
            </div>

            {/* CARD 03 - SECURITY INTEGRITY */}
            <div
              onMouseMove={(e) => handleMouseMove(e, "card3")}
              onMouseLeave={() => resetTilt("card3")}
              style={tiltStyle.card3}
              className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-[340px] text-left transition-all duration-300 relative group shadow-sm hover:shadow-xl cursor-default overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 w-full h-[3px] opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ backgroundColor: '#A5CE00' }}
              />
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-[#0A224E] group-hover:bg-[#0A224E] group-hover:text-white transition-all duration-300 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" style={{ color: '#A5CE00' }} />
                </div>
                <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#0A224E]">Encrypted Checkout</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Advanced data encapsulation structures safeguard consumer profiles and transactions. Your payment gateway details are isolated via strict cryptographic modules.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="font-mono text-[10px] font-bold text-gray-400">SUBSYSTEM_GAMMA_03</span>
                <Sparkles className="w-4 h-4 text-gray-300 group-hover:text-[#0A224E] transition-colors" />
              </div>
            </div>

          </div>

          {/* CORPORATE METRICS MATRIX */}
          <div className="w-full bg-[#0A224E] text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left relative overflow-hidden group">
            <div 
              className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-20 pointer-events-none" 
              style={{ backgroundColor: '#A5CE00' }}
            />
            
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-400 font-extrabold tracking-widest text-[9px] uppercase">
                <Users className="w-3.5 h-3.5" style={{ color: '#A5CE00' }} /> Active Matrix
              </div>
              <h4 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white group-hover:text-[#A5CE00] transition-colors">450K+</h4>
              <p className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">Registered Operatives</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-400 font-extrabold tracking-widest text-[9px] uppercase">
                <Globe2 className="w-3.5 h-3.5" style={{ color: '#A5CE00' }} /> Hubs
              </div>
              <h4 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white group-hover:text-[#A5CE00] transition-colors">180+</h4>
              <p className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">Nodes Connected</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-400 font-extrabold tracking-widest text-[9px] uppercase">
                <Cpu className="w-3.5 h-3.5" style={{ color: '#A5CE00' }} /> Operations
              </div>
              <h4 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white group-hover:text-[#A5CE00] transition-colors">1.2M+</h4>
              <p className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">Assets Dispatched</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-400 font-extrabold tracking-widest text-[9px] uppercase">
                <Award className="w-3.5 h-3.5" style={{ color: '#A5CE00' }} /> Standards
              </div>
              <h4 className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white group-hover:text-[#A5CE00] transition-colors">99.9%</h4>
              <p className="text-[10px] sm:text-xs font-bold text-gray-300 uppercase tracking-wider">Uptime Reliability</p>
            </div>
          </div>

          {/* CORPORATE VISION BLOCK */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center border-t border-gray-200/80 pt-12 sm:pt-16 text-left">
            <div className="space-y-3">
              <span 
                className="text-[10px] font-black tracking-widest uppercase bg-white px-3 py-1 rounded-lg border border-gray-200 inline-block text-[#0A224E]"
              >
                Manifesto Terminal
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-[#0A224E] leading-tight">
                WE DO NOT SELL SAMPLES.<br/>WE SOURCE <span style={{ color: '#A5CE00' }}>END-GAME EQUIPMENT</span>.
              </h2>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                AVG MART was built to dismantle boring shopping templates. We build systems optimized to serve collectors who require exact engineering, sleek aesthetics, and instantaneous checkout performance. Our trajectory points straight toward continuous platform optimization and total transparency.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;