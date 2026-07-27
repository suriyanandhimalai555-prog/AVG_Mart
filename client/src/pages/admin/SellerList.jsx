import React, { useState, useEffect } from 'react'
import { Search, Store, Mail, Phone, MapPin, Building2, CreditCard, ShieldCheck, RefreshCw, Eye, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

const SellerList = () => {
  const [sellers, setSellers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeller, setSelectedSeller] = useState(null)

  // Fetch all sellers from API
  const fetchSellers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5000';
      
      // Explicit subpath to prevent 404 routing mismatch
      const response = await fetch(`${baseUrl}/api/seller/all`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: Route not found or unauthorized.`);
      }

      const data = await response.json();
      setSellers(data.sellers || data || []);

    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Network connection error while loading sellers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers()
  }, [])

  // Filter sellers dynamically based on search keyword
  const filteredSellers = sellers.filter((seller) => {
    const query = searchQuery.toLowerCase()
    return (
      (seller.store_name && seller.store_name.toLowerCase().includes(query)) ||
      (seller.owner_name && seller.owner_name.toLowerCase().includes(query)) ||
      (seller.email && seller.email.toLowerCase().includes(query)) ||
      (seller.city && seller.city.toLowerCase().includes(query)) ||
      (seller.gst_number && seller.gst_number.toLowerCase().includes(query))
    )
  })

  return (
    <div className="bg-royal-dark text-white min-h-screen p-6 md:p-10 relative overflow-hidden">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.25em] uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full text-lime-accent mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-lime-accent" /> Merchant Ledger
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              Registered <span className="text-lime-accent font-light">Sellers</span> Directory
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Manage onboarded store partners, financial credentials, and fulfillment locations.
            </p>
          </div>

          <button
            onClick={fetchSellers}
            className="self-start md:self-auto inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Sync Ledger
          </button>
        </div>

        {/* Console & Search Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-md">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store, owner, email, GST, city..."
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-lime-accent transition-colors"
            />
          </div>

          <div className="text-xs font-mono text-white/40">
            Total Verified Merchants: <span className="text-lime-accent font-bold">[{filteredSellers.length}]</span>
          </div>
        </div>

        {/* Main Sellers Table */}
        {isLoading ? (
          <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-28 border border-white/5 rounded-2xl bg-white/[0.01]">
            Accessing central seller data node...
          </div>
        ) : filteredSellers.length === 0 ? (
          <div className="border border-dashed border-white/10 bg-white/[0.01] rounded-2xl p-16 text-center space-y-3">
            <Store className="w-8 h-8 text-white/20 mx-auto" />
            <h3 className="text-sm font-black uppercase text-white tracking-widest">No Merchants Located</h3>
            <p className="text-xs text-white/40">No registered sellers matched your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/60">
                  <th className="p-4">Store & Owner</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">GST / PAN</th>
                  <th className="p-4">Shipping Type</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium">
                {filteredSellers.map((seller) => (
                  <tr key={seller.id || seller.email} className="hover:bg-white/[0.03] transition-colors group">
                    
                    {/* Store & Owner Name */}
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

                    {/* Email & Phone */}
                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-white/80">
                        <Mail className="w-3 h-3 text-white/40" /> {seller.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                        <Phone className="w-3 h-3 text-white/30" /> {seller.phone || 'N/A'}
                      </div>
                    </td>

                    {/* City & State */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-white/80">
                        <MapPin className="w-3 h-3 text-lime-accent" />
                        <span>{seller.city ? `${seller.city}, ${seller.state}` : 'N/A'}</span>
                      </div>
                      <p className="text-[10px] font-mono text-white/30 pl-4.5">{seller.pincode}</p>
                    </td>

                    {/* GST & PAN */}
                    <td className="p-4 font-mono text-[11px]">
                      <p className="text-white/80">GST: <span className="text-lime-accent">{seller.gst_number || 'N/A'}</span></p>
                      <p className="text-white/40">PAN: {seller.pan_number || 'N/A'}</p>
                    </td>

                    {/* Shipping Method */}
                    <td className="p-4">
                      <span className="inline-block text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-white/70">
                        {seller.shipping_type || 'Standard'}
                      </span>
                    </td>

                    {/* Inspect Detail Button */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedSeller(seller)}
                        className="p-2 bg-white/5 hover:bg-lime-accent hover:text-royal-dark border border-white/10 rounded-xl transition-all"
                        title="View Full Credentials"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* FULL SELLER CREDENTIALS MODAL */}
      {selectedSeller && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-royal-dark border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedSeller(null)}
              className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-xl border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-lime-accent tracking-widest">Merchant Audit View</span>
              <h2 className="text-2xl font-black uppercase text-white">{selectedSeller.store_name}</h2>
              <p className="text-xs text-white/50">{selectedSeller.store_description || 'No store bio provided.'}</p>
            </div>

            <hr className="border-white/10" />

            {/* Grid 1: Basic & Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <h4 className="font-black uppercase text-[10px] tracking-widest text-white/40 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-lime-accent" /> Owner & Store Profile
                </h4>
                <p><strong className="text-white/50">Owner:</strong> {selectedSeller.owner_name}</p>
                <p><strong className="text-white/50">Email:</strong> {selectedSeller.email}</p>
                <p><strong className="text-white/50">Phone:</strong> {selectedSeller.phone || 'N/A'}</p>
                <p><strong className="text-white/50">Shipping:</strong> {selectedSeller.shipping_type}</p>
              </div>

              <div className="space-y-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                <h4 className="font-black uppercase text-[10px] tracking-widest text-white/40 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-lime-accent" /> Pickup Address Location
                </h4>
                <p><strong className="text-white/50">Address:</strong> {selectedSeller.pickup_address || 'N/A'}</p>
                <p><strong className="text-white/50">City/State:</strong> {selectedSeller.city}, {selectedSeller.state}</p>
                <p><strong className="text-white/50">Pincode:</strong> {selectedSeller.pincode}</p>
              </div>
            </div>

            {/* Grid 2: Tax & Bank Credentials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 bg-white/[0.02] p-4 rounded-xl border border-white/5 font-mono">
                <h4 className="font-black uppercase text-[10px] tracking-widest text-white/40 flex items-center gap-1.5 font-sans">
                  <Building2 className="w-3.5 h-3.5 text-lime-accent" /> Tax Identifiers
                </h4>
                <p><strong className="text-white/50 font-sans">GSTIN:</strong> {selectedSeller.gst_number || 'N/A'}</p>
                <p><strong className="text-white/50 font-sans">PAN:</strong> {selectedSeller.pan_number || 'N/A'}</p>
              </div>

              <div className="space-y-2 bg-white/[0.02] p-4 rounded-xl border border-white/5 font-mono">
                <h4 className="font-black uppercase text-[10px] tracking-widest text-white/40 flex items-center gap-1.5 font-sans">
                  <CreditCard className="w-3.5 h-3.5 text-lime-accent" /> Bank Account Settlement
                </h4>
                <p><strong className="text-white/50 font-sans">Holder:</strong> {selectedSeller.account_holder || 'N/A'}</p>
                <p><strong className="text-white/50 font-sans">Bank:</strong> {selectedSeller.bank_name || 'N/A'}</p>
                <p><strong className="text-white/50 font-sans">Account No:</strong> {selectedSeller.account_number || 'N/A'}</p>
                <p><strong className="text-white/50 font-sans">IFSC Code:</strong> {selectedSeller.ifsc_code || 'N/A'}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default SellerList