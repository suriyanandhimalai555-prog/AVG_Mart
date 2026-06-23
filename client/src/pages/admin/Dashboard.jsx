import React, { useState } from 'react'
import { ShoppingCart, DollarSign, Clock, Truck, CheckCircle2 } from 'lucide-react'

const Dashboard = () => {
  // Mock customer orders dataset
  const [orders, setOrders] = useState([
    { id: "ORD-9831", customer: "Rohan Sharma", date: "2026-06-22", items: "2x Black T-Shirt", total: "₹1,499", status: "Preparing" },
    { id: "ORD-9830", customer: "Priya Patel", date: "2026-06-22", items: "1x Smart Sport Watch", total: "₹4,299", status: "Dispatched" },
    { id: "ORD-9829", customer: "Anand Kumar", date: "2026-06-21", items: "1x Premium Leather Belt", total: "₹999", status: "Delivered" },
    { id: "ORD-9828", customer: "Deepika R.", date: "2026-06-21", items: "1x Running Sneakers", total: "₹3,799", status: "Preparing" },
    { id: "ORD-9827", customer: "Sanjay Singh", date: "2026-06-20", items: "3x Casual Crew Socks", total: "₹599", status: "Delivered" }
  ])

  // Analytic card properties configured for cross-device viewports
  const stats = [
    { title: "Total Orders", value: "1,248", icon: <ShoppingCart className="w-5 h-5" />, color: "border-gray-canvas/20 text-gray-canvas bg-white/5" },
    { title: "Total Revenue", value: "₹4,12,450", icon: <DollarSign className="w-5 h-5" />, color: "border-lime-accent/20 text-lime-accent bg-lime-accent/5" },
    { title: "Preparing", value: "14", icon: <Clock className="w-5 h-5" />, color: "border-amber-500/20 text-amber-400 bg-amber-500/5" },
    { title: "Dispatched", value: "28", icon: <Truck className="w-5 h-5" />, color: "border-blue-400/20 text-blue-400 bg-blue-400/5" },
    { title: "Delivered", value: "1,206", icon: <CheckCircle2 className="w-5 h-5" />, color: "border-lime-accent/20 text-lime-accent bg-lime-accent/5" },
  ]

  // Status mapping color codes
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Preparing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      case 'Dispatched': return 'bg-blue-400/10 text-blue-400 border-blue-400/20'
      case 'Delivered': return 'bg-lime-accent/10 text-lime-accent border-lime-accent/20'
      default: return 'bg-white/10 text-gray-canvas/60 border-white/5'
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-10 bg-royal-dark/20 min-h-screen">
      
      {/* Layout Greeting Block */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-gray-canvas">Admin Dashboard</h2>
        <p className="text-xs text-gray-canvas/50 font-medium mt-1">Real-time storefront telemetry, fulfillment pipelines, and financial status tracking.</p>
      </div>

      {/* Analytics Card Metrics Configuration Grid (Highly Responsive Grid Matrix) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-royal-main/40 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/50 truncate">{stat.title}</span>
              <div className={`p-2 rounded-xl border flex-shrink-0 ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-canvas font-mono">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Customer Registry Board wrapper */}
      <div className="bg-royal-main/20 border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-bold tracking-wide uppercase text-gray-canvas">Recent Customer Orders</h3>
          <p className="text-xs text-gray-canvas/50 mt-0.5">Live feed tracking standard customer purchase workflows.</p>
        </div>

        {/* Responsive Layout Table Architecture Core container */}
        <div className="overflow-x-auto rounded-xl border border-white/5 bg-royal-dark/40">
          <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-full">
            <thead>
              <tr className="border-b border-white/10 bg-royal-dark text-[10px] font-black uppercase tracking-widest text-gray-canvas/60">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date Ordered</th>
                <th className="p-4">Product Breakdown</th>
                <th className="p-4">Total Value</th>
                <th className="p-4 text-center">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-medium text-gray-canvas/80">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-royal-main/30 transition-colors">
                  <td className="p-4 font-mono text-lime-accent font-bold whitespace-nowrap">{order.id}</td>
                  <td className="p-4 text-gray-canvas whitespace-nowrap">{order.customer}</td>
                  <td className="p-4 text-gray-canvas/50 whitespace-nowrap">{order.date}</td>
                  <td className="p-4 text-gray-canvas/50 max-w-xs truncate">{order.items}</td>
                  <td className="p-4 font-bold text-gray-canvas whitespace-nowrap">{order.total}</td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider border px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard