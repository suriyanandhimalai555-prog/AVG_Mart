import React, { useState, useEffect } from 'react'
import { IndianRupee, ShieldCheck, RefreshCw, Calendar, CheckCircle2, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'

const SellerDailyPayouts = () => {
  const [payouts, setPayouts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return dateString;
    return dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const fetchMyPayouts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/seller/my-payouts`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Failed to fetch payout ledger.");
      const data = await response.json();
      setPayouts(data.payouts || []);
    } catch (error) {
      console.error("Error loading daily payouts:", error);
      toast.error("Failed to load your payout ledger.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPayouts();
  }, []);

  return (
    <div className="bg-royal-dark text-white min-h-screen p-6 md:p-10 relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.25em] uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full text-lime-accent mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-accent" /> Merchant Earnings & Settlement
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              Daily <span className="text-lime-accent">Payout</span> Ledger
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Track your daily order earnings calculated strictly from <span className="text-white font-bold">12:00 AM to 11:59 PM</span>.
            </p>
          </div>

          <button
            onClick={fetchMyPayouts}
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Ledger
          </button>
        </div>

        {/* Payouts Table */}
        {isLoading ? (
          <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-28 border border-white/5 rounded-2xl bg-white/[0.01]">
            Loading your settlement statements...
          </div>
        ) : payouts.length === 0 ? (
          <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-16 text-center space-y-3">
            <Calendar className="w-8 h-8 text-white/20 mx-auto" />
            <h3 className="text-sm font-black uppercase text-white tracking-widest">No Payout Records Yet</h3>
            <p className="text-xs text-white/40">You have no recorded daily orders in your statement ledger.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <th className="p-4">Payout Date (12AM - 11:59PM)</th>
                  <th className="p-4 text-center">Total Orders</th>
                  <th className="p-4">Earned Payout Amount</th>
                  <th className="p-4 text-center">Settlement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium font-mono">
                {payouts.map((item, idx) => {
                  const isPaid = item.payout_status === 'paid';
                  return (
                    <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                      <td className="p-4 text-white/90 font-bold">
                        {formatDateDDMMYYYY(item.payout_date)}
                      </td>
                      <td className="p-4 text-center text-white/70">
                        {item.total_orders} order(s)
                      </td>
                      <td className="p-4 text-lime-accent font-black text-sm">
                        ₹{Number(item.earned_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                          isPaid 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}>
                          {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {isPaid ? 'Payment Done' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

export default SellerDailyPayouts