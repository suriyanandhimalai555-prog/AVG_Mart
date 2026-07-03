import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Layers, Package, Send, Clock, CheckCircle2, XCircle, Plus, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_PRODUCTS_URL = 'http://localhost:5000/api/products'
const API_REQUESTS_URL = 'http://localhost:5000/api/stock-requests/stock-requests'

const RequestStock = () => {
  const [products, setProducts] = useState([])
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false) // Tracking state configuration for portal modal

  // Form Inputs
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [requestedCount, setRequestedCount] = useState('')
  const [calculatedAmount, setCalculatedAmount] = useState(0)

  // Extract session token
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchProducts()
    fetchRequests()
  }, [])

  // Instantly calculates total amount when product or count selections change
  // Instantly calculates total amount when product or count selections change
useEffect(() => {
  // Explicitly ensure both a product selection and a non-empty string exist
  if (!selectedProductId || !requestedCount || String(requestedCount).trim() === '') {
    setCalculatedAmount(0)
    return
  }

  const targetProduct = products.find(p => p.id === parseInt(selectedProductId))
  if (targetProduct) {
    // Cascade carefully through possible naming configurations for item base pricing
    const basePrice = targetProduct.branch_admin_price !== undefined 
      ? targetProduct.branch_admin_price 
      : (targetProduct.branchAdminPrice !== undefined ? targetProduct.branchAdminPrice : targetProduct.originalPrice || 0);
    
    // Convert both strictly to numeric values before multiplying to eliminate calculation errors
    const finalNumericPrice = Number(basePrice) || 0;
    const finalNumericCount = Number(requestedCount) || 0;

    setCalculatedAmount(finalNumericPrice * finalNumericCount)
  }
}, [selectedProductId, requestedCount, products])

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_PRODUCTS_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error("Failed loading inventory dataset products:", err)
    }
  }

  // Pass Authorization headers to fetch only current branch requests
  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_REQUESTS_URL, {
        headers: { 
          "Authorization": `Bearer ${token}` 
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (err) {
      console.error("Failed retrieving logs indices tracking array:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter uniquely available configuration category values
  const uniqueCategories = [...new Set(products.map(p => p.category))]
  const filteredProducts = products.filter(p => p.category === selectedCategory)

  // Pass Authorization headers to record request under correct branch node
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProductId || !requestedCount || requestedCount <= 0) {
      toast.error("Please fill in valid stock allocation amounts.")
      return
    }

    const toastLoadId = toast.loading("Dispatching system stock allocation request...")

    try {
      const response = await fetch(API_REQUESTS_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: parseInt(selectedProductId),
          category: selectedCategory,
          requestedCount: parseInt(requestedCount),
          totalAmount: calculatedAmount
        })
      })

      if (response.ok) {
        toast.success("Request synchronized to Main Admin pipeline!", { id: toastLoadId })
        closeAndResetForm()
        fetchRequests()
      } else {
        toast.error("Pipeline request submission failure.", { id: toastLoadId })
      }
    } catch (err) {
      toast.error("Network communication link pipeline dropped.", { id: toastLoadId })
    }
  }

  const closeAndResetForm = () => {
    setSelectedCategory('')
    setSelectedProductId('')
    setRequestedCount('')
    setCalculatedAmount(0)
    setIsModalOpen(false)
  }

  const parseStatusLabel = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Approved</span>
      case 'Rejected':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-red-500/10 border border-red-500/20 text-red-400"><XCircle className="w-3 h-3" /> Rejected</span>
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse"><Clock className="w-3 h-3" /> Pending</span>
    }
  }

  // Premium WebKit horizontal scrollbar optimization styling string
  const customScrollbarClasses = "scrollbar-none [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"

  return (
    <div className="space-y-8 bg-royal-dark/20 min-h-screen text-gray-canvas text-left relative">
      
      {/* HEADER TOP LOGO DESCRIPTIONS SECTION */}
      <div className="border-b border-white/10 pb-6 text-left">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">Stock <span className='text-lime-400'>Request</span> To Admin</h2>
        <p className="text-xs text-gray-canvas/50 font-medium mt-1">Select branch product criteria categories, calculate expenditures automatically, and forward directly into main logistics lines.</p>
      </div>

      {/* TRACK DISPATCHED INVOICES GRID MATRIX TABLE CONTAINER */}
      <div className="bg-[#071640] border border-white/10 rounded-2xl overflow-hidden shadow-xl text-left">
        <div className="px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
              <Package className="w-4 h-4 text-lime-accent" />
              <span>Track Dispatched Branch Invoices Log</span>
            </h3>
            <p className="text-[10px] text-white/40">Active tracking logs indices stream pipeline nodes.</p>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-[10px] font-mono bg-white/5 px-2.5 py-1.5 rounded-full border border-white/10 text-lime-accent">
              Total Requests: {requests.length}
            </span>
            {/* Pakka Corner Alignment: Placed directly into upper right layout grid anchor */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-lime-accent text-royal-dark hover:shadow-[0_4px_20px_rgba(165,206,0,0.25)] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create Request</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse">
            Syncing tracking logs indices stream...
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 text-xs font-bold uppercase tracking-wider text-white/30 border border-dashed border-white/5 m-6 rounded-xl">
            No requests dispatched via this network node endpoint terminal yet.
          </div>
        ) : (
          /* Added webkit horizontal thin custom design scrollbar helper class onto horizontal overflow element */
          <div className={`overflow-x-auto pb-2 ${customScrollbarClasses}`}>
            <table className="w-full text-xs text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-gray-canvas/50">
                  <th className="px-6 py-4">System Reference ID</th>
                  <th className="px-6 py-4">Product Context Description</th>
                  <th className="px-6 py-4">Category System Identifier</th>
                  <th className="px-6 py-4">Volume Requested</th>
                  <th className="px-6 py-4">Aggregated Value Pricing</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-mono text-white/40">#{r.id}</td>
                    <td className="px-6 py-4 font-bold text-white">{r.product_name || `Archived Product Asset Record`}</td>
                    <td className="px-6 py-4 uppercase tracking-wider font-semibold text-gray-canvas/70">{r.category}</td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-canvas">{r.requested_count} units</td>
                    <td className="px-6 py-4 font-mono text-lime-accent font-black">₹{parseFloat(r.total_amount).toLocaleString()}</td>
                    <td className="px-6 py-4">{parseStatusLabel(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PORTAL POPUP: POPUP FORM TO INGEST DATA FIELDS INTO THE PIPELINE */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#071640] border border-white/10 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative space-y-6 text-white text-left">
            
            {/* INGESTION POPUP HEADER */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-lime-accent font-mono">
                  Logistics Distribution Line
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-lime-accent" />
                  <span>Draft Stock Invoice Pipeline</span>
                </h3>
              </div>
              <button 
                onClick={closeAndResetForm} 
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PIPELINE DATA DRAFT CONTAINER INPUT CONTROLLERS */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60 block">Category Type</label>
                  <select
                    required
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setSelectedProductId(''); }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white uppercase tracking-wider focus:outline-none focus:border-lime-accent cursor-pointer text-left"
                  >
                    <option value="" className="bg-[#071640]">-- SELECT --</option>
                    {uniqueCategories.map((cat, idx) => <option key={idx} value={cat} className="bg-[#071640]">{cat}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60 block">Target Product</label>
                  <select
                    required
                    disabled={!selectedCategory}
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white uppercase tracking-wider focus:outline-none focus:border-lime-accent disabled:opacity-30 cursor-pointer text-left"
                  >
                    <option value="" className="bg-[#071640]">-- CHOOSE ITEMS --</option>
                    {filteredProducts.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#071640]">
                        {p.name} (₹{p.branch_admin_price !== undefined ? p.branch_admin_price : p.branchAdminPrice})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60 block">Requested Volume Unit Count</label>
                <input 
                  type="number"
                  required
                  min="1"
                  placeholder="e.g., 100"
                  value={requestedCount}
                  onChange={(e) => setRequestedCount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-lime-accent"
                />
              </div>

              {/* AUTOMATED MATH VALUATION CALCULATOR SUMMARY FOLLOWER LAYOUT */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/40">Computed Admin Cost Value</p>
                  <p className="text-lg font-black font-mono text-lime-accent mt-0.5">₹{calculatedAmount.toLocaleString()}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeAndResetForm}
                    className="px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    close
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider bg-lime-accent text-royal-dark hover:shadow-[0_4px_20px_rgba(165,206,0,0.25)] transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" /> submit Request
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default RequestStock