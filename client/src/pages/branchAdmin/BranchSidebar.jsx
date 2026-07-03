import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Store,
  Package,
  PackagePlus,
  Mail,
  User,
  User2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Logo from '../../assets/logo.png'

const BranchSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [branchAdmin, setBranchAdmin] = useState(null);

  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/branch-admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Branch Orders",
      path: "/branch-admin/orders",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      name: "Stock",
      path: "/branch-admin/stock",
      icon: <Package className="w-5 h-5" />,
    },
    {
      name: "Request Stock",
      path: "/branch-admin/request-stock",
      icon: <PackagePlus className="w-5 h-5" />,
    },
    {
      name: "Profile",
      path: "/branch-admin/profile",
      icon: <User2 className="w-5 h-5" />,
    },
  ];

  useEffect(() => {
    fetchBranchProfile();
  }, []);

  const fetchBranchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/api/auth/admin/branch`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Supports both object and array responses
      const data = Array.isArray(res.data) ? res.data[0] : res.data;

      setBranchAdmin(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Branch Profile");
    }
  };

  const handleLogout = () => {
    const id = toast.loading("Logging out...");

    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");

    setTimeout(() => {
      toast.success("Logged out successfully.", { id });
      navigate("/login");
    }, 500);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden w-full bg-[#071640] border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2 text-left">
          <img src={Logo} className="w-9 h-9" alt="Logo" />
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-lime-400 block leading-none">
              Branch Panel
            </span>
            <span className="text-xs font-bold text-white block mt-0.5">
              {branchAdmin?.branch || "Loading..."}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl bg-white/5 border border-white/10"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar Layout */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#071640]
          border-r border-white/10
          flex flex-col justify-between
          p-6 select-none
          transition-transform duration-300
          lg:translate-x-0 lg:sticky lg:top-0 h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div>
          {/* Header Segment (AVG Mart logo box removed entirely) */}
          <div className="flex justify-between items-center pb-5 border-b border-white/10 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 border border-white/10 rounded-xl">
                <img src={Logo} className="w-9 h-9" alt="Logo" />
              </div>
              <div>
                <p className="text-[10px] text-lime-400 uppercase font-black tracking-widest">
                  Branch Panel
                </p>
                <h2 className="text-white text-sm font-black uppercase tracking-wide mt-0.5 truncate max-w-[150px]">
                  {branchAdmin?.branch || "Loading..."}
                </h2>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} className="lg:hidden">
              <X className="text-white w-5 h-5 hover:text-red-400 transition-colors" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-lime-400 text-[#071640] shadow-[0_4px_20px_rgba(163,230,53,0.25)] font-black"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Area with Name and Email positioned directly near Logout button */}
        <div className="border-t border-white/10 pt-4 space-y-4 text-left">
          
          <div className="px-2 space-y-2">
            {/* User Operator Name Row */}
            <div className="flex items-center gap-2.5 text-white/80">
              <User className="w-4 h-4 text-lime-400 flex-shrink-0" />
              <span className="text-[15px] font-bold uppercase tracking-wide truncate">
                {branchAdmin?.name || "Loading..."}
              </span>
            </div>
            
            {/* User Mail Row */}
            <div className="flex items-center gap-2.5 text-white/40">
              <Mail className="w-4 h-4 text-lime-400/70 flex-shrink-0" />
              <span className="text-[15px] tracking-tight truncate">
                {branchAdmin?.email || "-"}
              </span>
            </div>
          </div>

          {/* Logout Action Module */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default BranchSidebar;