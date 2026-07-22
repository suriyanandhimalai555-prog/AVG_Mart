import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBuilding, 
  FaCreditCard, 
  FaStore, 
  FaMapMarkerAlt, 
  FaTruck, 
  FaUniversity, 
  FaCheckCircle, 
  FaSpinner 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');

      setSeller(data.seller);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#071640] text-white">
        <div className="flex items-center gap-3 text-lime-400 font-bold text-sm uppercase tracking-wider">
          <FaSpinner className="animate-spin text-xl" />
          <span>Loading Merchant Profile...</span>
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="p-8 text-center bg-[#071640] text-white">
        <p className="text-red-400 font-bold">Unable to load profile data.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#071640] min-h-screen text-white select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER CARD */}
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400 text-2xl font-black">
              <FaStore />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">
                  {seller.store_name}
                </h1>
                <span className="px-2.5 py-0.5 bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
                  <FaCheckCircle className="text-[9px]" /> {seller.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-white/50 mt-1">{seller.store_description || 'No store description provided.'}</p>
            </div>
          </div>

          <div className="text-left md:text-right bg-white/5 p-4 rounded-2xl border border-white/10 w-full md:w-auto">
            <p className="text-[10px] font-black uppercase text-lime-400 tracking-widest">Merchant ID</p>
            <p className="font-mono text-sm text-white font-bold">#AVG-SLR-{seller.id}</p>
          </div>
        </div>

        {/* DETAILS GRID MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SECTION 1: ACCOUNT & CONTACT INFO */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-lime-400 flex items-center gap-2 border-b border-white/10 pb-3">
              <FaUser /> Account & Owner Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Owner Name</p>
                <p className="text-xs font-semibold text-white mt-1">{seller.owner_name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Email Address</p>
                <p className="text-xs font-semibold text-white mt-1 break-all">{seller.email}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Phone Number</p>
                <p className="text-xs font-semibold text-white mt-1">{seller.phone}</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: TAX & COMPLIANCE */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-lime-400 flex items-center gap-2 border-b border-white/10 pb-3">
              <FaBuilding /> Tax & Verification
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">GSTIN Number</p>
                <p className="text-xs font-mono font-semibold text-white mt-1 uppercase">{seller.gst_number}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">PAN Number</p>
                <p className="text-xs font-mono font-semibold text-white mt-1 uppercase">{seller.pan_number || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: PICKUP & SHIPPING HUB */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-lime-400 flex items-center gap-2 border-b border-white/10 pb-3">
              <FaMapMarkerAlt /> Shipping & Pickup Location
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Pickup Address</p>
                <p className="text-xs font-semibold text-white mt-1">{seller.pickup_address}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] uppercase text-white/40 font-bold">City</p>
                  <p className="text-xs font-semibold text-white mt-1">{seller.city}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/40 font-bold">State</p>
                  <p className="text-xs font-semibold text-white mt-1">{seller.state}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/40 font-bold">Pincode</p>
                  <p className="text-xs font-semibold text-white mt-1">{seller.pincode}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Fulfillment Mode</p>
                <span className="inline-block mt-1 px-3 py-1 bg-white/5 border border-white/10 text-white font-bold text-[10px] rounded-lg uppercase">
                  {seller.shipping_type === 'standard' ? 'AVG Logistics Fulfilled' : 'Self Ship / Local Express'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4: SETTLEMENT BANK DETAILS */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-lime-400 flex items-center gap-2 border-b border-white/10 pb-3">
              <FaUniversity /> Bank Settlement Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Account Holder</p>
                <p className="text-xs font-semibold text-white mt-1">{seller.account_holder}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Bank Name</p>
                <p className="text-xs font-semibold text-white mt-1">{seller.bank_name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">IFSC Code</p>
                <p className="text-xs font-mono font-semibold text-white mt-1 uppercase">{seller.ifsc_code}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">Account Number</p>
                <p className="text-xs font-mono font-semibold text-white mt-1">
                  •••• •••• {seller.account_number ? seller.account_number.slice(-4) : '****'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SellerProfile;