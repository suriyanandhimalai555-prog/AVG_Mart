import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PackageCheck, Truck, Loader2, ShieldCheck, ArrowLeft, ChevronRight, Copy, Check, ExternalLink, XCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { EcommerceLoader } from '../components/EcommerceLoader'

const OrderStatusDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const [orderData, setOrderData] = useState(null)
  const [shypfyTracking, setShypfyTracking] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedTracking, setCopiedTracking] = useState(false)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchOrderAndLiveTracking = async () => {
      try {
        setIsLoading(true)
        // 1. Fetch order details from your backend API
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/orders`, {
          headers: { "Authorization": `Bearer ${token}` }
        })

        if (res.ok) {
          const data = await res.json()
          const matchingOrder = data.find(o => String(o.id) === String(id))

          if (matchingOrder) {
            setOrderData(matchingOrder)

            // 2. Fetch live tracking data from Shypfy via your backend proxy
            if (matchingOrder.tracking_id && matchingOrder.tracking_id !== 'N/A') {
              try {
                const trackingRes = await fetch(
                  `${import.meta.env.VITE_APP_BASE_URL}/api/auth/orders/track/${matchingOrder.tracking_id}`,
                  { headers: { "Authorization": `Bearer ${token}` } }
                )
                if (trackingRes.ok) {
                  const trackingData = await trackingRes.json()
                  setShypfyTracking(trackingData)
                }
              } catch (trackErr) {
                console.error("Live Shypfy telemetry fetch error:", trackErr)
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed downloading transaction metrics:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderAndLiveTracking()
  }, [id, token, navigate])

  const copyToClipboard = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedTracking(true)
    setTimeout(() => setCopiedTracking(false), 2000)
  }

  // Determine current timeline level based on Shypfy live status payload or DB fallback
  const determineCurrentStepLevel = (dbStatus, shypfyData) => {
    const rawStatus = (
      shypfyData?.track?.status || 
      shypfyData?.status || 
      dbStatus || 
      ''
    ).toString().toLowerCase()

    if (rawStatus.includes('cancel')) {
      return -1 // Special status for cancelled shipments
    }
    if (rawStatus.includes('deliver') || rawStatus.includes('completed')) {
      return 3
    }
    if (
      rawStatus.includes('dispatch') || 
      rawStatus.includes('transit') || 
      rawStatus.includes('out for delivery') || 
      rawStatus.includes('shipped') ||
      rawStatus.includes('picked up') ||
      rawStatus.includes('order placed')
    ) {
      return 2
    }
    return 1
  }

  // ROBUST FALLBACK ESTIMATION LOGIC
  const calculateDefaultEstimatedArrival = (dateInput) => {
    if (!dateInput) return 'Within 5-7 Days'
    try {
      let parsedDate = new Date(dateInput)

      if (isNaN(parsedDate.getTime()) && typeof dateInput === 'string') {
        const [datePart] = dateInput.split(',')
        const parts = datePart.trim().split('/')
        if (parts.length === 3) {
          const [day, month, year] = parts
          parsedDate = new Date(Number(year), Number(month) - 1, Number(day))
        }
      }

      if (isNaN(parsedDate.getTime())) {
        return 'Within 5-7 Days'
      }

      parsedDate.setDate(parsedDate.getDate() + 6)

      const targetDay = String(parsedDate.getDate()).padStart(2, '0')
      const targetMonth = String(parsedDate.getMonth() + 1).padStart(2, '0')
      const targetYear = parsedDate.getFullYear()

      return `${targetDay}/${targetMonth}/${targetYear}`
    } catch (e) {
      return 'Within 5-7 Days'
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="bg-gray-50 min-h-screen py-12 px-4 flex items-center justify-center">
          <div className="bg-white border border-gray-100 rounded-2xl p-12 w-full max-w-md shadow-sm relative overflow-hidden min-h-[300px]">
            <EcommerceLoader message="Syncing Shypfy Live Courier Metrics..." />
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

  const currentStepLevel = determineCurrentStepLevel(orderData.status, shypfyTracking)

  const coreBaseDate = orderData.date || orderData.created_at || orderData.timeline?.preparingDate
  const dispatchTimestampLog = orderData.dispatched_at || orderData.dispatchedDate || shypfyTracking?.dispatched_at
  const deliveryTimestampLog = orderData.delivered_at || orderData.deliveredDate || shypfyTracking?.delivered_at

  const currentSavedExpectedDate = shypfyTracking?.edd || orderData.expected_delivery || orderData.expectedDelivery

  const deliveryDisplayDeadline = (currentSavedExpectedDate && currentSavedExpectedDate !== 'Not Set' && currentSavedExpectedDate !== 'Pending' && currentSavedExpectedDate !== 0)
    ? (typeof currentSavedExpectedDate === 'number' ? new Date(currentSavedExpectedDate * 1000).toLocaleDateString('en-GB') : currentSavedExpectedDate)
    : calculateDefaultEstimatedArrival(coreBaseDate)

  const trackingNumber = orderData.tracking_id || shypfyTracking?.tracking_id || shypfyTracking?._id
  const vendorName = shypfyTracking?.vendor || shypfyTracking?.courier_name || 'Shypfy Courier Network'

  // Extract description directly from Shypfy live track object if available
  const liveShypfyStatusText = shypfyTracking?.track?.desc || shypfyTracking?.track?.status || shypfyTracking?.current_status

  const stepsTimelineLayout = [
    {
      level: 1,
      title: "Preparing for Dispatch",
      desc: "Items packed, manifest verified, and assigned to logistics node.",
      dateLog: coreBaseDate ? new Date(coreBaseDate).toLocaleDateString('en-GB') : ''
    },
    {
      level: 2,
      title: "Order Dispatched & In-Transit",
      desc: liveShypfyStatusText || "Package left hub. Courier unit active on transit route.",
      dateLog: dispatchTimestampLog ? new Date(dispatchTimestampLog).toLocaleDateString('en-GB') : (currentStepLevel >= 2 ? 'In Transit' : '')
    },
    {
      level: 3,
      title: "Order Delivered",
      desc: "Package handed off safely to recipient at destination address.",
      dateLog: deliveryTimestampLog ? new Date(deliveryTimestampLog).toLocaleDateString('en-GB') : (currentStepLevel === 3 ? 'Delivered' : '')
    }
  ]

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 min-h-screen py-6 px-3 sm:px-6 md:px-8 font-sans">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">

          {/* BREADCRUMB NAVIGATION */}
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

          {/* LIVE CARRIER & COURIER BANNER */}
          {trackingNumber && (
            <div className="bg-gradient-to-r from-slate-900 to-gray-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentStepLevel === -1 ? 'bg-rose-500' : 'bg-[#A5CE00]'}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${currentStepLevel === -1 ? 'bg-rose-500' : 'bg-[#A5CE00]'}`}></span>
                  </span>
                  <span className={`text-xs font-extrabold tracking-wider uppercase ${currentStepLevel === -1 ? 'text-rose-400' : 'text-[#A5CE00]'}`}>
                    {currentStepLevel === -1 ? 'Shipment Cancelled' : 'Live Logistics Telemetry'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-mono font-bold text-gray-300">
                    {vendorName}
                  </span>
                  <a
                    href={`https://app.shypfy.com/track/${trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors p-1"
                    title="Open in Shypfy Portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Waybill / Tracking Code</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-sm sm:text-base font-black font-mono tracking-wide text-white">{trackingNumber}</p>
                    <button
                      onClick={() => copyToClipboard(trackingNumber)}
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer p-1"
                      title="Copy Tracking ID"
                    >
                      {copiedTracking ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Estimated Delivery</p>
                  <p className={`text-sm font-extrabold mt-0.5 ${currentStepLevel === -1 ? 'text-rose-400 line-through' : 'text-[#A5CE00]'}`}>
                    {currentStepLevel === -1 ? 'Cancelled' : deliveryDisplayDeadline}
                  </p>
                </div>
              </div>
            </div>
          )}

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

            {/* PACKAGE ITEMS */}
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

          {/* CANCELLED SHIPMENT ALERT CARD */}
          {currentStepLevel === -1 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800">
              <XCircle className="w-6 h-6 shrink-0 text-rose-600" />
              <div className="text-xs">
                <p className="font-extrabold uppercase">Shipment Cancelled by Courier/Seller</p>
                <p className="text-rose-600 font-medium mt-0.5">
                  {shypfyTracking?.track?.desc || "This shipment has been voided. Please contact support for assistance or re-order."}
                </p>
              </div>
            </div>
          )}

          {/* TIMELINE PROGRESS PANEL */}
          {currentStepLevel !== -1 && (
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
          )}

          {/* SECURITY STAMP */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider pb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Shypfy Live Shipment Tracking Active
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default OrderStatusDetail