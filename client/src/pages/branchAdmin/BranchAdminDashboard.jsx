import React, { useState, useEffect } from 'react'
import { ShoppingCart, DollarSign, Clock, Truck, CheckCircle2, ArrowUpRight, RefreshCw } from 'lucide-react'

const BranchAdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [branchName, setBranchName] = useState("Branch")
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem("token")

  // --- DATE FORMATTING UTILITY ---
  const formatOrderDate = (rawDateString) => {
    if (!rawDateString) return "Recent Order"
    try {
      const dateObj = new Date(rawDateString)
      if (isNaN(dateObj.getTime())) return rawDateString

      return dateObj.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch (e) {
      return rawDateString
    }
  }

  // --- FETCH DATA ---
  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // 1. Fetch Branch Profile for Title Display
      const profileRes = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/admin/branch`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        const dataObj = Array.isArray(profileData) ? profileData[0] : profileData
        if (dataObj?.branch) {
          setBranchName(dataObj.branch)
        }
      }

      // 2. Fetch Assigned Branch Orders
      const ordersRes = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/admin/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }
    } catch (err) {
      console.error("Error updating dashboard data registers:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [token])

  // --- UPDATE ORDER STATUS ---
  const handleUpdateStatus = async (id, currentStatus) => {
    let nextStatus = "Preparing"
    if (currentStatus === "Preparing" || currentStatus === "Preparing for Dispatch") nextStatus = "Dispatched"
    else if (currentStatus === "Dispatched" || currentStatus === "Order Dispatched") nextStatus = "Delivered"
    else return 

    try {
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      })
      
      if (res.ok) {
        setOrders(prev => prev.map(order => order.id === id ? { ...order, status: nextStatus } : order))
      }
    } catch (err) {
      console.error("Error updating order status:", err)
    }
  }

  // --- ANALYTICS COMPILATION ---
  const branchOrdersCount = orders.length
  
  // FIXED: Keeps the decimal point safely intact so ₹450.00 is calculated as 450 and not 45000
  const branchRevenueSum = orders.reduce((acc, curr) => {
    const rawPrice = curr.total || curr.total_price || 0
    const sanitizedPrice = Number(String(rawPrice).replace(/[^0-9.]/g, ''))
    return acc + (isNaN(sanitizedPrice) ? 0 : sanitizedPrice)
  }, 0)
  
  const preparingCount = orders.filter(o => o.status === "Preparing" || o.status === "Preparing for Dispatch").length
  const dispatchedCount = orders.filter(o => o.status === "Dispatched" || o.status === "Order Dispatched").length
  const deliveredCount = orders.filter(o => o.status === "Delivered" || o.status === "Order Delivered").length

  const stats = [
    { title: "Total Orders", value: branchOrdersCount.toLocaleString('en-IN'), icon: <ShoppingCart className="w-5 h-5" />, color: "border-white/20 text-white bg-white/5" },
    { title: "Total Revenue", value: `₹${branchRevenueSum.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <DollarSign className="w-5 h-5" />, color: "border-lime-400/20 text-lime-400 bg-lime-400/5" },
    { title: "Preparing", value: preparingCount, icon: <Clock className="w-5 h-5" />, color: "border-amber-500/20 text-amber-400 bg-amber-500/5" },
    { title: "Out For Delivery", value: dispatchedCount, icon: <Truck className="w-5 h-5" />, color: "border-blue-400/20 text-blue-400 bg-blue-400/5" },
    { title: "Delivered", value: deliveredCount, icon: <CheckCircle2 className="w-5 h-5" />, color: "border-lime-400/20 text-lime-400 bg-lime-400/5" },
  ]

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

  const renderProductBreakdown = (itemsArray) => {
    if (Array.isArray(itemsArray) && itemsArray.length > 0) {
      return (
        <div className="flex flex-col gap-1 max-w-xs text-left">
          {itemsArray.map((prod, idx) => (
            <div key={idx} className="text-white/70 truncate text-[11px] font-mono">
              {prod.qty || prod.quantity || 1}x {prod.name || "Unknown Product"}
            </div>
          ))}
        </div>
      )
    }
    return <span className="text-white/30">No items listed</span>
  }

  return (
    <div className="space-y-6 sm:space-y-10 text-white relative">
      
      {/* Dynamic Header Section */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6 text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
            <span className="text-lime-400">{branchName}</span> Branch Dashboard
          </h2>
          <p className="text-xs text-white/50 font-medium mt-1">
            Track daily branch sales, local deliveries, and orders sorted by your branch pincodes.
          </p>
        </div>
        <button 
          onClick={fetchDashboardData} 
          className="inline-flex items-center gap-2 self-start sm:self-center text-[10px] font-black uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Refresh Dashboard
        </button>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10 text-left">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 backdrop-blur-md shadow-xl hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/40 truncate">{stat.title}</span>
              <div className={`p-2 rounded-xl border flex-shrink-0 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 relative z-10 backdrop-blur-md text-left">
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-white">Incoming Branch Orders</h3>
          <p className="text-xs text-white/40 mt-0.5">
            Orders arriving from locations inside your assigned pincodes. Click the status badge to update delivery stages.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-xs font-mono tracking-widest text-lime-400 uppercase animate-pulse py-20">
            Loading dashboard analytics...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-xs font-mono tracking-widest text-white/30 uppercase border border-dashed border-white/10 rounded-xl">
            No active orders found for this branch's pincodes
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse min-w-[900px] lg:min-w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-white/60">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Date Ordered</th>
                  <th className="p-4">Items Ordered</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4 text-center">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium text-white/80">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-mono text-lime-400 font-bold whitespace-nowrap">{order.id}</td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-white">{order.customer || "Customer"}</div>
                      <div className="text-[10px] text-white/40 font-mono">{order.phone || "-"}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-white/70 line-clamp-2 text-[11px] leading-relaxed">
                        {order.address || "No address provided"}
                      </p>
                    </td>
                    <td className="p-4 text-white/50 whitespace-nowrap font-mono">
                      {formatOrderDate(order.created_at)}
                    </td>
                    <td className="p-4">
                      {renderProductBreakdown(order.items)}
                    </td>
                    <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                      {order.total}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <button 
                        onClick={() => handleUpdateStatus(order.id, order.status)}
                        disabled={order.status === "Delivered" || order.status === "Order Delivered"}
                        className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider border px-3 py-1.5 rounded-full transition-all cursor-pointer ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                        {order.status !== "Delivered" && order.status !== "Order Delivered" && <ArrowUpRight className="w-2.5 h-2.5 opacity-60" />}
                      </button>
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

export default BranchAdminDashboard;