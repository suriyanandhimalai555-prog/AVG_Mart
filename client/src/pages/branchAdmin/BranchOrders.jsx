import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Calendar, Package, MapPin, Phone } from 'lucide-react'

const BranchOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchBranchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/admin/orders", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          console.log("DEBUG RESPONSE PAYLOAD FROM SERVER:", data) // <--- Check this in your browser Inspect Console!
          setOrders(data)
        } else {
          toast.error("Failed to load branch administrative orders data matrix.")
        }
      } catch (err) {
        console.error("Error reading branch order terminal links:", err)
        toast.error("Network interface pipeline error fetching records.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBranchOrders()
  }, [token])

  if (isLoading) {
    return <div className="text-white p-6 font-mono text-xs uppercase animate-pulse">Loading localized sector orders...</div>
  }

  return (
    <div className="bg-royal-dark text-white min-h-screen p-6 text-left rounded-2xl">
      <h2 className="text-sm font-black tracking-widest uppercase mb-6 text-lime-accent">Assigned Branch Order Hub</h2>
      
      {!orders || orders.length === 0 ? (
        <div className="border border-white/5 bg-white/[0.01] rounded-xl p-8 text-center space-y-2">
          <p className="text-xs text-white/40 italic">No historical user orders found mapped to your cluster pincodes.</p>
          <p className="text-[10px] text-white/20 font-mono">Database query connection responded with 0 matching rows.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-5xl">
          {orders.map((order) => (
            <div key={order.id} className="bg-white/[0.02] border border-white/5 p-5 rounded-xl space-y-3">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/5 pb-2">
                <div>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono font-bold">{order.id}</span>
                  <p className="text-[11px] text-white/50 mt-1">Customer: <span className="text-white font-bold">{order.customer || 'Unknown User'}</span> ({order.email || 'N/A'})</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-lime-accent">{order.total || '₹0'}</span>
                  <p className="text-[9px] uppercase tracking-wider text-white/40 font-mono">{order.timeline?.preparingDate || 'Pending'}</p>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-white/70">
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-white/30" /> <span className="font-medium">{order.address || 'No Address Logged'}</span></p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-white/30" /> <span className="font-mono">{order.phone || 'No Phone Mapped'}</span></p>
              </div>

              <div className="bg-black/20 p-3 rounded-lg space-y-2">
                <p className="text-[9px] uppercase tracking-widest font-black text-white/40">Items Checklist</p>
                {order.items && Array.isArray(order.items) && order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs font-mono">
                    <span className="text-white/80">■ {item?.name || 'Inventory Item Asset'}</span>
                    <span className="text-lime-accent">QTY: {item?.qty || 1}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                <span className="text-white/40">Status Pipeline:</span>
                <span className="px-2 py-1 rounded bg-lime-accent/10 text-lime-accent border border-lime-accent/20">{order.status || 'processing'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BranchOrders