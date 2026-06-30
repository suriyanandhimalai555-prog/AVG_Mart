import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, ShoppingBag, LogOut, ShieldAlert, Menu, X, ShieldCheck } from 'lucide-react'
import { toast } from 'react-hot-toast' // <-- Imported toast engine
import Logo from "../../assets/logo.png"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Add Products', path: '/admin/products', icon: <PlusCircle className="w-5 h-5" /> },
    { name: 'Customer Orders', path: '/admin/orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Branch Admin', path: '/admin/create-branch-admin', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Stock Request', path: '/admin/stock-request', icon: <ShieldCheck className="w-5 h-5" /> },
  ]

  // Handle system logout parameters instantly with toast feedback
  const handleLogout = () => {
    // 1. Initialize a quick status feedback toast
    const logoutToastId = toast.loading("Terminating admin session...")

    // 2. Clear stored auth tokens securely
    localStorage.removeItem('token') 
    
    // 3. Resolve success state and route back to standard storefront layout
    setTimeout(() => {
      toast.success("Logged out successfully.", { id: logoutToastId })
      navigate('/')
    }, 600)
  }

  return (
    <>
      {/* --- MOBILE STICKY NAVIGATION HEADER BAR --- */}
      <div className="lg:hidden w-full bg-royal-dark border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-lime-accent" />
          <span className="font-bold text-xs uppercase tracking-wider text-gray-canvas">Super Admin Panel</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2 text-gray-canvas hover:text-lime-accent bg-royal-main/40 rounded-xl border border-white/10 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* --- BACKGROUND FOCUS BACKDROP OVERLAY --- */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300" 
        />
      )}

      {/* --- MAIN SIDEBAR MODULE MATRIX CONTAINER --- */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-royal-dark border-r border-white/10 h-screen flex flex-col justify-between p-6 select-none transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:transform-none lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          
          {/* BRAND HEADER LAYOUT PANEL */}
          <div className="flex items-center justify-between px-2 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-lime-accent/10 text-lime-accent rounded-xl border border-lime-accent/20">
                <img src={Logo} className='w-9 h-9' alt="Logo" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide uppercase text-gray-canvas">Super Admin Panel</h1>
              </div>
            </div>

            {/* HIGHLY VISIBLE MOBILE CLOSE TRIGGER ACTION BUTTON */}
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-canvas hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              title="Close Navigation Terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* DYNAMIC NAVIGATION ACTION ROUTE BUTTONS STACK */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-lime-accent text-royal-dark shadow-[0_4px_20px_rgba(165,206,0,0.25)]'
                      : 'text-gray-canvas/60 hover:bg-royal-main hover:text-gray-canvas'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* TERMINAL FOOTER ACTIONS ROW */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-canvas/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar