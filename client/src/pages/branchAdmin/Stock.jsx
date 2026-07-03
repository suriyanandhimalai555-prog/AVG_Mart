import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Edit2, Trash2, Layers, Package, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_BASE_URL = 'http://localhost:5000/api/branch-stock'

const Stock = () => {
  const [stockItems, setStockItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false) // Tracking Popup Modal state toggle

  // Form states
  const [editingId, setEditingId] = useState(null)
  const [category, setCategory] = useState('')
  const [productName, setProductName] = useState('')
  const [count, setCount] = useState('')

  // Get session token references
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchStock()
  }, [])

  // Pass verification headers to fetch only this specific user's stock indices
  const fetchStock = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_BASE_URL, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStockItems(data)
      } else {
        toast.error("Failed to sync structural branch logistics matrix.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Network communication line breakdown.")
    } finally {
      setIsLoading(false)
    }
  }

  // Pass verification headers to tie new stock item configuration to logged-in user context
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!category || !productName || count === '') {
      toast.error("Please complete all validation blocks.")
      return
    }

    const loaderId = toast.loading(editingId ? "Reindexing log asset..." : "Committing stock allocations...")

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingId,
          product_name: productName,
          category: category,
          count: count
        })
      })

      if (response.ok) {
        toast.success(editingId ? "Stock parameters updated!" : "Stock initialized successfully!", { id: loaderId })
        closeAndResetForm()
        fetchStock()
      } else {
        toast.error("Server processing error context caught.", { id: loaderId })
      }
    } catch (error) {
      toast.error("Network interface pipeline fault.", { id: loaderId })
    }
  }

  const handleEditTrigger = (item) => {
    setEditingId(item.id)
    setProductName(item.product_name)
    setCategory(item.category)
    setCount(item.count)
    setIsModalOpen(true) // Open tracking frame overlay view instantly when triggered
  }

  // Added Authorization token checks for delete mutations
  const handleDelete = async (id) => {
    if (!window.confirm("Permanently strip this allocation item node?")) return
    const loaderId = toast.loading("Processing system removal sequence...")

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { 
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.ok) {
        toast.success("Entry removed from storage ledger.", { id: loaderId })
        fetchStock()
      } else {
        toast.error("Drop instruction denied by hardware layer.", { id: loaderId })
      }
    } catch (err) {
      toast.error("Network runtime anomaly execution error.", { id: loaderId })
    }
  }

  const closeAndResetForm = () => {
    setEditingId(null)
    setCategory('')
    setProductName('')
    setCount('')
    setIsModalOpen(false)
  }

  // Premium WebKit custom scrollbar styling layout matrix utilities
  const customScrollbarClasses = "scrollbar-none [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"

  return (
    <div className="space-y-8 min-h-screen text-white bg-[#071640]/20 relative">
      
      {/* HEADER SECTION */}
      <div className="border-b border-white/10 pb-6 text-left">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">Branch <span className='text-lime-400'>Stock</span> Index</h2>
        <p className="text-xs text-white/50 font-medium mt-1">Allocate product distribution metrics inside current local node storage.</p>
      </div>

      {/* STOCKS INVENTORY GRID MATRIX DATA TABLE CONTAINER */}
      <div className="bg-[#071640] border border-white/10 rounded-2xl overflow-hidden shadow-xl text-left">
        <div className="px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
              <Layers className="w-4 h-4 text-lime-400" />
              <span>Available Stocks update</span>
            </h4>
            <p className="text-[10px] text-white/40">Active real-time operational database matrix logs.</p>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-center">
            <span className="text-[10px] font-mono bg-white/5 px-2.5 py-1.5 rounded-full border border-white/10 text-lime-400">
              Total Items: {stockItems.length}
            </span>
            {/* Pakka Design Trigger: Placed directly in the upper right quadrant layout area */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-lime-400 text-[#071640] hover:bg-lime-300 hover:shadow-[0_4px_20px_rgba(165,206,0,0.25)] transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Register New Stock</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-xs font-mono tracking-widest text-lime-400 uppercase animate-pulse">
            Synchronizing Storage Matrix Ledger Pipes...
          </div>
        ) : stockItems.length === 0 ? (
          <div className="text-center py-20 text-xs font-bold uppercase tracking-wider text-white/30 border border-dashed border-white/5 m-6 rounded-xl">
            No stock listings logged within this branch workspace cluster node.
          </div>
        ) : (
          /* Added webkit custom thin scrollbar helper styles on horizontal wrap overflow paths */
          <div className={`overflow-x-auto pb-2 ${customScrollbarClasses}`}>
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-wider text-white/40">
                  <th className="px-6 py-4">System Reference ID</th>
                  <th className="px-6 py-4">Category Class</th>
                  <th className="px-6 py-4">Product Asset Designation</th>
                  <th className="px-6 py-4">Stock Allocation Balance</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium">
                {stockItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="px-6 py-4 font-mono text-white/40">#{item.id}</td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-lime-400">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-semibold tracking-wide">{item.product_name}</td>
                    <td className="px-6 py-4 font-mono font-bold text-sm">
                      <span className={item.count === 0 ? "text-red-400" : "text-white"}>
                        {item.count} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditTrigger(item)}
                          className="p-2 rounded-xl text-blue-400 bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/20 transition-all cursor-pointer"
                          title="Alter Block Settings"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 transition-all cursor-pointer"
                          title="Erase Record Frame"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PORTAL POPUP: DYNAMIC DATA INSERTION & EDIT CONTROL MODAL FRAME */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#071640] border border-white/10 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative space-y-6 text-white text-left">
            
            {/* POPUP MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-lime-400 font-mono">
                  {editingId ? 'Revision Request Pipeline' : 'Data Ingestion Console'}
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-lime-400" />
                  <span>{editingId ? `Update Node Configuration #${editingId}` : 'Register New Node Stock'}</span>
                </h3>
              </div>
              <button 
                onClick={closeAndResetForm} 
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* INPUT CONTROLLER FORM MATRIX */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/50 block">Category Class</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-lime-400 text-white cursor-pointer"
                >
                  <option value="" disabled className="bg-[#071640]">-- SELECT ALLOCATED GENRE --</option>
                  <option value="t-shirt" className="bg-[#071640]">T-Shirt</option>
                  <option value="shoe" className="bg-[#071640]">Shoe</option>
                  <option value="belt" className="bg-[#071640]">Belt</option>
                  <option value="watch" className="bg-[#071640]">Watch</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/50 block">Product Label Identity</label>
                <input 
                  type="text"
                  placeholder="e.g., UltraBoost Flight Performance Prime"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-lime-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/50 block">Total Units Count</label>
                <input 
                  type="number"
                  min="0"
                  placeholder="0"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-lime-400"
                />
              </div>

              {/* ACTION FOOTER BUTTON LINKS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={closeAndResetForm}
                  className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Dismiss Frame
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-lime-400 text-[#071640] hover:bg-lime-300 hover:shadow-[0_4px_20px_rgba(165,206,0,0.25)] transition-all cursor-pointer"
                >
                  {editingId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{editingId ? 'Save Configuration' : 'Inject Metrics'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default Stock