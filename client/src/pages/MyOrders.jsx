import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, Calendar, Package, Star, X, Camera, ChevronRight, CheckCircle2, Truck, AlertTriangle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'
import { EcommerceLoader } from '../components/EcommerceLoader'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [liveTrackingMap, setLiveTrackingMap] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  // Modal Review States
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [rawFiles, setRawFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  // Modal Cancel States
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [selectedCancelOrderId, setSelectedCancelOrderId] = useState(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const fetchLiveTrackingForOrders = async (ordersList) => {
    const trackingPromises = ordersList.map(async (order) => {
      const trackingId = order.tracking_id || order.trackingId
      if (trackingId && trackingId !== 'N/A') {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_APP_BASE_URL}/api/auth/orders/track/${trackingId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          if (res.ok) {
            const data = await res.json()
            return { orderId: order.id, data }
          }
        } catch (err) {
          console.error(`Tracking fetch failed for order ${order.id}:`, err)
        }
      }
      return { orderId: order.id, data: null }
    })

    const results = await Promise.all(trackingPromises)
    const map = {}
    results.forEach(({ orderId, data }) => {
      if (data) map[orderId] = data
    })
    setLiveTrackingMap(map)
  }

  const fetchLiveUserOrders = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
        await fetchLiveTrackingForOrders(data)
      }
    } catch (err) {
      console.error("Failed to fetch customer orders:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchLiveUserOrders()
  }, [token, navigate])

  const getLiveOrderStatus = (order) => {
    const trackingData = liveTrackingMap[order.id]
    const rawStatus = (
      trackingData?.track?.status ||
      trackingData?.status ||
      order.status ||
      'Preparing'
    ).toString()

    return rawStatus
  }

  const getStatusBadgeStyle = (statusStr) => {
    const status = statusStr.toLowerCase()
    if (status.includes('cancel')) {
      return 'bg-rose-50 text-rose-700 border-rose-200'
    }
    if (status.includes('deliver') || status.includes('completed')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
    if (
      status.includes('dispatch') ||
      status.includes('transit') ||
      status.includes('out for delivery') ||
      status.includes('shipped') ||
      status.includes('picked up')
    ) {
      return 'bg-blue-50 text-blue-700 border-blue-200'
    }
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }

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

  // Handle Order Cancellation
  const promptCancelOrder = (orderId) => {
    setSelectedCancelOrderId(orderId)
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = async () => {
    if (!selectedCancelOrderId) return
    try {
      setIsCancelling(true)
      const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/orders/cancel/${selectedCancelOrderId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(data.message || "Order cancelled successfully!")
        setCancelModalOpen(false)
        fetchLiveUserOrders()
      } else {
        toast.error(data.message || "Failed to cancel order.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Error cancelling order.")
    } finally {
      setIsCancelling(false)
    }
  }

  const handleReviewImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (rawFiles.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images for your review.")
      return
    }

    setRawFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeStagedReviewImage = (index) => {
    setRawFiles(rawFiles.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const openReviewForm = (productId) => {
    if (!productId) {
      toast.error("Product ID mapping missing.")
      return
    }
    setSelectedProductId(productId)
    setRating(5)
    setComment('')
    setRawFiles([])
    setPreviews([])
    setReviewModalOpen(true)
  }

  const submitReview = async (e) => {
    e.preventDefault()

    if (!selectedProductId) {
      toast.error("Product data context missing.")
      return
    }

    setIsSubmittingReview(true)

    const formData = new FormData()
    formData.append("productId", selectedProductId)
    formData.append("rating", rating)
    formData.append("comment", comment)
    rawFiles.forEach((file) => {
      formData.append("reviewImages", file)
    })

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/products/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        toast.success("Thank you! Your review has been published.")
        setReviewModalOpen(false)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to submit review.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Network error submitting review feedback.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 min-h-screen py-8 px-4 md:px-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* PAGE HEADER & BREADCRUMB */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-1">
                <span onClick={() => navigate('/')} className="hover:text-black cursor-pointer">Home</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-800">My Orders</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                My Orders
              </h1>
            </div>

            <span className="text-xs font-bold text-gray-500">
              Total Orders: <strong className="text-gray-900">{orders.length}</strong>
            </span>
          </div>

          {isLoading ? (
            <div className="relative min-h-[400px] border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
              <EcommerceLoader message="Syncing Orders & Live Logistics..." />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-3 shadow-sm">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-800">No Orders Found</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                You haven't placed any orders yet. Explore our products and order now!
              </p>
              <button
                onClick={() => navigate('/allproducts')}
                className="text-xs text-white bg-gray-900 px-4 py-2 rounded-xl font-bold uppercase tracking-wider hover:bg-black transition-all cursor-pointer"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const liveStatusText = getLiveOrderStatus(order)
                const lowerStatus = liveStatusText.toLowerCase()
                const isDelivered = lowerStatus.includes('deliver') || lowerStatus.includes('completed')
                const isCancelled = lowerStatus.includes('cancel')
                const isCancellable = !isDelivered && !isCancelled && !lowerStatus.includes('dispatch') && !lowerStatus.includes('transit') && !lowerStatus.includes('out for delivery') && !lowerStatus.includes('shipped')

                const trackingInfo = liveTrackingMap[order.id]
                const trackingNumber = order.tracking_id || order.trackingId || trackingInfo?.tracking_id || trackingInfo?._id

                return (
                  <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow">

                    {/* ORDER STATUS & META */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 text-xs text-gray-500 font-medium">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-gray-900 font-mono">
                          Order ID: #{order.id}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Calendar className="w-3.5 h-3.5" /> {formatDate(order.created_at || order.date)}
                        </span>
                      </div>

                      {/* LIVE STATUS BADGE */}
                      <div className="flex items-center gap-2">
                        {trackingNumber && trackingNumber !== 'N/A' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                            <Truck className="w-3 h-3 text-[#A5CE00]" /> {trackingNumber}
                          </span>
                        )}
                        <div className="flex items-center gap-1.5">
                          {isDelivered && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadgeStyle(liveStatusText)}`}>
                            {liveStatusText}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ORDER ITEMS TRAY */}
                    <div className="space-y-2.5">
                      {order.items && order.items.map((item, index) => {
                        const targetProductId = item.product_id || item.id

                        return (
                          <div key={index} className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-100 p-3 rounded-xl">
                            <div className="flex items-center gap-3">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-200 p-1" />
                              <div className="text-left">
                                <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                                <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                                  Qty: {item.quantity || item.qty} {item.selected_size && `| Size: ${item.selected_size}`}
                                </p>
                              </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-1.5">
                              <span className="text-xs font-extrabold text-gray-900">
                                ₹{(item.price * (item.quantity || item.qty))}
                              </span>

                              {isDelivered && (
                                <button
                                  onClick={() => openReviewForm(targetProductId)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Review
                                </button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* ORDER FOOTER ACTION */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Total Amount</span>
                        <span className="text-sm font-black text-white px-2 py-0.5 rounded w-fit mt-0.5" style={{ backgroundColor: '#A5CE00' }}>
                          ₹{Number(order.totalPrice || order.total_price || order.total || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCancellable && (
                          <button
                            onClick={() => promptCancelOrder(order.id)}
                            className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/orders/track/${order.id}`)}
                          className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider bg-gray-900 hover:bg-black text-white px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                        >
                          <span>Track Order</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#A5CE00]" />
                        </button>
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>

      {/* CANCELLATION CONFIRMATION MODAL */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-100 w-full max-w-sm rounded-2xl p-6 relative text-center space-y-4 shadow-xl">
            {isCancelling && <EcommerceLoader message="Processing Cancellation & Refund..." />}
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Cancel Order #{selectedCancelOrderId}?</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Are you sure you want to cancel this order? If prepaid, a refund will be initiated to your original payment method.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase bg-rose-600 hover:bg-rose-700 text-white shadow-md disabled:opacity-50 cursor-pointer"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW SUBMISSION MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-gray-100 w-full max-w-md rounded-2xl p-6 relative text-left space-y-4 shadow-xl overflow-hidden">

            {isSubmittingReview && <EcommerceLoader message="Publishing Your Review..." />}

            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Share Product Feedback</h3>
              <button onClick={() => setReviewModalOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-black cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button" key={num} onClick={() => setRating(num)}
                      className="transform hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${num <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Your Review</label>
                <textarea
                  required rows="3" value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the quality, fit, or packaging?..."
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-gray-400 rounded-xl px-3 py-2 text-xs text-gray-900 outline-none font-medium resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Upload Images (Max 5)</label>
                <div className="flex flex-col items-center justify-center p-3.5 border border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 relative cursor-pointer">
                  <input type="file" multiple accept="image/*" onChange={handleReviewImageChange} disabled={previews.length >= 5} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                  <Camera className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-[11px] text-gray-500 font-semibold">Click to attach photos</span>
                </div>

                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {previews.map((previewImg, index) => (
                      <div key={index} className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white">
                        <img src={previewImg} alt="Review attachment" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeStagedReviewImage(index)} className="absolute top-0.5 right-0.5 bg-black/70 text-white p-0.5 rounded-full hover:bg-rose-600 cursor-pointer">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                <button type="button" onClick={() => setReviewModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmittingReview} className="px-4 py-2 rounded-xl text-xs font-extrabold uppercase bg-rose-600 hover:bg-rose-700 text-white shadow-md disabled:opacity-50 cursor-pointer">
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

export default MyOrders