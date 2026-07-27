import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaCopy, 
  FaCheck, 
  FaSignOutAlt, 
  FaStore, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCalendarAlt 
} from 'react-icons/fa';

const MarketDashboard = () => {
  const [marketer, setMarketer] = useState(null);
  const [referredSellers, setReferredSellers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/marketing/login');
      return;
    }

    const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || '';

    // Fetch marketer profile + referred sellers
    axios
      .get(`${API_BASE_URL}/api/marketer/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        if (res.data) {
          setMarketer(res.data.marketer);
          setReferredSellers(res.data.referredSellers || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        // Fallback: try reading saved localStorage data if route fails
        const storedMarketer = localStorage.getItem('marketer');
        if (storedMarketer) {
          setMarketer(JSON.parse(storedMarketer));
        } else {
          navigate('/marketing/login');
        }
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  const handleCopyCode = () => {
    if (marketer?.referral_code) {
      navigator.clipboard.writeText(marketer.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('marketer');
    navigate('/marketing/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#071640] text-white flex items-center justify-center">
        <div className="animate-pulse text-lime-400 font-bold text-lg">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071640] text-white p-6 lg:p-10 select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[#0A224E] p-6 rounded-2xl border border-white/10 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold text-lime-400">Welcome, {marketer?.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{marketer?.city} • {marketer?.email}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500 hover:text-white transition-all text-sm font-semibold"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

        {/* Referral Link Banner */}
<div className="bg-gradient-to-r from-[#0A224E] to-[#12316B] p-8 rounded-2xl border border-lime-400/30 flex flex-col gap-4 shadow-xl">
  <div>
    <h2 className="text-lg font-semibold text-gray-200">Your Exclusive Referral Link</h2>
    <p className="text-sm text-gray-400 mt-1">
      Share this link with sellers. When they click it, your code will be automatically filled in during registration.
    </p>
  </div>
  
  <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/40 p-2 pl-4 rounded-xl border border-white/10 w-full">
    {/* Full URL generated dynamically */}
    <span className="text-sm font-mono text-lime-400 break-all select-all flex-1 py-1">
      {`${window.location.origin}/seller/signup?referral_code=${marketer?.referral_code || ''}`}
    </span>
    
    <button 
      onClick={() => {
        if (marketer?.referral_code) {
          const fullLink = `${window.location.origin}/seller/signup?referral_code=${marketer.referral_code}`;
          navigator.clipboard.writeText(fullLink);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }} 
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-lime-400 text-[#071640] font-black rounded-lg text-xs uppercase tracking-wider hover:bg-lime-300 transition-all shrink-0"
    >
      {copied ? <FaCheck /> : <FaCopy />}
      <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
    </button>
  </div>
</div>

        {/* Marketer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0A224E] p-5 rounded-2xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Total Referred Sellers</p>
            <p className="text-3xl font-black text-lime-400 mt-2">{referredSellers.length}</p>
          </div>
          <div className="bg-[#0A224E] p-5 rounded-2xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Phone Number</p>
            <p className="text-base font-medium text-white mt-2">{marketer?.phone || 'N/A'}</p>
          </div>
          <div className="bg-[#0A224E] p-5 rounded-2xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Account Location</p>
            <p className="text-base font-medium text-white mt-2">{marketer?.city || 'N/A'}</p>
          </div>
        </div>

        {/* Referred Sellers List */}
        <div className="bg-[#0A224E] p-6 rounded-2xl border border-white/10 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FaStore className="text-lime-400" />
              <span>Sellers Signed Up with Your Code</span>
            </h2>
            <span className="text-xs font-bold text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/20">
              {referredSellers.length} Onboarded
            </span>
          </div>

          {referredSellers.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2">
              <p className="text-sm">No sellers have registered with your code ({marketer?.referral_code}) yet.</p>
              <p className="text-xs text-gray-500">Share your code during seller onboarding to see them listed here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="text-[10px] uppercase font-bold text-lime-400 bg-black/20 rounded-lg">
                  <tr>
                    <th className="py-3 px-4 rounded-l-lg">Store Name</th>
                    <th className="py-3 px-4">Owner Name</th>
                    <th className="py-3 px-4">Contact Details</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 rounded-r-lg text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {referredSellers.map((seller) => (
                    <tr key={seller.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <FaStore className="text-white/40 text-xs" />
                        <span>{seller.store_name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-200">
                        <div className="flex items-center gap-1.5">
                          <FaUser className="text-white/30 text-[10px]" />
                          <span>{seller.owner_name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="text-gray-200">{seller.email}</div>
                        <div className="text-gray-400 text-[11px] flex items-center gap-1">
                          <FaPhone className="text-white/30 text-[9px]" />
                          <span>{seller.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-300">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-white/30 text-[10px]" />
                          <span>{seller.city}, {seller.state}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt className="text-white/30 text-[10px]" />
                          <span>{new Date(seller.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2.5 py-1 bg-lime-400/10 text-lime-400 border border-lime-400/30 rounded-full font-bold text-[10px] uppercase">
                          {seller.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MarketDashboard;