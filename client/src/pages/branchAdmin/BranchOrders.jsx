import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Calendar, Package, MapPin, Phone, User, Mail, ArrowRight } from 'lucide-react'

const BranchOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchBranchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("http://localhost:5000/api/auth/admin/orders", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (response.ok) {
          const data = await response.json()
          console.log("DEBUG RESPONSE PAYLOAD FROM SERVER:", data)
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

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Preparing for Dispatch':
      case 'Preparing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'Dispatched': return 'bg-blue-400/10 text-blue-400 border-blue-400/20'
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      default: return 'bg-white/10 text-gray-400 border-white/5'
    }
  }

  // Pure isolated rendering logic to parse strings, objects, or arrays into structured matrices cleanly
  const renderItemsColumn = (itemsData) => {
    let normalizedArray = [];

    if (Array.isArray(itemsData)) {
      normalizedArray = itemsData;
    } else if (typeof itemsData === 'string') {
      try {
        const parsed = JSON.parse(itemsData);
        normalizedArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        const inlineItems = itemsData.split(',').map(i => i.trim()).filter(Boolean);
        return (
          <div className="space-y-1.5 min-w-[200px]">
            {inlineItems.map((strItem, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white/[0.02] border border-white/5 p-2 rounded-xl text-left">
                <Package className="w-3.5 h-3.5 text-lime-accent flex-shrink-0" />
                <span className="font-mono text-xs text-gray-300 uppercase tracking-wide truncate">{strItem}</span>
              </div>
            ))}
          </div>
        )
      }
    }

    if (normalizedArray && normalizedArray.length > 0) {
      return (
        <div className="space-y-2 min-w-[240px]">
          {normalizedArray.map((prod, index) => {
            if (!prod || typeof prod !== 'object') return null;
            
            const rawSize = prod.selected_size || prod.size || '';
            const sizeString = typeof rawSize === 'string' ? rawSize.trim() : String(rawSize);

            return (
              <div key={index} className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 p-2 rounded-xl text-left">
                {prod.image && (
                  <div className="w-10 h-12 rounded-lg bg-black/40 overflow-hidden border border-white/10 flex-shrink-0">
                    <img src={prod.image} alt={prod.name || "product"} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-xs truncate uppercase tracking-wide">{prod.name || prod.product_name || "Unknown Item"}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400 font-mono">Qty: {prod.qty || prod.quantity || 1}</span>
                    {sizeString !== '' ? (
                      <span className="text-[9px] px-1.5 py-0.5 bg-lime-accent/10 border border-lime-accent/20 text-lime-accent rounded font-mono font-black uppercase">
                        Sz: {sizeString}
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 bg-white/5 text-gray-500 rounded font-mono border border-white/5">
                        N/A
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return <span className="text-gray-500 font-mono text-[11px]">No items found</span>
  }

  if (isLoading) {
    return (
      <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-40 bg-royal-dark min-h-screen flex items-center justify-center">
        Loading localized sector orders...
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-6 lg:p-10 space-y-8 bg-royal-dark min-h-screen text-white rounded-2xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-left text-white">
          Assigned Branch Order Hub
        </h2>
        <p className="text-xs text-gray-400 mt-1 text-left">
          Monitoring regional order fulfillments and logistical workflows.
        </p>
      </div>

      <div className="bg-royal-main/20 border border-white/5 rounded-2xl p-4 sm:p-6 shadow-2xl">
        {!orders || orders.length === 0 ? (
          <div className="border border-white/5 bg-royal-dark/40 rounded-xl p-12 text-center space-y-2">
            <p className="text-xs text-gray-400 italic">No historical user orders found mapped to your cluster pincodes.</p>
            <p className="text-[10px] text-gray-600 font-mono">Database query connection responded with 0 matching rows.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-royal-dark/40">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/10 bg-royal-dark text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="p-4 w-28">Order ID</th>
                  <th className="p-4 w-56">Customer Info</th>
                  <th className="p-4 min-w-[320px]">Full Shipping Address</th>
                  <th className="p-4 min-w-[260px]">Configured Items & Size Matrix</th>
                  <th className="p-4 w-28">Total Price</th>
                  <th className="p-4 w-32 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-royal-main/30 transition-colors">
                    <td className="p-4 font-mono text-lime-accent font-bold whitespace-nowrap text-left">
                      {order.id}
                    </td>
                    <td className="p-4 space-y-1 text-left">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" /> {order.customer || 'Unknown User'}
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-500" /> {order.email || 'N/A'}
                      </div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-500" /> {order.phone || 'No Phone Mapped'}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-300 whitespace-normal leading-relaxed text-left">
                      <div className="flex items-start gap-2 max-w-md">
                        <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{order.address || 'No Address Logged'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-left">
                      {renderItemsColumn(order.items)}
                    </td>
                    <td className="p-4 font-bold text-white whitespace-nowrap text-left">
                      {order.total || `₹${order.totalPrice || 0}`}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`inline-block text-[10px] font-bold uppercase tracking-wider border px-3 py-1 rounded-full ${getStatusBadgeStyle(order.status)}`}>
                        {order.status || 'processing'}
                      </span>
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

export default BranchOrders