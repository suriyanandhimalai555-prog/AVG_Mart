import React, { useState, useEffect } from 'react'
import { IndianRupee, ShieldCheck, RefreshCw, Search, Building2, CreditCard, CheckCircle2, Clock, Download, X, Calendar, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const SellerPayout = () => {
  const [sellers, setSellers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  const getTodayDateStr = () => new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(getTodayDateStr());

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDate, setExportDate] = useState(getTodayDateStr());
  const [isExporting, setIsExporting] = useState(false);

  const formatDateDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const fetchPayoutData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';
      
      let url = `${baseUrl}/api/seller/all?date=${selectedDate}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`Server returned status ${response.status}`);
      const data = await response.json();
      setSellers(data.sellers || data || []);
    } catch (error) {
      console.error('Error fetching payout data:', error);
      toast.error('Network connection error while loading payouts.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayoutData();
  }, [selectedDate]);

  // Handle Dropdown Status Change (Pending / Payment Done)
  const handleStatusChange = async (sellerId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/seller/payout-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sellerId, date: selectedDate, status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update status.");

      toast.success(`Payout status updated to [${newStatus.toUpperCase()}] for ${formatDateDDMMYYYY(selectedDate)}!`);
      
      // Update local state smoothly
      setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, payout_status: newStatus } : s));
    } catch (error) {
      toast.error("Failed to update payout status.");
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const query = searchQuery.toLowerCase();
    return (
      (seller.store_name && seller.store_name.toLowerCase().includes(query)) ||
      (seller.owner_name && seller.owner_name.toLowerCase().includes(query)) ||
      (seller.bank_name && seller.bank_name.toLowerCase().includes(query)) ||
      (seller.account_holder && seller.account_holder.toLowerCase().includes(query)) ||
      (seller.account_number && seller.account_number.toLowerCase().includes(query))
    );
  });

  const handleDownloadExcelSubmit = async (e) => {
    e.preventDefault();
    if (!exportDate) {
      toast.error("Please select a valid date.");
      return;
    }

    setIsExporting(true);
    toast.loading("Generating daily payout report...", { id: "excelLoad" });

    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';
      
      const response = await fetch(`${baseUrl}/api/seller/all?date=${exportDate}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error("Failed to fetch payout data for export.");
      const data = await response.json();
      const exportList = data.sellers || data || [];

      if (exportList.length === 0) {
        toast.dismiss("excelLoad");
        toast.error(`No payout records found for date: ${formatDateDDMMYYYY(exportDate)}`);
        setIsExporting(false);
        return;
      }

      const formattedExportDate = formatDateDDMMYYYY(exportDate);
      const headers = ['Store Name', 'Owner Name', 'Email', 'Bank Name', 'Account Holder', 'Account Number', 'IFSC Code', 'Status', `Daily Payout (${formattedExportDate} 12AM - 11:59PM)`];
      const rows = exportList.map(s => [
        `"${s.store_name || ''}"`,
        `"${s.owner_name || ''}"`,
        `"${s.email || ''}"`,
        `"${s.bank_name || ''}"`,
        `"${s.account_holder || ''}"`,
        `"${s.account_number || ''}"`,
        `"${s.ifsc_code || ''}"`,
        `"${s.payout_status || 'pending'}"`,
        s.total_earnings || 0
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `merchant_daily_payout_${exportDate.split('-').reverse().join('-')}.csv`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.dismiss("excelLoad");
      toast.success(`Payout report for ${formattedExportDate} downloaded successfully!`);
      setIsExportModalOpen(false);
    } catch (err) {
      toast.dismiss("excelLoad");
      toast.error("Error generating excel download.");
    } finally {
      setIsExporting(false);
    }
  };

  const totalDailyLiability = filteredSellers.reduce((acc, curr) => acc + Number(curr.total_earnings || 0), 0);

  return (
    <div className="bg-royal-dark text-white min-h-screen p-6 md:p-10 relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.25em] uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full text-lime-accent mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-accent" />demo Daily Settlement Operations
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              Merchant <span className="text-lime-accent">Payouts</span> Ledger
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Daily payout calculated strictly from <span className="text-white font-bold">12:00 AM to 11:59 PM</span> for <span className="text-lime-accent font-mono">{formatDateDDMMYYYY(selectedDate)}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setExportDate(selectedDate); setIsExportModalOpen(true); }}
              className="inline-flex items-center gap-2 bg-lime-accent hover:brightness-95 text-royal-dark text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
            >
              <Download className="w-4 h-4" /> Export Excel / CSV
            </button>

            <button
              onClick={fetchPayoutData}
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Sync
            </button>
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-white/40">Active Sellers Today</p>
              <h3 className="text-2xl font-black text-white mt-1">{filteredSellers.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-lime-accent/10 border border-lime-accent/20 flex items-center justify-center text-lime-accent">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-white/40">Today's Payout Liability</p>
              <h3 className="text-2xl font-black text-lime-accent mt-1">₹{totalDailyLiability.toLocaleString('en-IN')}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-lime-accent/10 border border-lime-accent/20 flex items-center justify-center text-lime-accent">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div>
              <p className="text-[10px] font-black tracking-widest uppercase text-white/40">Settlement Cycle</p>
              <h3 className="text-lg font-black text-white mt-1">12:00 AM – 11:59 PM</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search & Date Filter Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store, owner, bank, account no..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-lime-accent transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-2">
              <span className="text-[10px] font-mono text-lime-accent uppercase font-bold">Select Payout Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
              />
              <span className="text-[10px] font-mono text-white/50 pl-1 border-l border-white/20">({formatDateDDMMYYYY(selectedDate)})</span>
            </div>
          </div>
        </div>

        {/* Payouts Table with Dropdown Status Selector */}
        {isLoading ? (
          <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-28 border border-white/5 rounded-2xl bg-white/[0.01]">
            Calculating 12:00 AM - 11:59 PM orders for {formatDateDDMMYYYY(selectedDate)}...
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-16 text-center space-y-3">
            <CreditCard className="w-8 h-8 text-white/20 mx-auto" />
            <h3 className="text-sm font-black uppercase text-white tracking-widest">No Payout Records For This Date</h3>
            <p className="text-xs text-white/40">No orders were placed for sellers between 12:00 AM and 11:59 PM on {formatDateDDMMYYYY(selectedDate)}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <th className="p-4">Store & Merchant</th>
                  <th className="p-4">Bank Name & Holder</th>
                  <th className="p-4">Account Number & IFSC</th>
                  <th className="p-4">Daily Payout ({formatDateDDMMYYYY(selectedDate)})</th>
                  <th className="p-4 text-center">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium">
                {filteredSellers.map((seller) => {
                  const currentStatus = seller.payout_status || 'pending';
                  return (
                    <tr key={seller.id || seller.email} className="hover:bg-white/[0.03] transition-colors group">
                      
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-lime-accent/10 border border-lime-accent/20 flex items-center justify-center text-lime-accent font-black uppercase">
                            {seller.store_name ? seller.store_name.charAt(0) : 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-white group-hover:text-lime-accent transition-colors">
                              {seller.store_name || 'N/A'}
                            </p>
                            <p className="text-[10px] text-white/40 font-mono">Owner: {seller.owner_name}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono">
                        <p className="text-white/90 font-bold">{seller.bank_name || 'N/A'}</p>
                        <p className="text-[11px] text-white/60">Holder: {seller.account_holder || seller.owner_name}</p>
                      </td>

                      <td className="p-4 font-mono">
                        <p className="text-white/90 tracking-wider">A/C: <span className="text-lime-accent">{seller.account_number || 'N/A'}</span></p>
                        <p className="text-[11px] text-white/50 uppercase">IFSC: {seller.ifsc_code || 'N/A'}</p>
                      </td>

                      <td className="p-4 font-mono">
                        <span className="text-sm font-black text-lime-accent">
                          ₹{Number(seller.total_earnings || 0).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Dropdown Status Selector */}
                      <td className="p-4 text-center">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(seller.id, e.target.value)}
                          className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider border outline-none cursor-pointer transition-all ${
                            currentStatus === 'paid'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          <option value="pending" className="bg-royal-dark text-amber-400">Pending</option>
                          <option value="paid" className="bg-royal-dark text-emerald-400">Payment Done</option>
                        </select>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A224E] border border-white/10 rounded-2xl max-w-md w-full p-6 md:p-8 space-y-6 relative shadow-2xl">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-xl border border-white/10 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-lime-accent tracking-widest">Spreadsheet Export</span>
              <h3 className="text-xl font-black uppercase text-white">Select Payout Date</h3>
              <p className="text-xs text-white/50">Choose target date (12AM - 11:59PM) to export.</p>
            </div>

            <form onSubmit={handleDownloadExcelSubmit} className="space-y-5">
              <div className="space-y-2">
                <div className="relative flex items-center">
                  <Calendar className="absolute left-4 text-white/40 w-4 h-4" />
                  <input
                    type="date"
                    required
                    value={exportDate}
                    onChange={(e) => setExportDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-white uppercase focus:border-lime-accent outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isExporting}
                  className="px-6 py-2.5 bg-lime-accent hover:brightness-95 text-royal-dark font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isExporting ? "Generating..." : "Download CSV"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerPayout