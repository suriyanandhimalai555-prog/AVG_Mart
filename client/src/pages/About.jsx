import React, { useState } from 'react'
import { Sparkles, Terminal, ShieldCheck, Cpu, Globe2, ArrowUpRight, Award, Users } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
  // Local state to track 3D tilt interaction for structural cards
  const [tiltStyle, setTiltStyle] = useState({ card1: {}, card2: {}, card3: {} })

  // Interactive mouse tracker computing real-time 3D rotation geometry
  const handleMouseMove = (e, cardKey) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const rotateX = ((y / rect.height) - 0.5) * -15 // Vertical rotation pitch
    const rotateY = ((x / rect.width) - 0.5) * 15   // Horizontal rotation yaw

    setTiltStyle(prev => ({
      ...prev,
      [cardKey]: {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`,
        transition: 'transform 0.1s ease-out'
      }
    }))
  }

  const resetTilt = (cardKey) => {
    setTiltStyle(prev => ({
      ...prev,
      [cardKey]: {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.5s ease-out'
      }
    }))
  }

  return (
    <>
      <Navbar />
      
      {/* Structural Layout Root Container */}
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden select-none">
        
        {/* Parallax Depth Background Layers */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-lime-accent/5 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-royal-main/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 mt-6 space-y-20">
          
          {/* --- HERO HEADER SEGMENT --- */}
          <div className="space-y-4 text-left border-b border-white/5 pb-10">
            <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
              <Sparkles className="w-3 h-3 animate-spin" /> Corporate Core Infrastructure
            </div>
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-wider leading-none">
              AVG <span className="text-lime-accent font-light">MART</span>
            </h1>
            <p className="text-sm md:text-lg text-white/50 font-medium max-w-2xl leading-relaxed">
              We engineer hyper-curated transactional pipelines delivering ultra-grade apparel, tactical equipment, and terminal accessories straight to your digital locker.
            </p>
          </div>

          {/* --- INTERACTIVE 3D FEATURE GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* CARD 01 - CORE ARCHITECTURE */}
            <div
              onMouseMove={(e) => handleMouseMove(e, 'card1')}
              onMouseLeave={() => resetTilt('card1')}
              style={tiltStyle.card1}
              className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-8 flex flex-col justify-between h-[360px] text-left transition-all duration-300 relative group shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-default overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-lime-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-lime-accent group-hover:bg-lime-accent group-hover:text-royal-dark transition-all duration-500 shadow-inner">
                  <Cpu className="w-5 h-5 transform group-hover:rotate-12 transition-transform" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wide">Next-Gen Supply</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">
                  Autonomous stock replenishment vectors matching exact high-velocity fashion metrics. Every item is cross-verified, performance stitched, and logged.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="font-mono text-[9px] text-white/30">SUBSYSTEM_ALPHA_01</span>
                <Terminal className="w-4 h-4 text-white/20 group-hover:text-lime-accent transition-colors" />
              </div>
            </div>

            {/* CARD 02 - GLOBAL ESCALATION */}
            <div
              onMouseMove={(e) => handleMouseMove(e, 'card2')}
              onMouseLeave={() => resetTilt('card2')}
              style={tiltStyle.card2}
              className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-8 flex flex-col justify-between h-[360px] text-left transition-all duration-300 relative group shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-default overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-lime-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-lime-accent group-hover:bg-lime-accent group-hover:text-royal-dark transition-all duration-500 shadow-inner">
                  <Globe2 className="w-5 h-5 animate-pulse" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wide">Global Distribution</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">
                  We bridge geographic boundaries with immediate cross-border fulfillment networks. Real-time fleet operations ensure low-latency deliveries worldwide.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="font-mono text-[9px] text-white/30">SUBSYSTEM_BETA_02</span>
                <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-lime-accent transition-colors" />
              </div>
            </div>

            {/* CARD 03 - SECURITY INTEGRITY */}
            <div
              onMouseMove={(e) => handleMouseMove(e, 'card3')}
              onMouseLeave={() => resetTilt('card3')}
              style={tiltStyle.card3}
              className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-8 flex flex-col justify-between h-[360px] text-left transition-all duration-300 relative group shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-default overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-lime-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-lime-accent group-hover:bg-lime-accent group-hover:text-royal-dark transition-all duration-500 shadow-inner">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-wide">Encrypted Checkout</h3>
                <p className="text-xs text-white/40 leading-relaxed font-medium">
                  Advanced data encapsulation structures safeguard consumer profiles and transactions. Your payment gateway details are isolated via strict cryptographic modules.
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="font-mono text-[9px] text-white/30">SUBSYSTEM_GAMMA_03</span>
                <Sparkles className="w-4 h-4 text-white/20 group-hover:text-lime-accent transition-colors" />
              </div>
            </div>

          </div>

          {/* --- CORPORATE METRICS MATRIX (GLASS PANEL WITH 3D SHADOW DEPTH) --- */}
          <div className="w-full bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.7)] backdrop-blur-md grid grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-lime-accent/10 rounded-full blur-[60px] group-hover:bg-lime-accent/20 transition-colors duration-700" />
            
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 font-black tracking-widest text-[9px] uppercase"><Users className="w-3.5 h-3.5 text-lime-accent" /> Active Matrix</div>
              <h4 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white group-hover:text-lime-accent transition-colors">450K+</h4>
              <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Registered Operatives</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 font-black tracking-widest text-[9px] uppercase"><Globe2 className="w-3.5 h-3.5 text-lime-accent" /> Territories</div>
              <h4 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white group-hover:text-lime-accent transition-colors">180+</h4>
              <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Nodes Connected</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 font-black tracking-widest text-[9px] uppercase"><Cpu className="w-3.5 h-3.5 text-lime-accent" /> Operations</div>
              <h4 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white group-hover:text-lime-accent transition-colors">1.2M+</h4>
              <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Assets Dispatched</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-white/40 font-black tracking-widest text-[9px] uppercase"><Award className="w-3.5 h-3.5 text-lime-accent" /> Standards</div>
              <h4 className="text-3xl md:text-5xl font-black font-mono tracking-tight text-white group-hover:text-lime-accent transition-colors">99.9%</h4>
              <p className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Uptime Reliability</p>
            </div>
          </div>

          {/* --- CORPORATE VISION BLOCK --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/5 pt-16 text-left">
            <div className="space-y-4">
              <span className="text-[9px] font-black tracking-[0.25em] text-lime-accent uppercase bg-white/5 px-3 py-1 rounded border border-white/10 inline-block">Manifesto Terminal</span>
              <h2 className="text-2xl md:text-4xl font-black uppercase tracking-wide">
                WE DO NOT SELL SAMPLES.<br/>WE SOURCE <span className="text-lime-accent font-light">END-GAME EQUIPMENT</span>.
              </h2>
            </div>
            <div>
              <p className="text-xs md:text-sm text-white/40 leading-relaxed font-medium">
                AVG MART was built to dismantle boring shopping templates. We build systems optimized to serve collectors who require exact engineering, sleek aesthetics, and instantaneous checkout performance. Our trajectory points straight toward continuous platform optimization and total transparency.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  )
}

export default About