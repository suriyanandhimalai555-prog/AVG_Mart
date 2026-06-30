import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Truck, Users, LogOut, Menu, X, ShieldAlert, Store, Package, PackagePlus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Logo from "../../assets/logo.png"

const BranchSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  // Specific tracking routes assigned strictly for the branch admin operations context
  const menuItems = [
    { name: 'Dashboard', path: '/branch-admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Branch Orders', path: '/branch-admin/orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Deliveries', path: '/branch-admin/deliveries', icon: <Truck className="w-5 h-5" /> },
    { name: 'Stock', path: '/branch-admin/stock', icon: <Package className="w-5 h-5" /> },
    { name: 'Request Stock', path: '/branch-admin/request-stock', icon: <PackagePlus className="w-5 h-5" /> },
  ]

  // Clear system authentication tokens and bounce back to standard login matrix 
  const handleLogout = () => {
    const logoutToastId = toast.loading("Terminating session parameters...")
    
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userName')

    setTimeout(() => {
      toast.success("Branch session cleared.", { id: logoutToastId })
      navigate('/login')
    }, 600)
  }

  return (
    <>
      {/* --- MOBILE STICKY NAVIGATION HEADER BAR --- */}
      <div className="lg:hidden w-full bg-[#071640] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-lime-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-white">Branch Operator</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)} 
          className="p-2 text-white hover:text-lime-400 bg-white/5 rounded-xl border border-white/10 transition-colors cursor-pointer"
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
        fixed inset-y-0 left-0 z-50 w-64 bg-[#071640] border-r border-white/10 h-screen flex flex-col justify-between p-6 select-none transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:transform-none lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          
          {/* BRAND HEADER LAYOUT PANEL */}
          <div className="flex items-center justify-between px-2 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 border border-white/10 rounded-xl">
                <img src={Logo} className='w-9 h-9 object-contain' alt="Logo" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide uppercase text-white">Branch Admin</h1>
                <p className="text-[9px] font-black text-lime-400 tracking-wider uppercase mt-0.5">Control Node</p>
              </div>
            </div>

            {/* HIGHLY VISIBLE MOBILE CLOSE TRIGGER ACTION BUTTON */}
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
              title="Close Panel Layout"
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
                      ? 'bg-lime-400 text-[#071640] shadow-[0_4px_25px_rgba(165,206,0,0.3)] font-black'
                      : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-left cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default BranchSidebar;