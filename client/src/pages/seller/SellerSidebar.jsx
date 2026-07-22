import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaBoxOpen, FaShoppingCart, FaSignOutAlt, FaStore } from 'react-icons/fa';

const SellerSidebar = () => {
  return (
    <aside className="w-full lg:w-64 bg-[#081225] border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-lime-400/10 border border-lime-400/30 rounded-xl flex items-center justify-center text-lime-400">
            <FaStore />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wider uppercase text-white">Seller Hub</h1>
            <p className="text-[10px] text-lime-400 font-mono">AVG MART Central</p>
          </div>
        </div>

        <nav className="space-y-2">
          <NavLink to="/seller/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-lime-400 text-[#050B14]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
            <FaChartLine /> Dashboard Analytics
          </NavLink>
          <NavLink to="/seller/products" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-lime-400 text-[#050B14]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
            <FaBoxOpen /> Manage Products
          </NavLink>
          <NavLink to="/seller/orders" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-lime-400 text-[#050B14]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
            <FaShoppingCart /> Orders & Fulfillment
          </NavLink>
        </nav>
      </div>

      <button onClick={() => { localStorage.clear(); window.location.href = '/seller/login'; }} className="flex items-center gap-2 text-xs text-red-400 font-bold px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors">
        <FaSignOutAlt /> Terminate Session
      </button>
    </aside>
  );
};

export default SellerSidebar;