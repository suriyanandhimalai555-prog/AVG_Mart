import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, CheckCircle2, Clock, Truck, User, Mail, Phone, MapPin, Package, X, ArrowRight, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'

const CustomerOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [viewingItemsOrder, setViewingItemsOrder] = useState(null)
  const [viewingAddressOrder, setViewingAddressOrder] = useState(null)
  
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

  const getNormalizedItems = (itemsData) => {
    if (Array.isArray(itemsData)) return itemsData
    if (typeof itemsData === 'string') {
      try {
        const parsed = JSON.parse(itemsData)
        return Array.isArray(parsed) ? parsed : [parsed]
      } catch (e) {
        return itemsData.split(',').map(i => ({ name: i.trim(), qty: 1 }))
      }
    }
    return []
  }

  if (isLoading) {
    return (
      <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-40 bg-royal-dark min-h-screen flex items-center justify-center">
        Loading Admin Order Registries...
      </div>
    )
  }

  // Common Tailwind custom scrollbar design utility class string
  const customScrollbarClasses = "scrollbar-none [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-royal-dark min-h-screen text-white relative">
      <div className="relative z-10 text-left border-b border-white/5 pb-6">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white"><span className='text-lime-400'>Customer</span> Orders</h2>
        <p className="text-xs text-gray-400 mt-1">Modify logistics tracking pipelines and manage global shipping logs maps.</p>
      </div>

      <div className="bg-royal-main/20 border border-white/5 rounded-2xl p-4 sm:p-6 shadow-2xl relative z-10 backdrop-blur-md text-left">
        {/* Horizontal table element styling with sleek WebKit override configurations */}
        <div className={`overflow-x-auto rounded-xl border border-white/5 bg-royal-dark/40 pb-2 ${customScrollbarClasses}`}>
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/10 bg-royal-dark text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="p-4 w-28">Order ID</th>
                <th className="p-4 w-56">Customer Info</th>
                <th className="p-4 min-w-[240px]">Full Shipping Address</th>
                <th className="p-4 min-w-[240px]">Products Ordered</th>
                <th className="p-4 w-28">Total Price</th>
                <th className="p-4 w-32 text-center">Status</th>
                <th className="p-4 w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-200">
              {orders.map((order) => {
                const normalizedItems = getNormalizedItems(order.items);
                return (
                  <tr key={order.id} className="hover:bg-royal-main/30 transition-colors">
                    <td className="p-4 font-mono text-lime-accent font-bold whitespace-nowrap text-left">{order.id}</td>
                    <td className="p-4 space-y-1 text-left">
                      <div className="font-bold text-white flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-gray-400" /> {order.customer}</div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-500" /> {order.email}</div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-500" /> {order.phone}</div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => setViewingAddressOrder(order)}
                        className="inline-flex items-center gap-2 text-left group bg-white/5 border border-white/5 hover:border-white/10 px-3 py-2 rounded-xl transition-all cursor-pointer w-full max-w-[220px]"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-[11px] leading-relaxed text-gray-300 truncate flex-1 group-hover:text-white">
                          {order.address || 'No Address Mapped'}
                        </span>
                        <Eye className="w-3.5 h-3.5 text-white/20 group-hover:text-emerald-400 flex-shrink-0 transition-colors" />
                      </button>
                    </td>
                    <td className="p-4">
                      {normalizedItems.length > 0 ? (
                        <button 
                          onClick={() => setViewingItemsOrder(order)}
                          className="inline-flex items-center gap-2 text-left group bg-white/5 border border-white/5 hover:border-white/10 px-3 py-2 rounded-xl transition-all cursor-pointer max-w-[200px]"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-white group-hover:text-emerald-400 font-bold text-[11px] truncate uppercase tracking-wide">
                              {normalizedItems[0]?.name || "View Items"}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                              {normalizedItems.length > 1 ? `+ ${normalizedItems.length - 1} more items` : '1 Item listed'}
                            </p>
                          </div>
                          <Eye className="w-3.5 h-3.5 text-white/40 group-hover:text-emerald-400 flex-shrink-0 transition-colors" />
                        </button>
                      ) : (
                        <span className="text-gray-500 font-mono text-[11px]">No items listed</span>
                      )}
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
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PORTAL POPUP 1: CLEAN VIEW PRODUCTS MANIFEST BREAKDOWN */}
      {viewingItemsOrder && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-royal-dark border border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative space-y-6 text-white">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Manifest Basket Overview</span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white mt-0.5">Items in Order #{viewingItemsOrder.id}</h3>
              </div>
              <button 
                onClick={() => setViewingItemsOrder(null)} 
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`space-y-4 max-h-[60vh] overflow-y-auto pr-1 ${customScrollbarClasses}`}>
              {getNormalizedItems(viewingItemsOrder.items).map((prod, index) => {
                const sizeString = String(prod.selected_size || prod.size || '').trim();
                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01] text-left">
                    <div className="flex items-start gap-4">
                      {prod.image ? (
                        <div className="w-16 h-20 rounded-xl bg-black/40 overflow-hidden border border-white/10 flex-shrink-0">
                          <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 flex-shrink-0">
                          <Package className="w-6 h-6 text-white/20" />
                        </div>
                      )}
                      <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-wide text-white leading-snug">
                          {prod.name || prod.product_name || "Unknown Item"}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-400">
                          <span>Quantity Requested: <strong className="text-emerald-400 font-bold text-sm">{prod.qty || prod.quantity || 1}</strong></span>
                          {sizeString && (
                            <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 text-white font-black rounded uppercase">
                              Size: {sizeString}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between font-mono text-xs">
              <span className="text-gray-400 uppercase font-bold">Total Order Cost:</span>
              <span className="text-base text-white font-black">{viewingItemsOrder.total || `₹${viewingItemsOrder.totalPrice || 0}`}</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PORTAL POPUP 2: BIG CLEAR SHIPPING ADDRESS POPUP */}
      {viewingAddressOrder && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-royal-dark border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-5 text-white">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Logistics Mapping Location</span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white mt-0.5">Delivery Address</h3>
              </div>
              <button 
                onClick={() => setViewingAddressOrder(null)} 
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] text-left space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block">Full Shipping Destination</span>
                  <p className="text-sm font-medium text-gray-200 leading-relaxed font-mono select-all">
                    {viewingAddressOrder.address || 'No destination address specified.'}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-3 grid grid-cols-2 gap-4 font-mono text-[11px]">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Recipient Client</span>
                  <span className="text-white font-bold">{viewingAddressOrder.customer || 'Unknown Recipient'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 block">Contact Line</span>
                  <span className="text-emerald-400 font-bold">{viewingAddressOrder.phone || 'None listed'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setViewingAddressOrder(null)}
                className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
              >
                Dismiss View
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PORTAL POPUP 3: LOGISTICS CONFIGURATION MATRIX STATUS UPDATER */}
      {selectedOrder && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-royal-dark border border-white/10 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative space-y-6 text-white">
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
                    className="w-full max-w-xs bg-royal-main/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 color-scheme-dark" 
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
                    className="w-full max-w-xs bg-royal-main/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 color-scheme-dark" 
                  />
                </div>
              )}

              <div className="p-4 bg-royal-main/10 border border-white/5 rounded-2xl space-y-4 font-mono">
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
        </div>,
        document.body
      )}
    </div>
  )
}

export default CustomerOrders