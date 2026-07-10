import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, ArrowUpRight, ShieldCheck, Calendar, Package, Star, X, Image, Camera } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
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

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const fetchLiveUserOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/auth/orders`, {
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

  const handleReviewImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (rawFiles.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images for your review.")
      return
    }
    
    setRawFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result])
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
      toast.error("Could not trace validation signature for this product ID mapping.");
      return;
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
      toast.error("Product configuration payload data missing context.")
      return
    }

    setIsSubmittingReview(true)
    const loadId = toast.loading("Publishing your review...")

    const formData = new FormData()
    formData.append("productId", selectedProductId)
    formData.append("rating", rating)
    formData.append("comment", comment)
    rawFiles.forEach(file => {
      formData.append("reviewImages", file)
    })

    try {
      // FIXED ENDPOINT TO MATCH AUTHROUTES CONFIGURATION PATH
      const response = await fetch(`${import.meta.env.VITE_APP_BASE_URL}/api/products/reviews`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        toast.success("Thank you! Your feedback has been published.", { id: loadId })
        setReviewModalOpen(false)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to submit review.", { id: loadId })
      }
    } catch (error) {
      console.error(error)
      toast.error("Network error submitting review feedback.", { id: loadId })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-royal-dark text-white min-h-screen py-24 px-4 sm:px-6 md:px-12 relative select-none font-sans">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <div className="max-w-4xl mx-auto relative z-10 space-y-10">
          
          <div className="text-left mt-5">
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-lime-accent" />
              My <span className="text-lime-accent">Purchase Loadouts</span>
            </h2>
            <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-mono">Track shipment timelines and update historical product reviews.</p>
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse">
              Syncing order matrix ledgers...
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-white/5 rounded-2xl p-12 bg-white/[0.02] text-center space-y-3">
              <Package className="w-10 h-10 text-white/20 mx-auto" />
              <p className="text-xs uppercase font-bold tracking-widest text-white/40">No orders logged to this identifier terminal node.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 hover:border-white/20 transition-all">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3 text-xs font-mono text-white/50">
                    <div className="flex flex-wrap gap-4">
                      <span>ORDER ID: <strong className="text-white">#{order.id}</strong></span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(order.created_at)}</span>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        String(order.status).toLowerCase() === 'delivered' 
                          ? 'bg-lime-accent/10 text-lime-400 border border-lime-accent/20' 
                          : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Tray */}
                  {/* Order Items Tray */}
<div className="space-y-3">
  {order.items && order.items.map((item, index) => {
    const targetProductId = item.product_id || item.id;
    
    return (
      <div key={index} className="flex items-center justify-between gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-royal-dark border border-white/10" />
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase text-white/90 line-clamp-1">{item.name}</h4>
            <p className="text-[10px] font-mono text-white/40 mt-0.5">
              QTY: {item.quantity || item.qty} {item.selected_size && `| SIZE: ${item.selected_size}`}
            </p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <span className="text-xs font-mono font-bold text-white">₹{(item.price * (item.quantity || item.qty))}</span>
          
          {String(order.status).toLowerCase() === 'delivered' && (
            <button
              onClick={() => openReviewForm(targetProductId)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-lime-accent text-royal-dark rounded-md hover:opacity-90 transition-opacity"
            >
              <Star className="w-3 h-3 fill-royal-dark" /> Review
            </button>
          )}
        </div>
      </div>
    );
  })}
</div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-white/40 uppercase tracking-wider">Total amount paid</span>
                      <span className="text-base font-black font-mono text-white">₹{Number(order.totalPrice || order.total_price).toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                      onClick={() => navigate(`/orders/track/${order.id}`)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg transition-all text-lime-accent hover:text-white"
                    >
                      Track Shipment 
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* --- REVIEW SUBMISSION OVERLAY DIALOG MODAL --- */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-md rounded-2xl p-6 relative text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Share Product Experience</h3>
              <button onClick={() => setReviewModalOpen(false)} className="p-1 rounded-lg bg-white/5 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={submitReview} className="space-y-4">
              {/* Stars selection panel */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-white/40">Product Rating Score</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button" key={num} onClick={() => setRating(num)}
                      className="transform hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${num <= rating ? 'text-lime-accent fill-lime-accent' : 'text-white/20'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-white/40">Written Comment / Review</label>
                <textarea
                  required rows="3" value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="How is the look, size, packaging and material premium quality?..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-lime-accent resize-none"
                />
              </div>

              {/* Dynamic review attachment handler */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-wider text-white/40">Attach Proof Media (Max 5)</label>
                <div className="flex flex-col items-center justify-center p-4 border border-dashed border-white/10 rounded-xl bg-white/[0.01] hover:border-white/20 relative cursor-pointer group">
                  <input type="file" multiple accept="image/*" onChange={handleReviewImageChange} disabled={previews.length >= 5} className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                  <Camera className="w-5 h-5 text-white/40 group-hover:text-lime-accent mb-1" />
                  <span className="text-[11px] text-white/50">Upload verification snapshots</span>
                </div>

                {previews.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {previews.map((previewImg, index) => (
                      <div key={index} className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                        <img src={previewImg} alt="Review Staging view" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeStagedReviewImage(index)} className="absolute top-0 right-0 bg-black/80 text-white p-0.5 rounded-full hover:bg-red-500">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                <button type="button" onClick={() => setReviewModalOpen(false)} className="px-4 py-2 rounded-xl text-xs uppercase font-bold bg-white/5 border border-white/10">Cancel</button>
                <button type="submit" disabled={isSubmittingReview} className="px-4 py-2 rounded-xl text-xs uppercase font-black bg-lime-accent text-royal-dark hover:opacity-95">
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

export default MyOrders;