import React, { useState } from 'react'
import { Calendar, CheckCircle2, Clock, Truck, User, Mail, Phone, MapPin, Package, X, ArrowRight } from 'lucide-react'

const CustomerOrders = () => {
  // Sample orders list with customer information and tracking dates
  const [orders, setOrders] = useState([
    {
      id: "ORD-9831",
      customer: "Rohan Sharma",
      email: "rohan.sharma@email.com",
      phone: "+91 98765 43210",
      address: "Flat 402, Sunset Heights, HSR Layout, Bengaluru, Karnataka - 560102",
      date: "2026-06-22",
      items: "2x Black T-Shirt",
      total: "₹1,499",
      status: "Preparing",
      timeline: {
        preparingDate: "22/06/2026, 16:11:29",
        dispatchedDate: null,
        deliveredDate: null,
        expectedDelivery: "27/06/2026"
      }
    },
    {
      id: "ORD-9830",
      customer: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+91 91234 56789",
      address: "House No. 12, Sector 15, Vasundhara, Ghaziabad, Uttar Pradesh - 201012",
      date: "2026-06-22",
      items: "1x Smart Sport Watch",
      total: "₹4,299",
      status: "Dispatched",
      timeline: {
        preparingDate: "21/06/2026, 09:30:15",
        dispatchedDate: "22/06/2026, 14:20:00",
        deliveredDate: null,
        expectedDelivery: "25/06/2026"
      }
    }
  ])

  // State to check which order is open in the popup tracker
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  // State for the calendar input field
  const [inputDate, setInputDate] = useState('')

  // Returns the style color for status tags
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Preparing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'Dispatched': return 'bg-blue-400/10 text-blue-400 border-blue-400/20'
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      default: return 'bg-white/10 text-gray-400 border-white/5'
    }
  }

  // Changes date from YYYY-MM-DD format to DD/MM/YYYY format
  const formatInputDate = (dateStr) => {
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  // Moves the tracking status to the next step
  const handleStatusUpdate = (e) => {
    e.preventDefault()
    if (!selectedOrder) return

    const currentTimestamp = new Date().toLocaleString('en-GB') 
    let nextStatus = selectedOrder.status
    let updatedTimeline = { ...selectedOrder.timeline }

    if (selectedOrder.status === 'Preparing') {
      nextStatus = 'Dispatched'
      updatedTimeline.dispatchedDate = currentTimestamp
      if (inputDate) {
        updatedTimeline.expectedDelivery = formatInputDate(inputDate)
      }
    } else if (selectedOrder.status === 'Dispatched') {
      nextStatus = 'Delivered'
      updatedTimeline.deliveredDate = currentTimestamp
    }

    // Save changes back to the list
    const updatedOrders = orders.map((ord) => {
      if (ord.id === selectedOrder.id) {
        const revised = { ...ord, status: nextStatus, timeline: updatedTimeline }
        setSelectedOrder(revised) 
        return revised
      }
      return ord
    })

    setOrders(updatedOrders)
    setInputDate('')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-royal-dark/20 min-h-screen text-white">
      
      {/* HEADER SECTION */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider">Customer Orders</h2>
        <p className="text-xs text-gray-400 mt-1">View incoming orders, look up customer addresses, and track delivery progress.</p>
      </div>

      {/* ORDERS TABLE CONTAINER */}
      <div className="bg-royal-main/20 border border-white/5 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-royal-dark/40">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-white/10 bg-royal-dark text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="p-4 w-28">Order ID</th>
                <th className="p-4 w-56">Customer Info</th>
                <th className="p-4 min-w-[320px]">Full Shipping Address</th>
                <th className="p-4 w-48">Items Ordered</th>
                <th className="p-4 w-28">Total Price</th>
                <th className="p-4 w-32 text-center">Status</th>
                <th className="p-4 w-24 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-royal-main/30 transition-colors">
                  
                  {/* Order ID */}
                  <td className="p-4 font-mono text-lime-accent font-bold whitespace-nowrap">
                    {order.id}
                  </td>
                  
                  {/* Customer Info */}
                  <td className="p-4 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" /> {order.customer}
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-500" /> {order.email}
                    </div>
                    <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-500" /> {order.phone}
                    </div>
                  </td>
                  
                  {/* Shipping Address (Shown Big and Full) */}
                  <td className="p-4 text-sm font-medium text-gray-300 whitespace-normal leading-relaxed">
                    <div className="flex items-start gap-2 max-w-md">
                      <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{order.address}</span>
                    </div>
                  </td>
                  
                  {/* Items Ordered */}
                  <td className="p-4 text-gray-300 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-gray-400" /> {order.items}
                    </div>
                  </td>
                  
                  {/* Total Price */}
                  <td className="p-4 font-bold text-white whitespace-nowrap">
                    {order.total}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="p-4 text-center whitespace-nowrap">
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider border px-3 py-1 rounded-full ${getStatusBadgeStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  {/* Tracking Button */}
                  <td className="p-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                    >
                      <span>Track</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ORDER LOGISTICS POPUP PANEL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative space-y-6">
            
            {/* Popup Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">Order Tracking Panel</span>
                <h3 className="text-base font-bold uppercase tracking-wider text-white">Log Details for {selectedOrder.id}</h3>
              </div>
              <button 
                onClick={() => { setSelectedOrder(null); setInputDate(''); }}
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Box Details inside the Popup */}
            <div className="bg-royal-main/20 border border-white/5 rounded-2xl p-4 text-xs space-y-2">
              <p className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Shipping Details</p>
              <p className="text-white font-bold text-sm">{selectedOrder.customer}</p>
              <p className="text-gray-300 text-sm font-medium leading-relaxed mt-1 bg-black/20 p-2.5 rounded-xl border border-white/5">
                {selectedOrder.address}
              </p>
            </div>

            {/* --- VERTICAL TRACKING TIMELINE BAR --- */}
            <div className="p-4 bg-royal-main/10 border border-white/5 rounded-2xl space-y-6">
              
              {/* Step 1: Preparing for Dispatch */}
              <div className="flex gap-4 items-start relative">
                <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-white/10" />
                
                <div className={`p-3 rounded-full z-10 ${
                  selectedOrder.status === 'Preparing' || selectedOrder.status === 'Dispatched' || selectedOrder.status === 'Delivered'
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/10 text-gray-500'
                }`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 pt-1">
                  <h4 className={`text-sm font-bold ${selectedOrder.status === 'Preparing' ? 'text-emerald-400' : 'text-white'}`}>Preparing for Dispatch</h4>
                  <p className="text-xs text-gray-400 font-medium">{selectedOrder.timeline.preparingDate || 'Pending'}</p>
                </div>
              </div>

              {/* Step 2: Order Dispatched */}
              <div className="flex gap-4 items-start relative">
                <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-white/10" />
                
                <div className={`p-3 rounded-full z-10 ${
                  selectedOrder.status === 'Dispatched' || selectedOrder.status === 'Delivered'
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/10 text-gray-500'
                }`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 pt-1">
                  <h4 className={`text-sm font-bold ${selectedOrder.status === 'Dispatched' ? 'text-emerald-400' : 'text-white'}`}>Order Dispatched</h4>
                  <p className="text-xs text-gray-400 font-medium">{selectedOrder.timeline.dispatchedDate || 'Pending'}</p>
                </div>
              </div>

              {/* Step 3: Order Delivered */}
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-full z-10 ${
                  selectedOrder.status === 'Delivered'
                    ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-white/10 text-gray-500'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1 pt-1 flex-1">
                  <h4 className={`text-sm font-bold ${selectedOrder.status === 'Delivered' ? 'text-emerald-400' : 'text-white'}`}>Order Delivered</h4>
                  <p className="text-xs text-gray-400 font-medium">{selectedOrder.timeline.deliveredDate || 'Pending'}</p>
                  {selectedOrder.status !== 'Delivered' && (
                    <p className="text-xs text-gray-400 font-normal pt-1">
                      Expected Delivery Date: <strong className="text-white font-mono">{selectedOrder.timeline.expectedDelivery}</strong>
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* --- ACTION FORMS --- */}
            {selectedOrder.status !== 'Delivered' && (
              <form onSubmit={handleStatusUpdate} className="border-t border-white/10 pt-5 space-y-4">
                
                {/* Date Input shows up only when current status is Preparing */}
                {selectedOrder.status === 'Preparing' && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Select Delivery Date</label>
                    <div className="relative max-w-xs flex items-center">
                      <input 
                        type="date"
                        required
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-400 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-md cursor-pointer"
                  >
                    {selectedOrder.status === 'Preparing' ? 'Mark as Dispatched' : 'Mark as Delivered'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default CustomerOrders