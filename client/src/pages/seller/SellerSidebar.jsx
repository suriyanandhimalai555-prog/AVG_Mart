import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Store, Menu, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Logo from '../../assets/logo.png';

const SellerSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sellerData, setSellerData] = useState({ storeName: '', email: '' });
  const navigate = useNavigate();

  // Fetch store name and email from localStorage on mount
  useEffect(() => {
    const storeName = localStorage.getItem('userName') || 'Seller Store';
    const email = localStorage.getItem('userEmail') || 'seller@avgmart.com';
    setSellerData({ storeName, email });
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Manage Products', path: '/seller/products', icon: <Package className="w-5 h-5" /> },
    { name: 'Orders & Fulfillment', path: '/seller/orders', icon: <ShoppingBag className="w-5 h-5" /> },
    { name: 'Profile', path: '/seller/profile', icon: <Store className="w-5 h-5" /> },
  ];

  // Handle logout with toast feedback
  const handleLogout = () => {
    const logoutToastId = toast.loading('Terminating seller session...');

    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');

    setTimeout(() => {
      toast.success('Logged out successfully.', { id: logoutToastId });
      navigate('/seller/login');
    }, 600);
  };

  return (
    <>
      {/* --- MOBILE STICKY NAVIGATION HEADER BAR --- */}
      <div className="lg:hidden w-full bg-[#071640] border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-lime-400" />
          <div className="leading-tight">
            <span className="font-bold text-xs uppercase tracking-wider text-white block">
              {sellerData.storeName}
            </span>
            <span className="text-[10px] text-white/50 block">{sellerData.email}</span>
          </div>
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
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#071640] border-r border-white/10 h-screen flex flex-col justify-between p-6 select-none transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:transform-none lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="space-y-8">
          {/* BRAND HEADER LAYOUT PANEL WITH STORE NAME & EMAIL */}
          <div className="flex items-center justify-between px-2 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-lime-400/10 text-lime-400 rounded-xl border border-lime-400/20 shrink-0">
                <img src={Logo} className="w-9 h-9 object-contain" alt="Logo" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-sm tracking-wide uppercase text-white truncate" title={sellerData.storeName}>
                  {sellerData.storeName}
                </h1>
                <p className="text-[10px] text-lime-400 font-mono tracking-wider truncate" title={sellerData.email}>
                  {sellerData.email}
                </p>
              </div>
            </div>

            {/* HIGHLY VISIBLE MOBILE CLOSE TRIGGER ACTION BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer shrink-0"
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
                      ? 'bg-lime-400 text-[#071640] shadow-[0_4px_20px_rgba(165,206,0,0.25)]'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
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
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SellerSidebar;