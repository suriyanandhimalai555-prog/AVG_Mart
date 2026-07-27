import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MarketDashboard = () => {
  const [marketer, setMarketer] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedMarketer = localStorage.getItem('marketer');
    if (storedMarketer) {
      setMarketer(JSON.parse(storedMarketer));
    } else {
      // Fetch fresh profile data if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/marketing/login');
        return;
      }
      axios
        .get('/api/marketer/profile', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setMarketer(res.data))
        .catch(() => navigate('/marketing/login'));
    }
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

  if (!marketer) return <div className="min-h-screen bg-[#071640] text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#071640] text-white p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-[#0A224E] p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-2xl font-bold text-lime-accent">Welcome, {marketer.name}</h1>
            <p className="text-gray-400 text-sm">{marketer.city} • {marketer.email}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition">
            Logout
          </button>
        </div>

        {/* Referral Card */}
        <div className="bg-gradient-to-r from-[#0A224E] to-[#12316B] p-8 rounded-2xl border border-lime-accent/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-200">Your Exclusive Referral Code</h2>
            <p className="text-sm text-gray-400 mt-1">Share this code with customers to track your referrals.</p>
          </div>
          <div className="flex items-center gap-3 bg-black/30 p-2 pl-4 rounded-xl border border-white/10">
            <span className="text-2xl font-mono font-bold text-lime-accent tracking-widest">{marketer.referral_code}</span>
            <button onClick={handleCopyCode} className="px-4 py-2 bg-lime-accent text-royal-dark font-bold rounded-lg text-sm hover:brightness-110 transition">
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0A224E] p-5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase">Phone Number</p>
            <p className="text-lg font-medium text-white mt-1">{marketer.phone}</p>
          </div>
          <div className="bg-[#0A224E] p-5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 uppercase">Account City</p>
            <p className="text-lg font-medium text-white mt-1">{marketer.city}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketDashboard;