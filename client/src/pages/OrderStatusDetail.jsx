import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, PackageCheck, Truck, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// Simulated operational map pipeline index matching standard backend tracking architectures
const PIPELINE_DATA = {
  "AVG-9821-X6": {
    id: "AVG-9821-X6",
    totalPrice: 410,
    currentStep: 1, // Index matching 'Preparing for Dispatch'
    steps: [
      { level: 1, title: "Preparing for Dispatch", desc: "Warehouse operations are packaging and reinforcing the assets." },
      { level: 2, title: "Order Dispatched", desc: "Cargo cleared terminal. Fleet transit routes are actively computed." },
      { level: 3, title: "Order Delivered", desc: "Asset handed off safely. Sequence closed successfully." }
    ]
  },
  "AVG-4412-M2": {
    id: "AVG-4412-M2",
    totalPrice: 1150,
    currentStep: 3, // Index matching 'Order Delivered'
    steps: [
      { level: 1, title: "Preparing for Dispatch", desc: "Warehouse operations are packaging and reinforcing the assets." },
      { level: 2, title: "Order Dispatched", desc: "Cargo cleared terminal. Fleet transit routes are actively computed." },
      { level: 3, title: "Order Delivered", desc: "Asset handed off safely. Sequence closed successfully." }
    ]
  }
}

const OrderStatusDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Lookup target sequence metadata, fallback if route parameter manipulation occurs
  const currentOrder = PIPELINE_DATA[id] || PIPELINE_DATA["AVG-9821-X6"]

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="max-w-2xl mx-auto relative z-10 mt-6 space-y-10">
          
          {/* Back Navigation Bar */}
          <div className="text-left">
            <button 
              onClick={() => navigate('/orders')}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 hover:text-lime-accent transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Return to Ledger
            </button>
          </div>

          {/* Heading Information Matrix */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-[9px] font-black tracking-widest text-white/30 uppercase block">Tracking Subsystem</span>
              <h2 className="text-xl font-mono font-black">{currentOrder.id}</h2>
            </div>
            <div className="sm:text-right">
              <span className="text-[9px] font-black tracking-widest text-white/30 uppercase block">Fulfillment Valuation</span>
              <span className="text-2xl font-mono font-black text-lime-accent">${currentOrder.totalPrice}</span>
            </div>
          </div>

          {/* --- ILLUMINATED TIMELINE VECTOR MATRIX --- */}
          <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative text-left">
            <div className="space-y-12 relative">
              
              {/* Connecting Vertical Track Baseline */}
              <div className="absolute top-4 left-5 bottom-4 w-0.5 bg-white/5 z-0" />

              {/* Dynamic Progress Filler Track */}
              <div 
                className="absolute top-4 left-5 w-0.5 bg-gradient-to-b from-lime-accent to-emerald-400 z-0 transition-all duration-1000 ease-in-out" 
                style={{ 
                  height: currentOrder.currentStep === 1 ? '0%' : currentOrder.currentStep === 2 ? '50%' : '100%' 
                }}
              />

              {/* Dynamic Step Mapping */}
              {currentOrder.steps.map((step) => {
                const isCompleted = currentOrder.currentStep >= step.level;
                const isActive = currentOrder.currentStep === step.level;

                return (
                  <div key={step.level} className="flex gap-6 items-start relative z-10 group">
                    
                    {/* Floating Step Node Trigger Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shadow-xl ${
                      isActive 
                        ? 'bg-lime-accent border-lime-accent text-royal-dark animate-pulse scale-110 shadow-[0_0_20px_rgba(165,206,0,0.4)]'
                        : isCompleted
                        ? 'bg-royal-dark border-lime-accent text-lime-accent'
                        : 'bg-royal-dark border-white/10 text-white/20'
                    }`}>
                      {step.level === 1 && <Loader2 className={`w-4 h-4 ${isActive ? 'animate-spin' : ''}`} />}
                      {step.level === 2 && <Truck className="w-4 h-4" />}
                      {step.level === 3 && <PackageCheck className="w-4 h-4" />}
                    </div>

                    {/* Metadata Content Stack */}
                    <div className="space-y-1 flex-1">
                      <h3 className={`text-base font-black uppercase tracking-wide transition-colors duration-300 ${
                        isActive ? 'text-lime-accent' : isCompleted ? 'text-white' : 'text-white/20'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs leading-relaxed font-medium transition-colors duration-300 ${
                        isCompleted ? 'text-white/50' : 'text-white/10'
                      }`}>
                        {step.desc}
                      </p>
                    </div>

                  </div>
                )
              })}

            </div>
          </div>

          {/* Infrastructure Guarantee footer */}
          <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-white/30 uppercase">
            <ShieldCheck className="w-4 h-4 text-lime-accent/50" /> Real-time node monitoring active
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderStatusDetail