// import React, { useState, useEffect } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { PackageCheck, Truck, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'
// import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'

// const OrderStatusDetail = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const token = localStorage.getItem("token")

//   const [orderData, setOrderData] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     if (!token) {
//       navigate('/login')
//       return
//     }

//     const fetchLiveTrackingMetrics = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/orders`, {
//           headers: { "Authorization": `Bearer ${token}` }
//         })
//         if (res.ok) {
//           const data = await res.json()
//           const matchingOrder = data.find(o => String(o.id) === String(id))
//           if (matchingOrder) {
//             setOrderData(matchingOrder)
//           }
//         }
//       } catch (err) {
//         console.error("Failed downloading transaction metrics:", err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchLiveTrackingMetrics()
//   }, [id, token, navigate])

//   const determineCurrentStepLevel = (statusText) => {
//     switch (statusText) {
//       case 'Preparing for Dispatch':
//       case 'Preparing':
//         return 1
//       case 'Dispatched':
//         return 2
//       case 'Delivered':
//         return 3
//       default:
//         return 1
//     }
//   }

//   // --- AUTOMATIC FALLBACK 6-DAY ESTIMATION LOGIC ---
//   const calculateDefaultEstimatedArrival = (dateString) => {
//     if (!dateString) return 'Calculating...'
//     try {
//       let parsedDate = new Date(dateString);

//       if (isNaN(parsedDate.getTime())) {
//         const [datePart] = dateString.split(',')
//         const [day, month, year] = datePart.trim().split('/')
//         parsedDate = new Date(year, month - 1, day)
//       }

//       parsedDate.setDate(parsedDate.getDate() + 6)

//       const targetDay = String(parsedDate.getDate()).padStart(2, '0')
//       const targetMonth = String(parsedDate.getMonth() + 1).padStart(2, '0')
//       const targetYear = parsedDate.getFullYear()

//       return `${targetDay}/${targetMonth}/${targetYear}`
//     } catch (e) {
//       return 'Within 6 Days'
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="text-center text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse py-40 bg-royal-dark min-h-screen flex items-center justify-center">
//         Synchronizing Live Telemetry Tracking Layers...
//       </div>
//     )
//   }

//   if (!orderData) {
//     return (
//       <div className="text-center text-xs font-mono tracking-widest text-red-400 uppercase py-40 bg-royal-dark min-h-screen flex flex-col items-center justify-center gap-4">
//         <span>Target Tracking Node Registry Index Not Found</span>
//         <button onClick={() => navigate('/orders')} className="text-white border border-white/10 px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider bg-white/5">Return to Ledger</button>
//       </div>
//     )
//   }

//   const currentStepLevel = determineCurrentStepLevel(orderData.status)

//   const coreBaseDate = orderData.timeline?.preparingDate || orderData.date;
//   const dispatchTimestampLog = orderData.timeline?.dispatchedDate || orderData.dispatchedDate || orderData.dispatched_at || orderData.dispatchedAt;

//   // FIXED: Read explicitly from the newly fetched delivered_at field from user backend payload
//   const deliveryTimestampLog = orderData.delivered_at || orderData.timeline?.deliveredDate || orderData.deliveredDate || orderData.deliveredAt;

//   // READ CUSTOM EXPECTED DATE DIRECTLY FROM BACKEND SQL SELECTION FIELD
//   const currentSavedExpectedDate = orderData.expected_delivery || orderData.expectedDelivery;

//   // Choose custom date if available; otherwise calculate automatically
//   const deliveryDisplayDeadline = (currentSavedExpectedDate && currentSavedExpectedDate !== 'Not Set' && currentSavedExpectedDate !== 'Pending')
//     ? currentSavedExpectedDate
//     : calculateDefaultEstimatedArrival(coreBaseDate);

//   const stepsTimelineLayout = [
//     {
//       level: 1,
//       title: "Preparing for Dispatch",
//       desc: "Warehouse operations are packaging and reinforcing the assets.",
//       dateLog: coreBaseDate ? new Date(coreBaseDate).toLocaleDateString('en-GB') : ''
//     },
//     {
//       level: 2,
//       title: "Order Dispatched",
//       desc: "Cargo cleared terminal. Fleet transit routes are actively computed.",
//       dateLog: dispatchTimestampLog
//     },
//     {
//       level: 3,
//       title: "Order Delivered",
//       desc: "Asset handed off safely. Sequence closed successfully.",
//       dateLog: deliveryTimestampLog
//     }
//   ]

//   return (
//     <>
//       <Navbar />
//       <div className="bg-royal-dark text-white min-h-screen py-24 px-6 md:px-12 relative overflow-hidden select-none">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:40px_40px]" />

//         <div className="max-w-2xl mx-auto relative z-10 mt-6 space-y-10">

//           <div className="text-left">
//             <button onClick={() => navigate('/orders')} className="group inline-flex items-center gap-2 text-white/50 hover:text-lime-accent text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 px-5 py-3 rounded-xl transition-all">
//               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" /> BACK TO ORDERS
//             </button>
//           </div>

//           <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
//             <div>
//               <span className="text-[9px] font-black tracking-widest text-white/30 uppercase block">Order ID</span>
//               <h2 className="text-sm font-mono font-black text-lime-accent">{orderData.id}</h2>
//             </div>
//             <div className="sm:text-right">
//               <span className="text-[9px] font-black tracking-widest text-white/30 uppercase block">Total Amount</span>
//               <span className="text-xl font-mono font-black text-white">
//                 {orderData.total || (orderData.totalPrice ? `₹${Number(orderData.totalPrice).toLocaleString('en-IN')}` : '₹0')}
//               </span>
//             </div>
//           </div>

//           <div className="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative text-left">
//             <div className="space-y-12 relative">

//               <div className="absolute top-4 left-5 bottom-4 w-0.5 bg-white/5 z-0" />

//               <div
//                 className="absolute top-4 left-5 w-0.5 bg-gradient-to-b from-lime-accent to-emerald-400 z-0 transition-all duration-1000 ease-in-out"
//                 style={{
//                   height: currentStepLevel === 1 ? '0%' : currentStepLevel === 2 ? '50%' : '100%'
//                 }}
//               />

//               {stepsTimelineLayout.map((step) => {
//                 const isCompleted = currentStepLevel >= step.level;
//                 const isActive = currentStepLevel === step.level;

//                 return (
//                   <div key={step.level} className="flex gap-6 items-start relative z-10 group">

//                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shadow-xl flex-shrink-0 ${isActive
//                         ? 'bg-lime-accent border-lime-accent text-royal-dark animate-pulse scale-110 shadow-[0_0_20px_rgba(165,206,0,0.4)]'
//                         : isCompleted
//                           ? 'bg-royal-dark border-lime-accent text-lime-accent'
//                           : 'bg-royal-dark border-white/10 text-white/20'
//                       }`}>
//                       {step.level === 1 && <Loader2 className={`w-4 h-4 ${isActive ? 'animate-spin' : ''}`} />}
//                       {step.level === 2 && <Truck className="w-4 h-4" />}
//                       {step.level === 3 && <PackageCheck className="w-4 h-4" />}
//                     </div>

//                     <div className="space-y-1 flex-1">
//                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
//                         <h3 className={`text-base font-black uppercase tracking-wide transition-colors duration-300 ${isActive ? 'text-lime-accent' : isCompleted ? 'text-white' : 'text-white/20'
//                           }`}>
//                           {step.title}
//                         </h3>
//                         {step.dateLog && isCompleted && (
//                           <span className="text-[10px] font-mono text-white/40">{step.dateLog}</span>
//                         )}
//                       </div>
//                       <p className={`text-xs leading-relaxed font-medium transition-colors duration-300 ${isCompleted ? 'text-white/50' : 'text-white/10'
//                         }`}>
//                         {step.desc}
//                       </p>

//                       {/* Display calculations dynamically while in tracking cycles */}
//                       {step.level === 3 && currentStepLevel !== 3 && (
//                         <p className="text-[11px] text-white/40 pt-2 font-normal">
//                           Expected Delivery Arrival:{' '}
//                           <strong className="text-lime-accent font-mono">
//                             {deliveryDisplayDeadline}
//                           </strong>
//                         </p>
//                       )}
//                     </div>

//                   </div>
//                 )
//               })}

//             </div>
//           </div>

//           <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-widest text-white/30 uppercase">
//             <ShieldCheck className="w-4 h-4 text-lime-accent/50" /> Real-time Tracking active
//           </div>

//         </div>
//       </div>
//       <Footer />
//     </>
//   )
// }

// export default OrderStatusDetail

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PackageCheck, Truck, Loader2, ShieldCheck, ArrowLeft, ChevronRight, Package } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { EcommerceLoader } from '../components/EcommerceLoader'

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
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/orders`, {
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

  // AUTOMATIC FALLBACK ESTIMATION LOGIC
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
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen py-12 px-4 flex items-center justify-center">
          <div className="bg-white border border-gray-100 rounded-2xl p-12 w-full max-w-md shadow-sm relative overflow-hidden min-h-[300px]">
            <EcommerceLoader message="Syncing Live Tracking Metrics..." />
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!orderData) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 text-gray-900 min-h-screen py-16 px-4 flex flex-col items-center justify-center">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center space-y-4 max-w-md shadow-sm w-full">
            <h3 className="text-base font-black uppercase text-rose-600">Order Not Found</h3>
            <p className="text-xs text-gray-400 font-medium">
              We could not locate tracking metrics for this order ID.
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="text-xs text-white bg-gray-900 px-4 py-2.5 rounded-xl font-bold uppercase tracking-wider hover:bg-black transition-colors cursor-pointer"
            >
              Return to Orders
            </button>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const currentStepLevel = determineCurrentStepLevel(orderData.status)

  const coreBaseDate = orderData.timeline?.preparingDate || orderData.date;
  const dispatchTimestampLog = orderData.timeline?.dispatchedDate || orderData.dispatchedDate || orderData.dispatched_at || orderData.dispatchedAt;
  const deliveryTimestampLog = orderData.delivered_at || orderData.timeline?.deliveredDate || orderData.deliveredDate || orderData.deliveredAt;

  const currentSavedExpectedDate = orderData.expected_delivery || orderData.expectedDelivery;

  const deliveryDisplayDeadline = (currentSavedExpectedDate && currentSavedExpectedDate !== 'Not Set' && currentSavedExpectedDate !== 'Pending')
    ? currentSavedExpectedDate
    : calculateDefaultEstimatedArrival(coreBaseDate);

  const stepsTimelineLayout = [
    {
      level: 1,
      title: "Preparing for Dispatch",
      desc: "Items are being packed and reinforced for shipment.",
      dateLog: coreBaseDate ? new Date(coreBaseDate).toLocaleDateString('en-GB') : ''
    },
    {
      level: 2,
      title: "Order Dispatched",
      desc: "Package left the hub. Transit route is in progress.",
      dateLog: dispatchTimestampLog
    },
    {
      level: 3,
      title: "Order Delivered",
      desc: "Package handed off safely to destination address.",
      dateLog: deliveryTimestampLog
    }
  ]

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 min-h-screen py-6 px-3 sm:px-6 md:px-8 font-sans">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">

          {/* RESPONSIVE HEADER & BREADCRUMB */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 overflow-hidden">
              <span onClick={() => navigate('/')} className="hover:text-black cursor-pointer shrink-0">Home</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span onClick={() => navigate('/orders')} className="hover:text-black cursor-pointer shrink-0">Orders</span>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <span className="text-gray-800 truncate max-w-[120px] sm:max-w-[180px]">#{orderData.id}</span>
            </div>

            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors shadow-xs cursor-pointer w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
            </button>
          </div>

          {/* ORDER BRIEF INFO CARD */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Order Reference</span>
                <h2 className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5 break-all font-mono">#{orderData.id}</h2>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Total Amount</span>
                <span
                  className="text-xs sm:text-sm font-black text-white px-2 py-0.5 rounded inline-block mt-0.5"
                  style={{ backgroundColor: '#A5CE00' }}
                >
                  {orderData.total || (orderData.totalPrice ? `₹${Number(orderData.totalPrice).toLocaleString('en-IN')}` : '₹0')}
                </span>
              </div>
            </div>

            {/* ORDER ITEMS QUICK PREVIEW */}
            {orderData.items && orderData.items.length > 0 && (
              <div className="border-t border-gray-100 pt-3 mt-2">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-2">Package Items ({orderData.items.length})</span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {orderData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-1.5 rounded-lg shrink-0">
                      <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-contain bg-white p-0.5 border border-gray-200" />
                      <div className="text-[10px]">
                        <p className="font-bold text-gray-800 max-w-[100px] truncate">{item.name}</p>
                        <p className="text-gray-400">Qty: {item.quantity || item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TIMELINE PROGRESS PANEL */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs relative text-left">
            <div className="space-y-8 sm:space-y-10 relative">

              {/* TIMELINE BACKBONE LINE */}
              <div className="absolute top-4 left-4 sm:left-5 bottom-4 w-1 bg-gray-100 z-0" />

              {/* TIMELINE PROGRESS FILL */}
              <div
                className="absolute top-4 left-4 sm:left-5 w-1 z-0 transition-all duration-700 ease-in-out"
                style={{
                  backgroundColor: '#A5CE00',
                  height: currentStepLevel === 1 ? '0%' : currentStepLevel === 2 ? '50%' : '100%'
                }}
              />

              {stepsTimelineLayout.map((step) => {
                const isCompleted = currentStepLevel >= step.level;
                const isActive = currentStepLevel === step.level;

                return (
                  <div key={step.level} className="flex gap-3 sm:gap-5 items-start relative z-10">

                    {/* STEP ICON CIRCLE */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-xs shrink-0 ${
                        isActive
                          ? 'bg-gray-900 text-white border-gray-900 scale-105'
                          : isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-50 text-gray-300 border-gray-200'
                      }`}
                    >
                      {step.level === 1 && <Loader2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'animate-spin text-[#A5CE00]' : ''}`} />}
                      {step.level === 2 && <Truck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-[#A5CE00]' : ''}`} />}
                      {step.level === 3 && <PackageCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-[#A5CE00]' : ''}`} />}
                    </div>

                    {/* STEP CONTENT */}
                    <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className={`text-xs sm:text-sm font-extrabold uppercase tracking-wide transition-colors ${
                          isActive ? 'text-gray-900' : isCompleted ? 'text-gray-800' : 'text-gray-300'
                        }`}>
                          {step.title}
                        </h3>

                        {step.dateLog && isCompleted && (
                          <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded w-fit">
                            {step.dateLog}
                          </span>
                        )}
                      </div>

                      <p className={`text-[11px] sm:text-xs font-medium leading-relaxed ${
                        isCompleted || isActive ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        {step.desc}
                      </p>

                      {step.level === 3 && currentStepLevel !== 3 && (
                        <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-2 mt-2 font-bold inline-block">
                          Estimated Arrival: <span className="text-gray-900">{deliveryDisplayDeadline}</span>
                        </p>
                      )}
                    </div>

                  </div>
                )
              })}

            </div>
          </div>

          {/* SECURITY STAMP */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Live Shipment Tracking Active
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderStatusDetail