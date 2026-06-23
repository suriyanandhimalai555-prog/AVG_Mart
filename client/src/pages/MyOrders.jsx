import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, ArrowUpRight, ShieldCheck, Calendar, Package } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Localized mock dataset matching your schema
const MOCK_ORDERS = [
  {
    id: "AVG-9821-X6",
    date: "June 18, 2026",
    totalPrice: 410,
    status: "Preparing for Dispatch",
    items: [
      { name: "Alpha Matrix Over-Tee", price: 85, qty: 1, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200&auto=format&fit=crop" },
      { name: "Apex Stealth Boot V4", price: 310, qty: 1, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=200&auto=format&fit=crop" }
    ]
  },
  {
    id: "AVG-4412-M2",
    date: "May 12, 2026",
    totalPrice: 1150,
    status: "Order Delivered",
    items: [
      { name: "Chrono Chronograph V2", price: 1150, qty: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop" }
    ]
  }
]

const MyOrders = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden select-none">
        {/* Futuristic Grid Canvas */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="max-w-4xl mx-auto relative z-10 mt-6 space-y-10">
          
          {/* Header */}
          <div className="space-y-4 text-left border-b border-white/5 pb-8">
            <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-lime-accent">
              <ClipboardList className="w-3 h-3" /> Ledger & Manifests
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider">
              My <span className="text-lime-accent font-light">Orders</span>
            </h1>
          </div>

          {/* Orders Map Pipeline */}
          <div className="space-y-6">
            {MOCK_ORDERS.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/track/${order.id}`)}
                className="group bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-500 cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative text-left"
              >
                {/* Upper Ledger Meta details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                    <div>
                      <span className="text-white/30 uppercase block text-[9px] font-black tracking-widest">Order ID</span>
                      <span className="text-white font-black">{order.id}</span>
                    </div>
                    <div className="hidden sm:block w-px h-6 bg-white/10" />
                    <div>
                      <span className="text-white/30 uppercase block text-[9px] font-black tracking-widest">Timestamp</span>
                      <span className="text-white/70 flex items-center gap-1"><Calendar className="w-3 h-3 text-lime-accent" /> {order.date}</span>
                    </div>
                  </div>
                  
                  {/* Status Indicator Pill */}
                  <div>
                    <span className={`inline-block text-[10px] font-black tracking-wider uppercase px-3 py-1 rounded-md border ${
                      order.status === 'Order Delivered' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-lime-accent/10 border-lime-accent/20 text-lime-accent'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Main Content Area: Products in Order */}
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-black/40 border border-white/5 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover filter grayscale contrast-125" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-sm font-black uppercase text-white line-clamp-1">{item.name}</h4>
                          <span className="text-[10px] font-mono text-white/40">QTY: {item.qty} × ${item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Total Summary & Action Trigger */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-white/30 uppercase tracking-widest">Total Amount</span>
                    <span className="text-xl font-black font-mono text-white">${order.totalPrice}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-lime-accent group-hover:text-white transition-colors">
                    Track Order <ArrowUpRight className="w-4 h-4 bg-white/5 rounded p-0.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default MyOrders