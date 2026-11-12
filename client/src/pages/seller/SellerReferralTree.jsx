import React, { useState, useEffect } from 'react';
import { FaSitemap, FaUsers, FaCopy, FaCheck, FaStore, FaPhone, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SellerReferralTree = () => {
  const [loading, setLoading] = useState(true);
  const [referralData, setReferralData] = useState({ totalDirect: 0, referrals: [] });
  const [copied, setCopied] = useState(false);
  const [sellerCode, setSellerCode] = useState('');

  useEffect(() => {
    fetchReferralTree();
    fetchProfileCode();
  }, []);

  const fetchProfileCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.seller) {
        setSellerCode(data.seller.referral_code);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReferralTree = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/referral-tree`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setReferralData(data);
      }
    } catch (err) {
      toast.error('Failed to load referral network');
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `${window.location.origin}/seller/signup?referral_code=${sellerCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral registration link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        <FaSpinner className="animate-spin text-2xl text-lime-400" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#071640] min-h-screen text-white rounded-2xl space-y-8">
      
      {/* HEADER & SHARE LINK CARD */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400 text-2xl">
            <FaSitemap />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white">Merchant Referral Tree</h1>
            <p className="text-xs text-white/50 mt-1">Grow your merchant downline network and track active referrals.</p>
          </div>
        </div>

        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 w-full md:w-auto space-y-2">
          <p className="text-[10px] font-black uppercase text-lime-400 tracking-widest">Your Direct Share Link</p>
          <div className="flex items-center gap-3">
            <input 
              type="text" 
              readOnly 
              value={referralLink} 
              className="bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-xs text-white/80 font-mono w-full md:w-72 outline-none" 
            />
            <button 
              onClick={handleCopyLink}
              className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              {copied ? <FaCheck /> : <FaCopy />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-lime-400/10 rounded-xl flex items-center justify-center text-lime-400 text-lg font-bold">
            <FaUsers />
          </div>
          <div>
            <p className="text-[10px] uppercase text-white/40 font-bold">Total Direct Referrals (Level 1)</p>
            <p className="text-2xl font-black text-white mt-0.5">{referralData.totalDirect}</p>
          </div>
        </div>
      </div>

      {/* TREE LIST VIEW */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-lime-400 border-b border-white/10 pb-3">
          Your Downline Network Tree
        </h2>

        {referralData.referrals.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-xs">
            No merchants referred yet. Share your link to start building your network tree!
          </div>
        ) : (
          <div className="space-y-4">
            {referralData.referrals.map((seller, index) => (
              <div key={seller.id} className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-4">
                
                {/* Level 1 Node */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-lime-400 font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <FaStore className="text-xs text-lime-400" /> {seller.store_name}
                      </h3>
                      <p className="text-xs text-white/50 mt-0.5">Owner: {seller.owner_name}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
                    <span className="flex items-center gap-1.5"><FaPhone className="text-lime-400 text-[10px]" /> {seller.phone}</span>
                    <span className="flex items-center gap-1.5"><FaEnvelope className="text-lime-400 text-[10px]" /> {seller.email}</span>
                    <span className="px-2.5 py-1 bg-lime-400/10 text-lime-400 font-mono font-bold rounded-lg text-[10px]">
                      {seller.referral_code}
                    </span>
                  </div>
                </div>

                {/* Level 2 Sub-referrals (if any) */}
                {seller.subReferrals && seller.subReferrals.length > 0 && (
                  <div className="ml-6 pl-4 border-l-2 border-lime-400/30 space-y-3 pt-2">
                    <p className="text-[10px] uppercase font-bold text-lime-400">Level 2 Downline ({seller.subReferrals.length})</p>
                    {seller.subReferrals.map((sub) => (
                      <div key={sub.id} className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaStore className="text-xs text-white/40" />
                          <span className="text-xs font-bold text-white">{sub.store_name}</span>
                          <span className="text-[10px] text-white/40">({sub.owner_name})</span>
                        </div>
                        <span className="text-[10px] font-mono text-lime-400">{sub.referral_code}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SellerReferralTree;