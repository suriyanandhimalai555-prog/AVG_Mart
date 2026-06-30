import React, { useState, useEffect } from 'react'
import { Layers, Package, Send, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_PRODUCTS_URL = 'http://localhost:5000/api/products'
const API_REQUESTS_URL = 'http://localhost:5000/api/branch-stock/stock-requests'

const RequestStock = () => {
  const [products, setProducts] = useState([])
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Form Inputs
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [requestedCount, setRequestedCount] = useState('')
  const [calculatedAmount, setCalculatedAmount] = useState(0)

  useEffect(() => {
    fetchProducts()
    fetchRequests()
  }, [])

  // Instantly calculates total amount when product or count selections change
  useEffect(() => {
    if (!selectedProductId || !requestedCount) {
      setCalculatedAmount(0)
      return
    }
    const targetProduct = products.find(p => p.id === parseInt(selectedProductId))
    if (targetProduct) {
      const basePrice = targetProduct.branch_admin_price !== undefined ? targetProduct.branch_admin_price : targetProduct.originalPrice || 0;
      setCalculatedAmount(parseFloat(basePrice) * parseInt(requestedCount))
    }
  }, [selectedProductId, requestedCount, products])

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_PRODUCTS_URL)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error("Failed loading inventory dataset products:", err)
    }
  }

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_REQUESTS_URL)
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: parseInt(selectedProductId),
          category: selectedCategory,
          requestedCount: parseInt(requestedCount),
          totalAmount: calculatedAmount
        })
      })

      if (response.ok) {
        toast.success("Request synchronized to Main Admin pipeline!", { id: toastLoadId })
        setSelectedCategory('')
        setSelectedProductId('')
        setRequestedCount('')
        setCalculatedAmount(0)
        fetchRequests()
      } else {
        toast.error("Pipeline request submission failure.", { id: toastLoadId })
      }
    } catch (err) {
      toast.error("Network communication link pipeline dropped.", { id: toastLoadId })
    }
  }

  const parseStatusLabel = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="flex items-center gap-1 w-fit px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Approved</span>
      case 'Rejected':
        return <span className="flex items-center gap-1 w-fit px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"><XCircle className="w-3 h-3" /> Rejected</span>
      default:
        return <span className="flex items-center gap-1 w-fit px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 animate-pulse"><Clock className="w-3 h-3" /> Pending</span>
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-royal-dark/20 min-h-screen text-gray-canvas text-left">
      <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">Stock Provisioning Request Engine</h2>
        <p className="text-xs text-gray-canvas/50 font-medium mt-1">Select branch product criteria categories, calculate expenditures automatically, and forward directly into main logistics lines.</p>
      </div>

      <div className="bg-royal-main/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl max-w-xl">
        <h3 className="text-sm font-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <Layers className="w-4 h-4 text-lime-accent" /> Draft Stock Invoice Pipeline
        </h3>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Category Type Node</label>
              <select
                required
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setSelectedProductId(''); }}
                className="w-full bg-royal-dark border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-canvas uppercase tracking-wider focus:outline-none focus:border-lime-accent cursor-pointer"
              >
                <option value="">-- SELECT --</option>
                {uniqueCategories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Target Product</label>
              <select
                required
                disabled={!selectedCategory}
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-royal-dark border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-canvas uppercase tracking-wider focus:outline-none focus:border-lime-accent disabled:opacity-30 cursor-pointer"
              >
                <option value="">-- CHOOSE ITEMS --</option>
                {filteredProducts.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.branch_admin_price !== undefined ? p.branch_admin_price : p.branchAdminPrice})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Requested Volume Unit Count</label>
            <input 
              type="number"
              required
              min="1"
              placeholder="e.g., 100"
              value={requestedCount}
              onChange={(e) => setRequestedCount(e.target.value)}
              className="w-full bg-royal-dark border border-white/10 rounded-xl px-4 py-3 text-xs font-mono font-bold text-gray-canvas focus:outline-none focus:border-lime-accent"
            />
          </div>

          <div className="bg-royal-dark/60 rounded-xl p-4 border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/40">Computed Admin Cost Value</p>
              <p className="text-lg font-black font-mono text-lime-accent mt-0.5">₹{calculatedAmount.toLocaleString()}</p>
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-lime-accent text-royal-dark hover:shadow-[0_4px_20px_rgba(165,206,0,0.25)] transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" /> Transmit Request
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
          <Package className="w-4 h-4 text-lime-accent" /> Track Dispatched Branch Invoices Log
        </h3>

        {isLoading ? (
          <div className="text-xs font-mono tracking-widest text-lime-accent uppercase py-6 animate-pulse">Syncing tracking logs indices stream...</div>
        ) : requests.length === 0 ? (
          <p className="text-xs text-gray-canvas/40 uppercase font-mono py-4">No requests dispatched via this network node endpoint terminal yet.</p>
        ) : (
          <div className="overflow-x-auto border border-white/5 rounded-2xl bg-royal-main/20">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-royal-dark/60 border-b border-white/5 text-[10px] font-black uppercase tracking-wider text-gray-canvas/50">
                  <th className="p-4">Product Context Description</th>
                  <th className="p-4">Category System Identifier</th>
                  <th className="p-4">Volume Requested</th>
                  <th className="p-4">Aggregated Value Pricing</th>
                  <th className="p-4">Pipeline Execution State</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{r.product_name || `Archived Product Asset Record`}</td>
                    <td className="p-4 uppercase tracking-wider font-semibold text-gray-canvas/70">{r.category}</td>
                    <td className="p-4 font-mono font-bold text-gray-canvas">{r.requested_count} units</td>
                    <td className="p-4 font-mono text-lime-accent font-black">₹{parseFloat(r.total_amount).toLocaleString()}</td>
                    <td className="p-4">{parseStatusLabel(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default RequestStock