import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PackageCheck, Truck, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const OrderStatusDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchLiveTrackingMetrics = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/orders", {
          headers: { "Authorization": `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const matchingOrder = data.find(o => String(o.id) === String(id))
          if (matchingOrder) {
            setOrderData(matchingOrder)
          }
        }
      } catch (err) {
        console.error("Failed downloading transaction metrics:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLiveTrackingMetrics()
  }, [id, token, navigate])

  const determineCurrentStepLevel = (statusText) => {
    switch (statusText) {
      case 'Preparing for Dispatch':
      case 'Preparing':
        return 1
      case 'Dispatched':
        return 2
      case 'Delivered':
        return 3
      default:
        return 1
    }
  }

  // --- AUTOMATIC FALLBACK 6-DAY ESTIMATION LOGIC ---
  const calculateDefaultEstimatedArrival = (dateString) => {
    if (!dateString) return 'Calculating...'
    try {
      let parsedDate = new Date(dateString);

      if (isNaN(parsedDate.getTime())) {
        const [datePart] = dateString.split(',')
        const [day, month, year] = datePart.trim().split('/')
        parsedDate = new Date(year, month - 1, day)
      }
      
      parsedDate.setDate(parsedDate.getDate() + 6)

      const targetDay = String(parsedDate.getDate()).padStart(2, '0')
      const targetMonth = String(parsedDate.getMonth() + 1).padStart(2, '0')
      const targetYear = parsedDate.getFullYear()

      return `${targetDay}/${targetMonth}/${targetYear}`
    } catch (e) {
      return 'Within 6 Days'
    }
  }

  if (isLoading) {
    return (
      <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-40 bg-royal-dark min-h-screen flex items-center justify-center">
        Synchronizing Live Telemetry Tracking Layers...
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="text-center text-xs font-mono tracking-widest text-red-400 uppercase py-40 bg-royal-dark min-h-screen flex flex-col items-center justify-center gap-4">
        <span>Target Tracking Node Registry Index Not Found</span>
        <button onClick={() => navigate('/orders')} className="text-white border border-white/10 px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider bg-white/5">Return to Ledger</button>
      </div>
    )
  }

  const currentStepLevel = determineCurrentStepLevel(orderData.status)

  const coreBaseDate = orderData.timeline?.preparingDate || orderData.date;
  const dispatchTimestampLog = orderData.timeline?.dispatchedDate || orderData.dispatchedDate || orderData.dispatched_at || orderData.dispatchedAt;
  
  // FIXED: Read explicitly from the newly fetched delivered_at field from user backend payload
  const deliveryTimestampLog = orderData.delivered_at || orderData.timeline?.deliveredDate || orderData.deliveredDate || orderData.deliveredAt;

  // READ CUSTOM EXPECTED DATE DIRECTLY FROM BACKEND SQL SELECTION FIELD
  const currentSavedExpectedDate = orderData.expected_delivery || orderData.expectedDelivery;
  
  // Choose custom date if available; otherwise calculate automatically
  const deliveryDisplayDeadline = (currentSavedExpectedDate && currentSavedExpectedDate !== 'Not Set' && currentSavedExpectedDate !== 'Pending')
    ? currentSavedExpectedDate
    : calculateDefaultEstimatedArrival(coreBaseDate);

  const stepsTimelineLayout = [
    { 
      level: 1, 
      title: "Preparing for Dispatch", 
      desc: "Warehouse operations are packaging and reinforcing the assets.", 
      dateLog: coreBaseDate ? new Date(coreBaseDate).toLocaleDateString('en-GB') : ''
    },
    { 
      level: 2, 
      title: "Order Dispatched", 
      desc: "Cargo cleared terminal. Fleet transit routes are actively computed.", 
      dateLog: dispatchTimestampLog 
    },
    { 
      level: 3, 
      title: "Order Delivered", 
      desc: "Asset handed off safely. Sequence closed successfully.", 
      dateLog: deliveryTimestampLog 
    }
  ]

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="max-w-2xl mx-auto relative z-10 mt-6 space-y-10">
          
          <div className="text-left">
            <button 
              onClick={() => navigate('/orders')}
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 hover:text-lime-accent transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to My Order
            </button>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-[9px] font-black tracking-widest text-white/30 uppercase block">Order ID</span>
              <h2 className="text-sm font-mono font-black text-lime-accent">{orderData.id}</h2>
            </div>
            <div className="sm:text-right">
              <span className="text-[9px] font-black tracking-widest text-white/30 uppercase block">Total Amount</span>
              <span className="text-xl font-mono font-black text-white">
                {orderData.total || (orderData.totalPrice ? `₹${Number(orderData.totalPrice).toLocaleString('en-IN')}` : '₹0')}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative text-left">
            <div className="space-y-12 relative">
              
              <div className="absolute top-4 left-5 bottom-4 w-0.5 bg-white/5 z-0" />

              <div 
                className="absolute top-4 left-5 w-0.5 bg-gradient-to-b from-lime-accent to-emerald-400 z-0 transition-all duration-1000 ease-in-out" 
                style={{ 
                  height: currentStepLevel === 1 ? '0%' : currentStepLevel === 2 ? '50%' : '100%' 
                }}
              />

              {stepsTimelineLayout.map((step) => {
                const isCompleted = currentStepLevel >= step.level;
                const isActive = currentStepLevel === step.level;

                return (
                  <div key={step.level} className="flex gap-6 items-start relative z-10 group">
                    
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shadow-xl flex-shrink-0 ${
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

                    <div className="space-y-1 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className={`text-base font-black uppercase tracking-wide transition-colors duration-300 ${
                          isActive ? 'text-lime-accent' : isCompleted ? 'text-white' : 'text-white/20'
                        }`}>
                          {step.title}
                        </h3>
                        {step.dateLog && isCompleted && (
                          <span className="text-[10px] font-mono text-white/40">{step.dateLog}</span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed font-medium transition-colors duration-300 ${
                        isCompleted ? 'text-white/50' : 'text-white/10'
                      }`}>
                        {step.desc}
                      </p>

                      {/* Display calculations dynamically while in tracking cycles */}
                      {step.level === 3 && currentStepLevel !== 3 && (
                        <p className="text-[11px] text-white/40 pt-2 font-normal">
                          Expected Delivery Arrival:{' '}
                          <strong className="text-lime-accent font-mono">
                            {deliveryDisplayDeadline}
                          </strong>
                        </p>
                      )}
                    </div>

                  </div>
                )
              })}

            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-white/30 uppercase">
            <ShieldCheck className="w-4 h-4 text-lime-accent/50" /> Real-time Tracking active
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderStatusDetail