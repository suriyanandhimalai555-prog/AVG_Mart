import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, ArrowUpRight, ShieldCheck, Calendar, Package } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchLiveUserOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/orders", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (err) {
        console.error("Failed to fetch customer orders:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLiveUserOrders()
  }, [token, navigate])

  // Native clean date helper function
  const formatDate = (rawDate) => {
    if (!rawDate) return "Recent"
    const parsedDate = new Date(rawDate)
    if (isNaN(parsedDate.getTime())) return rawDate
    return parsedDate.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-4 sm:px-6 md:px-12 relative">
        <div className="max-w-4xl mx-auto mt-6">
          
          {/* Header Section */}
          <div className="flex flex-col items-start space-y-1 mb-8 border-b border-white/5 pb-6">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-white/5 border border-white/10 px-3 py-1 rounded-full text-lime-accent">
              <ClipboardList className="w-3 h-3" /> Account
            </div>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-wide mt-2">
              My <span className="text-lime-accent font-light">Orders</span>
            </h1>
          </div>

          {isLoading ? (
            <div className="text-center text-sm tracking-wider text-lime-accent uppercase animate-pulse py-20 font-mono">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-16 text-center space-y-4 max-w-md mx-auto shadow-xl">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/40">
                <Package className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold uppercase tracking-wide text-white">No Orders Found</h3>
                <p className="text-xs text-white/40 leading-relaxed">
                  You haven't placed any orders yet. Once you make a purchase, it will appear right here.
                </p>
              </div>
            </div>
          ) : (
            /* Orders Card Grid List Matrix */
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="group border border-white/5 bg-white/[0.01] rounded-xl p-5 hover:border-white/10 transition-all duration-200">
                  
                  {/* Card Header Info block */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3.5 mb-4 text-left">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-white/40">Order Identification</span>
                      <h3 className="text-xs sm:text-sm font-bold font-mono text-lime-accent uppercase tracking-wide">{order.id}</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="flex items-center gap-1.5 text-xs text-white/50">
                        <Calendar className="w-3.5 h-3.5 opacity-60" />
                        <span>{formatDate(order.created_at || order.date)}</span>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md border ${
                        order.status === 'Delivered' || order.status === 'Order Delivered'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items list matrix ordered */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(order.items || []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-black/20 border border-white/5 p-2.5 rounded-lg">
                        <div className="w-10 h-12 bg-black/40 border border-white/10 rounded overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-left space-y-0.5">
                          <h4 className="text-xs font-bold uppercase text-white line-clamp-1">{item.name}</h4>
                          <span className="text-[10px] font-mono text-white/40">QTY: {item.qty} × ₹{Number(item.price).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Actions Footer block */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-white/40 uppercase tracking-wider">Total amount paid</span>
                      <span className="text-base font-black font-mono text-white">₹{Number(order.totalPrice || order.total_price).toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:inline-flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-white/30">
                        <ShieldCheck className="w-3.5 h-3.5 text-white/30" /> Verified Order
                      </div>
                      <button 
                        onClick={() => navigate(`/orders/track/${order.id}`)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg transition-all text-lime-accent hover:text-white cursor-pointer"
                      >
                        Track Shipment 
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  )
}

export default MyOrders