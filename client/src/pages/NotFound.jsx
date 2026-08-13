import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { FaHome, FaArrowLeft } from 'react-icons/fa'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between font-sans antialiased">
      
      {/* NAVBAR */}
      <div className="relative z-30">
        <Navbar />
      </div>

      {/* HERO CONTENT SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 relative z-20 max-w-2xl mx-auto w-full my-auto">
        
        {/* WHITE CARD CONTAINER */}
        <div className="w-full bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 relative overflow-hidden">
          
          {/* STATUS BADGE */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A5CE00] border border-[#A5CE00] text-white text-[10px] font-extrabold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>ERROR 404 • ROUTE NOT FOUND</span>
          </div>

          {/* 404 DISPLAY */}
          <div className="relative select-none my-2">
            <h1 className="text-7xl sm:text-9xl font-black tracking-tighter leading-none text-gray-900">
              4<span style={{ color: '#A5CE00' }}>0</span>4
            </h1>
          </div>

          {/* SUBTITLE */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900">
              Page Not Found
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto font-medium leading-relaxed">
              The page or resource you are looking for does not exist or has been moved.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto pt-2">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-1/2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              <FaArrowLeft className="text-[10px]" /> Go Back
            </button>

            <Link
              to="/"
              className="w-full sm:w-1/2 px-5 py-3 rounded-xl bg-[#A5CE00] hover:bg-[#8BAC00] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
            >
              <FaHome /> Return Home
            </Link>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  )
}

export default NotFound