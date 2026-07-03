import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { toast } from 'react-hot-toast'
import { Calendar, Package, MapPin, Phone, User, Mail, ArrowUpRight, X, Clock, Truck, CheckCircle2, Eye, RefreshCcw } from 'lucide-react'

const BranchOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [viewingItemsOrder, setViewingItemsOrder] = useState(null)
  const [viewingAddressOrder, setViewingAddressOrder] = useState(null)
  
  const [chosenStatus, setChosenStatus] = useState('')
  const [inputDate, setInputDate] = useState('')
  const token = localStorage.getItem("token")

  const fetchBranchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/api/auth/admin/orders", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        toast.error("Failed to load branch operational data.")
      }
    } catch (err) {
      console.error("Error reading branch order links:", err)
      toast.error("Network error fetching records.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBranchOrders()
  }, [token])

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Preparing':
      case 'Preparing for Dispatch': 
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
      case 'Dispatched':
      case 'Order Dispatched': 
        return 'bg-blue-400/10 text-blue-400 border-blue-400/20 hover:bg-blue-400/20'
      case 'Delivered':
      case 'Order Delivered': 
        return 'bg-lime-400/10 text-lime-400 border-lime-400/20 cursor-not-allowed'
      default: return 'bg-white/10 text-white/60 border-white/5'
    }
  }

  const formatInputDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const handleOpenTrackingPanel = (order) => {
    setSelectedOrder(order)
    setChosenStatus(order.status || 'Preparing for Dispatch')
    setInputDate('')
  }

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    if (!selectedOrder) return

    const transitionToastId = toast.loading("Updating branch logistics lifecycle...")
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
        toast.success(`Order status updated successfully`, { id: transitionToastId })
        setSelectedOrder(null)
      } else {
        toast.error("Failed to commit branch operational status changes.", { id: transitionToastId })
      }
    } catch (err) {
      console.error("Network communication error:", err)
      toast.error("Network processing fault caught during status update.", { id: transitionToastId })
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
      <div className="text-center text-xs font-mono tracking-widest text-lime-400 uppercase animate-pulse py-40">
        Loading assigned regional sector registries...
      </div>
    )
  }

  // Common Tailwind custom scrollbar design utility string
  const customScrollbarClasses = "scrollbar-none [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20"

  return (
    <div className="space-y-6 sm:space-y-10 text-white relative">
      
      {/* Dynamic Header Section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6 text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
            Assigned <span className="text-lime-400">Branch Order</span> Hub
          </h2>
          <p className="text-xs text-white/50 font-medium mt-1">
            Modify tracking stages and configure accurate delivery timestamps for local branch fulfillment.
          </p>
        </div>
        <button 
          onClick={fetchBranchOrders} 
          className="inline-flex items-center gap-2 self-start sm:self-center text-[10px] font-black uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCcw className="w-3 h-3" /> Refresh Branch Orders
        </button>
      </div>

      {/* Main Action Table Container */}
      <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 relative z-10 backdrop-blur-md text-left">
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-white">Customer Orders</h3>
          <p className="text-xs text-white/40 mt-0.5">
            Active regional deliveries filtered by branch cluster proximity codes.
          </p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-20 text-xs font-mono tracking-widest text-white/30 uppercase border border-dashed border-white/10 rounded-xl">
            No historical user orders found mapped to your cluster pincodes.
          </div>
        ) : (
          /* Added webkit scrollbar overrides here to clean up the bottom scroll view */
          <div className={`overflow-x-auto rounded-xl border border-white/5 pb-2 ${customScrollbarClasses}`}>
            <table className="w-full text-left border-collapse min-w-[950px] lg:min-w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-white/60">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Info</th>
                  <th className="p-4">Full Shipping Address</th>
                  <th className="p-4">Products Ordered</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4 text-center">Status Badge</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium text-white/80">
                {orders.map((order) => {
                  const normalizedItems = getNormalizedItems(order.items);
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 font-mono text-lime-400 font-bold whitespace-nowrap">{order.id}</td>
                      <td className="p-4 whitespace-nowrap space-y-0.5 text-xl">
                        <div className="font-bold text-white flex items-center gap-1">
                          <User className="w-3 h-3 text-white/40" /> {order.customer || 'Unknown User'}
                        </div>
                        <div className="text-[15px] text-white/40 font-mono flex items-center gap-1">
                          <Mail className="w-3 h-3 text-white/20" /> {order.email || '-'}
                        </div>
                        <div className="text-[15px] text-white/40 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-white/20" /> {order.phone || '-'}
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <button 
                          onClick={() => setViewingAddressOrder(order)}
                          className="inline-flex items-center gap-2 text-left group bg-white/5 border border-white/5 hover:border-white/10 px-3 py-2 rounded-xl transition-all cursor-pointer w-full max-w-[220px]"
                        >
                          <MapPin className="w-3.5 h-3.5 text-white/40 group-hover:text-lime-400 flex-shrink-0" />
                          <span className="text-[11px] leading-relaxed text-white/70 truncate flex-1 group-hover:text-white">
                            {order.address || 'No Address Mapped'}
                          </span>
                          <Eye className="w-3.5 h-3.5 text-white/20 group-hover:text-lime-400 flex-shrink-0 transition-colors" />
                        </button>
                      </td>
                      <td className="p-4">
                        {normalizedItems.length > 0 ? (
                          <button 
                            onClick={() => setViewingItemsOrder(order)}
                            className="inline-flex items-center gap-2 text-left group bg-white/5 border border-white/5 hover:border-white/10 px-3 py-2 rounded-xl transition-all cursor-pointer max-w-[200px]"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-white group-hover:text-lime-400 font-bold text-[11px] truncate uppercase tracking-wide">
                                {normalizedItems[0]?.name || "View Items"}
                              </p>
                              <p className="text-[10px] text-white/40 font-mono mt-0.5">
                                {normalizedItems.length > 1 ? `+ ${normalizedItems.length - 1} more items` : '1 Item listed'}
                              </p>
                            </div>
                            <Eye className="w-3.5 h-3.5 text-white/40 group-hover:text-lime-400 flex-shrink-0 transition-colors" />
                          </button>
                        ) : (
                          <span className="text-white/30 font-mono text-[11px]">No items listed</span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                        {order.total || `₹${order.totalPrice || 0}`}
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <span className={`inline-flex text-[9px] font-black uppercase tracking-wider border px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                          {order.status || 'processing'}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <button 
                          onClick={() => handleOpenTrackingPanel(order)} 
                          className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                        >
                          <span>Change Status</span>
                          <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PORTAL POPUP 1: BREAKDOWN MANIFEST MODAL */}
      {viewingItemsOrder && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#071640] border border-white/10 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative space-y-6 text-white">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-lime-400 font-mono">Manifest Basket Overview</span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white mt-0.5">Items in Order #{viewingItemsOrder.id}</h3>
              </div>
              <button 
                onClick={() => setViewingItemsOrder(null)} 
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Added dynamic scroll filter classes down here as well */}
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
                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-white/50">
                          <span>Quantity Requested: <strong className="text-lime-400 font-bold text-sm">{prod.qty || prod.quantity || 1}</strong></span>
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
              <span className="text-white/40 uppercase font-bold">Total Order Cost:</span>
              <span className="text-base text-white font-black">{viewingItemsOrder.total || `₹${viewingItemsOrder.totalPrice || 0}`}</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PORTAL POPUP 2: BIG CLEAR DELIVERY ADDRESS MODAL */}
      {viewingAddressOrder && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#071640] border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-5 text-white">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-lime-400 font-mono">Logistics Mapping Location</span>
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
                <MapPin className="w-5 h-5 text-lime-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">Full Shipping Destination</span>
                  <p className="text-sm font-medium text-white/90 leading-relaxed font-mono select-all">
                    {viewingAddressOrder.address || 'No destination address specified.'}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-white/5 pt-3 grid grid-cols-2 gap-4 font-mono text-[11px]">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block">Recipient Client</span>
                  <span className="text-white font-bold">{viewingAddressOrder.customer || 'Unknown Recipient'}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block">Contact Line</span>
                  <span className="text-lime-400 font-bold">{viewingAddressOrder.phone || 'None listed'}</span>
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

      {/* PORTAL POPUP 3: STATUS LOGISTICS CONFIGURATION CONTROL MODAL */}
      {selectedOrder && createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#071640] border border-white/10 w-full max-w-xl rounded-2xl p-6 shadow-2xl relative space-y-6 text-white">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-lime-400 font-mono">Logistics Control Pipeline</span>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white mt-0.5">Route Configuration for #{selectedOrder.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-6 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-white/40 block">Set Operational Status Matrix</label>
                <select 
                  value={chosenStatus} 
                  onChange={(e) => setChosenStatus(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-white/20 cursor-pointer"
                >
                  <option value="Preparing for Dispatch" className="bg-[#161616] text-white">Preparing for Dispatch</option>
                  <option value="Dispatched" className="bg-[#161616] text-white">Dispatched (In-Transit)</option>
                  <option value="Delivered" className="bg-[#161616] text-white">Delivered (Completed)</option>
                </select>
              </div>

              {(chosenStatus === 'Dispatched' || chosenStatus === 'Delivered') && (
                <div className="space-y-2 transition-all">
                  <label className="text-[10px] font-black uppercase tracking-wider text-white/40 block">
                    {chosenStatus === 'Dispatched' ? 'Select Expected Arrival Date' : 'Confirm Final Delivery Timestamp'}
                  </label>
                  <input 
                    type="date" 
                    required 
                    value={inputDate} 
                    onChange={(e) => setInputDate(e.target.value)} 
                    className="w-full max-w-xs bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-white/20 color-scheme-dark" 
                  />
                </div>
              )}

              <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-3 font-mono text-[11px]">
                <p className="font-black uppercase tracking-wider text-[9px] text-white/40">Current Saved Lifecycle Events</p>
                
                <div className="flex gap-3 items-center text-white/70">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preparing: <strong className="text-white font-normal ml-1">{selectedOrder.timeline?.preparingDate || 'Not Tracked'}</strong></span>
                </div>
                <div className="flex gap-3 items-center text-white/70">
                  <Truck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dispatched: <strong className="text-white font-normal ml-1">{selectedOrder.timeline?.dispatchedDate || 'Not Tracked'}</strong></span>
                </div>
                <div className="flex gap-3 items-center text-white/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Delivered: <strong className="text-white font-normal ml-1">{selectedOrder.timeline?.deliveredDate || 'Not Tracked'}</strong></span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/5">
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-lime-400 text-black hover:bg-lime-300 transition-colors shadow-md cursor-pointer"
                >
                  Save Changes & Update System
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

export default BranchOrders