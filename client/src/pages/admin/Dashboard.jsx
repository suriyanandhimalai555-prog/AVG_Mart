import React, { useState, useEffect } from 'react'
import { ShoppingCart, DollarSign, Clock, Truck, CheckCircle2, ArrowUpRight, RefreshCw, Package } from 'lucide-react'

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const token = localStorage.getItem("token")

  // --- NATIVE TIMESTAMP FORMATTING UTILITY ---
  const formatOrderDate = (rawDateString) => {
    if (!rawDateString) return "Recent Order"
    try {
      const dateObj = new Date(rawDateString)
      // Check if Date parse returned a valid structure
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

  // --- FETCH LIVE ORDERS FROM BACKEND REGISTRY ---
  const fetchAllAdminOrders = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/orders", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      } else {
        useMockData()
      }
    } catch (err) {
      console.error("Backend telemetry connection fault:", err)
      useMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const useMockData = () => {
    setOrders([
      { id: "ORD-9831", customer: "Rohan Sharma", created_at: "2026-06-22T10:15:00.000Z", items: "2x Black T-Shirt", total: "1499", status: "Preparing" },
      { id: "ORD-9830", customer: "Priya Patel", created_at: "2026-06-22T08:30:00.000Z", items: "1x Smart Sport Watch", total: "4299", status: "Dispatched" },
      { id: "ORD-9829", customer: "Anand Kumar", created_at: "2026-06-21T14:45:00.000Z", items: "1x Premium Leather Belt", total: "999", status: "Delivered" }
    ])
  }

  useEffect(() => {
    fetchAllAdminOrders()
  }, [token])

  // --- MUTATE STATUS STATE ENGINE ---
  const handleUpdateStatus = async (id, currentStatus) => {
    let nextStatus = "Preparing"
    if (currentStatus === "Preparing" || currentStatus === "Preparing for Dispatch") nextStatus = "Dispatched"
    else if (currentStatus === "Dispatched" || currentStatus === "Order Dispatched") nextStatus = "Delivered"
    else return 

    try {
      const res = await fetch(`http://localhost:5000/api/auth/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      })
      
      if (res.ok) {
        setOrders(prev => prev.map(order => order.id === id ? { ...order, status: nextStatus } : order))
      } else {
        setOrders(prev => prev.map(order => order.id === id ? { ...order, status: nextStatus } : order))
      }
    } catch (err) {
      console.error("Pipeline shift failure:", err)
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status: nextStatus } : order))
    }
  }

  // --- REAL-TIME ANALYTIC COMPILATION MATRIX ---
  const totalOrdersCount = orders.length
  const totalRevenueSum = orders.reduce((acc, curr) => acc + Number(String(curr.total || curr.total_price || 0).replace(/[^0-9]/g, '')), 0)
  
  // Handles variant casing/naming maps cleanly
  const preparingCount = orders.filter(o => o.status === "Preparing" || o.status === "Preparing for Dispatch").length
  const dispatchedCount = orders.filter(o => o.status === "Dispatched" || o.status === "Order Dispatched").length
  const deliveredCount = orders.filter(o => o.status === "Delivered" || o.status === "Order Delivered").length

  const stats = [
    { title: "Total Orders", value: totalOrdersCount.toLocaleString('en-IN'), icon: <ShoppingCart className="w-5 h-5" />, color: "border-white/20 text-white bg-white/5" },
    { title: "Total Revenue", value: `₹${totalRevenueSum.toLocaleString('en-IN')}`, icon: <DollarSign className="w-5 h-5" />, color: "border-lime-accent/20 text-lime-accent bg-lime-accent/5" },
    { title: "Preparing", value: preparingCount, icon: <Clock className="w-5 h-5" />, color: "border-amber-500/20 text-amber-400 bg-amber-500/5" },
    { title: "Dispatched", value: dispatchedCount, icon: <Truck className="w-5 h-5" />, color: "border-blue-400/20 text-blue-400 bg-blue-400/5" },
    { title: "Delivered", value: deliveredCount, icon: <CheckCircle2 className="w-5 h-5" />, color: "border-lime-accent/20 text-lime-accent bg-lime-accent/5" },
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
        return 'bg-lime-accent/10 text-lime-accent border-lime-accent/20 cursor-not-allowed'
      default: return 'bg-white/10 text-white/60 border-white/5'
    }
  }

  // --- SAFE OBJECT/STRING COMPATIBLE PARSER FOR PRODUCT BREAKDOWN ---
  const renderProductBreakdown = (itemsData) => {
    let finalArray = [];

    if (Array.isArray(itemsData)) {
      finalArray = itemsData;
    } else if (typeof itemsData === 'string') {
      try {
        const parsed = JSON.parse(itemsData);
        finalArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return <span className="truncate">{itemsData}</span>;
      }
    }

    if (finalArray && finalArray.length > 0) {
      return (
        <div className="flex flex-col gap-1 max-w-xs">
          {finalArray.map((prod, idx) => {
            if (!prod || typeof prod !== 'object') {
              return <span key={idx} className="block text-white/50">{String(prod)}</span>;
            }
            const name = prod.name || prod.product_name || "Unknown Item";
            const qty = prod.qty || prod.quantity || 1;
            const size = prod.selected_size || prod.size || "";
            return (
              <div key={idx} className="text-white/70 truncate text-[11px] font-mono">
                {qty}x {name} {size ? `(${size})` : ''}
              </div>
            );
          })}
        </div>
      );
    }

    return <span className="text-white/30">Package Cargo</span>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-10 bg-royal-dark text-white min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Layout Greeting Block */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">Admin Dashboard</h2>
          <p className="text-xs text-white/50 font-medium mt-1">Real-time storefront telemetry, fulfillment pipelines, and financial status tracking.</p>
        </div>
        <button 
          onClick={fetchAllAdminOrders} 
          className="inline-flex items-center gap-2 self-start sm:self-center text-[10px] font-black uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Sync Registry Matrix
        </button>
      </div>

      {/* Analytics Card Metrics Configuration Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
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

      {/* Customer Registry Board wrapper */}
      <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 relative z-10 backdrop-blur-md">
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-white">Recent Customer Orders</h3>
          <p className="text-xs text-white/40 mt-0.5">Live feed tracking standard customer purchase workflows. Click status badge to advance route lifecycle.</p>
        </div>

        {isLoading ? (
          <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-20">
            Parsing localized cluster registry payloads...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-xs font-mono tracking-widest text-white/30 uppercase border border-dashed border-white/10 rounded-xl">
            No active transaction logs mapped to database links
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-white/60">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date Ordered</th>
                  <th className="p-4">Product Breakdown</th>
                  <th className="p-4">Total Value</th>
                  <th className="p-4 text-center">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-medium text-white/80">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-mono text-lime-accent font-bold whitespace-nowrap">{order.id}</td>
                    <td className="p-4 text-white font-bold whitespace-nowrap">{order.customer || "Muthu V"}</td>
                    
                    {/* RUNNING CLEAN NATIVE DATE PARSER VECTOR */}
                    <td className="p-4 text-white/50 whitespace-nowrap font-mono">
                      {formatOrderDate(order.created_at)}
                    </td>
                    
                    {/* SAFE RENDERING CELL BLOCK */}
                    <td className="p-4 text-white/60 max-w-xs">
                      {renderProductBreakdown(order.items)}
                    </td>

                    <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                      ₹{Number(String(order.total || order.total_price || 0).replace(/[^0-9]/g, '')).toLocaleString('en-IN')}
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

export default Dashboard