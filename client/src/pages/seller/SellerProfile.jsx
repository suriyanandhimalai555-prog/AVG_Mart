import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaBuilding,
  FaStore,
  FaMapMarkerAlt,
  FaUniversity,
  FaCheckCircle,
  FaSpinner,
  FaGift,
  FaCopy,
  FaCheck,
  FaTrashAlt,
  FaExclamationTriangle,
  FaTimes,
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SellerProfile = () => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Account deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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

  const handleCopyCode = () => {
    if (seller?.referral_code) {
      navigator.clipboard.writeText(seller.referral_code);
      setCopied(true);
      toast.success('Referral code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion.');
      return;
    }

    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/seller/profile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete seller account');
      }

      toast.success('Account and all associated data deleted.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/seller/login';
    } catch (error) {
      toast.error(error.message);
      setDeleting(false);
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
    <div className="p-4 md:p-8 bg-royal-dark min-h-screen text-white select-none rounded-2xl">
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
              <p className="text-xs text-white/50 mt-1">
                {seller.store_description || 'No store description provided.'}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right bg-white/5 p-4 rounded-2xl border border-white/10 w-full md:w-auto">
            <p className="text-[10px] font-black uppercase text-lime-400 tracking-widest">
              Merchant ID
            </p>
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

          {/* SECTION 1.5: REFERRAL PROGRAM CARD */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-lime-400 flex items-center gap-2 border-b border-white/10 pb-3">
              <FaGift /> Merchant Referral Program
            </h2>
            <div className="space-y-3">
              <p className="text-xs text-white/60">
                Share your unique referral code with other merchants and grow the AVG ecosystem.
              </p>
              <div className="flex items-center justify-between bg-black/30 p-3 rounded-2xl border border-white/10">
                <div>
                  <p className="text-[10px] uppercase text-white/40 font-bold">Your Referral Code</p>
                  <p className="font-mono text-base font-bold text-lime-400 tracking-wider mt-0.5">
                    {seller.referral_code || 'Generating...'}
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-4 py-2 bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
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
                <p className="text-xs font-mono font-semibold text-white mt-1 uppercase">
                  {seller.gst_number}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-white/40 font-bold">PAN Number</p>
                <p className="text-xs font-mono font-semibold text-white mt-1 uppercase">
                  {seller.pan_number || 'N/A'}
                </p>
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
                  {seller.shipping_type === 'standard'
                    ? 'AVG Logistics Fulfilled'
                    : 'Self Ship / Local Express'}
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4: SETTLEMENT BANK DETAILS */}
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5 md:col-span-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-lime-400 flex items-center gap-2 border-b border-white/10 pb-3">
              <FaUniversity /> Bank Settlement Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-xs font-mono font-semibold text-white mt-1 uppercase">
                  {seller.ifsc_code}
                </p>
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

        {/* DANGER ZONE: PERMANENT ACCOUNT DELETION */}
        <div className="bg-red-500/[0.04] border border-red-500/25 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
              <FaExclamationTriangle /> Danger Zone — Delete Account
            </h2>
            <p className="text-xs text-white/60 max-w-2xl">
              Permanently delete your seller account, store profile, products, payout logs, and referral records. This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setConfirmText('');
              setShowDeleteModal(true);
            }}
            className="px-5 py-3 bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <FaTrashAlt /> Delete Account
          </button>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b1f57] border border-red-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 relative shadow-2xl">
            <button
              type="button"
              disabled={deleting}
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white bg-white/5 rounded-xl border border-white/10 cursor-pointer disabled:opacity-40"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 text-lg shrink-0">
                <FaExclamationTriangle />
              </div>
              <div>
                <h3 className="text-base font-black uppercase text-white">
                  Confirm Account Deletion
                </h3>
                <p className="text-[11px] text-red-300/80">
                  All your merchant data will be permanently wiped.
                </p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Type <span className="font-mono font-bold text-red-400">DELETE</span> below to
              permanently delete <span className="font-bold text-white">{seller.store_name}</span>{' '}
              and all associated records.
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              disabled={deleting}
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-red-400"
            />

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 text-xs font-bold transition cursor-pointer disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting || confirmText !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                {deleting ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
                {deleting ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProfile;