import React, { useState, useEffect } from 'react'
import { Calendar, CheckCircle2, Clock, Truck, User, Mail, Phone, MapPin, Package, X, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast' // <-- Imported toast framework engine

const CustomerOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  const [chosenStatus, setChosenStatus] = useState('')
  const [inputDate, setInputDate] = useState('')
  const token = localStorage.getItem("token")

  const fetchAllOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/auth/admin/orders", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        toast.error("Failed to synchronize customer orders ledger.")
      }
    } catch (err) {
      console.error("Failed contacting admin backend pipeline:", err)
      toast.error("Network error. Could not query administrative records.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [])

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Preparing for Dispatch':
      case 'Preparing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'Dispatched': return 'bg-blue-400/10 text-blue-400 border-blue-400/20'
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      default: return 'bg-white/10 text-gray-400 border-white/5'
    }
  }

  const formatInputDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const handleOpenTrackingPanel = (order) => {
    setSelectedOrder(order)
    setChosenStatus(order.status)
    setInputDate('')
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    if (!selectedOrder) return

    // Initialize async action notification layer
    const transitionToastId = toast.loading("Updating logistics timeline matrix...")

    const currentTimestamp = new Date().toLocaleString('en-GB') 
    let payload = { status: chosenStatus }

    if (chosenStatus === 'Dispatched') {
      payload.dispatchedDate = currentTimestamp
      if (inputDate) {
        payload.expectedDelivery = formatInputDate(inputDate)
      }
    } else if (chosenStatus === 'Delivered') {
      payload.deliveredDate = inputDate ? formatInputDate(inputDate) : currentTimestamp
    } else if (chosenStatus === 'Preparing for Dispatch' || chosenStatus === 'Preparing') {
      payload.preparingDate = selectedOrder.timeline?.preparingDate || currentTimestamp
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/admin/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const updatedOrders = orders.map((ord) => {
          if (ord.id === selectedOrder.id) {
            const revised = { 
              ...ord, 
              status: chosenStatus, 
              timeline: { 
                ...ord.timeline, 
                preparingDate: payload.preparingDate || ord.timeline?.preparingDate,
                dispatchedDate: payload.dispatchedDate || ord.timeline?.dispatchedDate,
                deliveredDate: payload.deliveredDate || ord.timeline?.deliveredDate,
                expectedDelivery: payload.expectedDelivery || ord.timeline?.expectedDelivery
              } 
            }
            setSelectedOrder(revised) 
            return revised
          }
          return ord
        })
        setOrders(updatedOrders)
        
        // Success state resolution
        toast.success(`Order ${selectedOrder.id} updated to: ${chosenStatus}`, { id: transitionToastId })
        setSelectedOrder(null)
      } else {
        toast.error("Failed to commit operational status changes to backend engine.", { id: transitionToastId })
      }
    } catch (err) {
      console.error("Network communication error:", err)
      toast.error("Network processing fault caught during status update execution pipeline.", { id: transitionToastId })
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
        // Fallback for simple comma-separated or plain text values from backend
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
        Loading Admin Order Registries...
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-royal-dark min-h-screen text-white">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-left">Customer Orders Dashboard</h2>
        <p className="text-xs text-gray-400 mt-1 text-left">Modify and set custom delivery dates here.</p>
      </div>

      <div className="bg-royal-main/20 border border-white/5 rounded-2xl p-4 sm:p-6 shadow-2xl">
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
                <th className="p-4 w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-royal-main/30 transition-colors">
                  <td className="p-4 font-mono text-lime-accent font-bold whitespace-nowrap text-left">{order.id}</td>
                  <td className="p-4 space-y-1 text-left">
                    <div className="font-bold text-white flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" /> {order.customer}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-500" /> {order.email}</div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-500" /> {order.phone}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-300 whitespace-normal leading-relaxed text-left">
                    <div className="flex items-start gap-2 max-w-md"><MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /><span>{order.address}</span></div>
                  </td>
                  <td className="p-4 text-left">
                    {renderItemsColumn(order.items)}
                  </td>
                  <td className="p-4 font-bold text-white whitespace-nowrap text-left">{order.total || `₹${order.totalPrice}`}</td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider border px-3 py-1 rounded-full ${getStatusBadgeStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <button onClick={() => handleOpenTrackingPanel(order)} className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer">
                      <span>Change Status</span><ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Order Modification System</span>
                <h3 className="text-base font-bold uppercase tracking-wider text-white">Update Status for {selectedOrder.id}</h3>
              </div>
              <button onClick={() => { setSelectedOrder(null); }} className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-6 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Set Log Status Matrix</label>
                <select 
                  value={chosenStatus} 
                  onChange={(e) => setChosenStatus(e.target.value)}
                  className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="Preparing for Dispatch" className="bg-royal-dark text-white">Preparing for Dispatch</option>
                  <option value="Dispatched" className="bg-royal-dark text-white">Dispatched (In-Transit)</option>
                  <option value="Delivered" className="bg-royal-dark text-white">Delivered (Completed)</option>
                </select>
              </div>

              {chosenStatus === 'Dispatched' && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Select Expected Arrival Date</label>
                  <input 
                    type="date" 
                    required 
                    value={inputDate} 
                    onChange={(e) => setInputDate(e.target.value)} 
                    className="w-full max-w-xs bg-royal-main/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400" 
                  />
                </div>
              )}

              {chosenStatus === 'Delivered' && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Select Final Order Delivery Date</label>
                  <input 
                    type="date" 
                    required 
                    value={inputDate} 
                    onChange={(e) => setInputDate(e.target.value)} 
                    className="w-full max-w-xs bg-royal-main/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400" 
                  />
                </div>
              )}

              <div className="p-4 bg-royal-main/10 border border-white/5 rounded-2xl space-y-4">
                <p className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Current Saved Tracking Log Dates</p>
                <div className="flex gap-4 items-center text-xs text-gray-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Preparing: <strong>{selectedOrder.timeline?.preparingDate || 'Not Tracked'}</strong></span>
                </div>
                <div className="flex gap-4 items-center text-xs text-gray-300">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Dispatched: <strong>{selectedOrder.timeline?.dispatchedDate || 'Not Tracked'}</strong></span>
                </div>
                <div className="flex gap-4 items-center text-xs text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Delivered: <strong>{selectedOrder.timeline?.deliveredDate || 'Not Tracked'}</strong></span>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-white/10">
                <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-md cursor-pointer">
                  Save Changes & Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerOrders