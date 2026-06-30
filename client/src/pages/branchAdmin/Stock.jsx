import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Layers, Package, Save, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_BASE_URL = 'http://localhost:5000/api/branch-stock'

const Stock = () => {
  const [stockItems, setStockItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [editingId, setEditingId] = useState(null)
  const [category, setCategory] = useState('')
  const [productName, setProductName] = useState('')
  const [count, setCount] = useState('')

  useEffect(() => {
    fetchStock()
  }, [])

  const fetchStock = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_BASE_URL)
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          product_name: productName,
          category: category,
          count: count
        })
      })

      if (response.ok) {
        toast.success(editingId ? "Stock parameters updated!" : "Stock initialized successfully!", { id: loaderId })
        resetForm()
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
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently strip this allocation item node?")) return
    const loaderId = toast.loading("Processing system removal sequence...")

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' })
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

  const resetForm = () => {
    setEditingId(null)
    setCategory('')
    setProductName('')
    setCount('')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 min-h-screen text-white bg-[#071640]/20">
      
      {/* HEADER SECTION */}
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">Branch Stock Index</h2>
        <p className="text-xs text-white/50 font-medium mt-1">Allocate product distribution metrics inside current local node storage.</p>
      </div>

      {/* INPUT CONTROL CONTROLLER MATRIX */}
      <div className="bg-[#071640] border border-white/10 rounded-2xl p-6 max-w-4xl shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-lime-400 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span>{editingId ? 'Modify Inventory Parameters' : 'Register New Node Stock'}</span>
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-lime-400 text-white cursor-pointer"
            >
              <option value="" disabled className="bg-[#071640]">-- SELECT --</option>
              <option value="t-shirt" className="bg-[#071640]">T-Shirt</option>
              <option value="shoe" className="bg-[#071640]">Shoe</option>
              <option value="belt" className="bg-[#071640]">Belt</option>
              <option value="watch" className="bg-[#071640]">Watch</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Product Label Identity</label>
            <input 
              type="text"
              placeholder="e.g., UltraBoost Flight Performance Prime"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-white/60">Total Units Count</label>
            <input 
              type="number"
              min="0"
              placeholder="0"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-lime-400"
            />
          </div>

          <div className="md:col-span-4 flex items-center justify-end gap-2 pt-2">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-lime-400 text-[#071640] hover:shadow-[0_4px_20px_rgba(165,206,0,0.25)] transition-all"
            >
              {editingId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{editingId ? 'Save Configuration' : 'Inject Metrics'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* STOCKS INVENTORY GRID MATRIX DATA TABLE */}
      <div className="bg-[#071640] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-2">
            <Layers className="w-4 h-4 text-lime-400" />
            <span>Node Asset Allocation Register</span>
          </h4>
          <span className="text-[10px] font-mono bg-white/5 px-2.5 py-1 rounded-full border border-white/10 text-lime-400">
            Total Items: {stockItems.length}
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-xs font-mono tracking-widest text-lime-400 uppercase animate-pulse">
            Synchronizing Storage Matrix Ledger Pipes...
          </div>
        ) : stockItems.length === 0 ? (
          <div className="text-center py-12 text-xs font-bold uppercase tracking-wider text-white/30">
            No stock listings logged within this branch workspace cluster node.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-wider text-white/40">
                  <th className="px-6 py-3.5">System Reference ID</th>
                  <th className="px-6 py-3.5">Category Class</th>
                  <th className="px-6 py-3.5">Product Asset Designation</th>
                  <th className="px-6 py-3.5">Stock Allocation Balance</th>
                  <th className="px-6 py-3.5 text-right">Operational Actions Matrix</th>
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
                          className="p-2 rounded-xl text-blue-400 bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/20 transition-all"
                          title="Alter Block Settings"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-xl text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/20 transition-all"
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

    </div>
  )
}

export default Stock