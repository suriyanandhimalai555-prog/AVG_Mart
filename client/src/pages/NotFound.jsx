import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar' // Adjust this import path as needed
import Footer from '../components/Footer'
import { FaHome } from 'react-icons/fa'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-royal-dark text-white flex flex-col justify-between selection:bg-lime-accent selection:text-royal-dark font-sans relative overflow-hidden antialiased">
      
      {/* --- BACKGROUND DECORATIVE ELEMENTS --- */}
      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* High-Impact Radial Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-accent/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -top-32 -left-32 w-[350px] h-[350px] bg-royal-main/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[350px] h-[350px] bg-lime-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* --- NAVBAR --- */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* --- HERO CONTENT SECTION --- */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 relative z-20 max-w-5xl mx-auto w-full mt-15">
        
        {/* GLASS CARD CONTAINER */}
        <div className="relative w-full backdrop-blur-xl bg-royal-main/20 border border-white/10 rounded-3xl p-8 sm:p-16 shadow-2xl shadow-black/50 overflow-hidden">
          
          {/* Decorative Corner HUD Markers */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-lime-accent/60" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-lime-accent/60" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-lime-accent/60" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-lime-accent/60" />

          {/* STATUS PILL BADGE */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-accent/10 border border-lime-accent/30 text-lime-accent text-[11px] font-mono font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-lime-accent animate-ping" />
            <span>ERROR // ROUTE_UNRESOLVED</span>
          </div>

          {/* GIANT GLOWING 404 DISPLAY */}
          <div className="relative my-2 select-none">
            <h1 className="text-8xl sm:text-[11rem] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-400 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              4<span className="text-lime-accent drop-shadow-[0_0_35px_rgba(165,206,0,0.4)]">0</span>4
            </h1>
          </div>

          {/* SUBTITLE */}
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto font-medium leading-relaxed mb-10">
            The requested resource or product URL is missing from the system database.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {/* Go Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-1/2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              ← Go Back
            </button>

            {/* Return Home Button */}
            <Link
              to="/"
              className="w-full sm:w-1/2 px-6 py-4 rounded-xl bg-lime-accent text-royal-dark font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 hover:shadow-[0_0_25px_rgba(165,206,0,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span><FaHome /></span> Return Home
            </Link>
          </div>
        </div>

      </main>

      {/* --- FOOTER ANNOTATIONS --- */}
      {/* <footer className="w-full px-8 py-6 text-[10px] font-mono uppercase text-gray-400/60 flex justify-between items-center z-20 max-w-7xl mx-auto border-t border-white/5"> */}
        <Footer />
      {/* </footer> */}

    </div>
  )
}

export default NotFound