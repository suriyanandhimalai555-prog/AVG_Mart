import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Calendar, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-hot-toast'
import { EcommerceLoader } from '../components/EcommerceLoader'

const parseVariantList = (raw) => {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw.map((v) => String(v ?? '').trim()).filter(Boolean)
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.map((v) => String(v ?? '').trim()).filter(Boolean)
      }
    } catch {
      return trimmed
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    }
  }
  return []
}

// Returns true = product has sizes/colors, false = product has NO sizes/colors, null = unknown until product fetched
const getProductVariantRequirement = (item, productDetailsMap = {}) => {
  const existingSelection = String(item.selected_size ?? item.size ?? '').trim()
  if (existingSelection !== '') {
    return true
  }

  const directVariants = parseVariantList(
    item.sizes ??
      item.options ??
      item.variants ??
      item.available_sizes ??
      item.colors ??
      item.product_sizes
  )
  if (directVariants.length > 0) {
    return true
  }

  const prodId = item.product_id ?? item.productId
  const fetchedProduct = prodId ? productDetailsMap[prodId] : undefined

  if (fetchedProduct) {
    const fetchedVariants = parseVariantList(
      fetchedProduct.sizes ??
        fetchedProduct.options ??
        fetchedProduct.variants ??
        fetchedProduct.colors
    )
    return fetchedVariants.length > 0
  }

  // If no variant data is present on the cart item yet, mark as unknown so checkout can verify
  if (
    item.sizes === undefined &&
    item.options === undefined &&
    item.variants === undefined &&
    item.colors === undefined
  ) {
    return null
  }

  return false
}

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [productDetailsMap, setProductDetailsMap] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Processing...")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const baseUrl = import.meta.env.VITE_APP_BASE_URL

  const fetchSingleProductVariants = async (productId) => {
    if (!productId) return null
    if (productDetailsMap[productId]) return productDetailsMap[productId]

    try {
      const res = await fetch(`${baseUrl}/api/products/${productId}`)
      if (!res.ok) return null
      const data = await res.json()
      const prod = data.product || data.data || data
      if (prod && typeof prod === 'object') {
        setProductDetailsMap((prev) => ({ ...prev, [productId]: prod }))
        return prod
      }
    } catch (err) {
      console.error(`Failed fetching product ${productId} variants:`, err)
    }
    return null
  }

  useEffect(() => {
    if (!token) {
      toast.error("Your session has expired. Redirecting to login...", {
        duration: 3000
      })
      setTimeout(() => navigate("/login"), 1500)
      return
    }

    const fetchCartItemsFromDB = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${baseUrl}/api/auth/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data) ? data : data.cart || data.items || []
          const normalizedData = list.map((item) => ({
            ...item,
            selected_size: String(item.selected_size ?? item.size ?? '').trim()
          }))
          setCartItems(normalizedData)

          // Pre-check variant options for items without a selected size
          const missingSizeProductIds = [
            ...new Set(
              normalizedData
                .filter((i) => !i.selected_size && (i.product_id ?? i.productId))
                .map((i) => i.product_id ?? i.productId)
            )
          ]
          if (missingSizeProductIds.length > 0) {
            await Promise.all(missingSizeProductIds.map((pid) => fetchSingleProductVariants(pid)))
          }
        } else {
          toast.error("Failed to load your shopping cart.")
        }
      } catch (err) {
        console.error("Failed fetching live cart payload:", err)
        toast.error("Network error. Could not retrieve cart items.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCartItemsFromDB()
  }, [token, navigate, baseUrl])

  const updateQuantity = async (id, currentQty, adjustment) => {
    const targetQty = currentQty + adjustment
    if (targetQty < 1 && adjustment !== -1) return

    setActionLoading(true)
    setLoadingMessage(targetQty <= 0 ? "Removing Item..." : "Updating Item Quantity...")

    try {
      const res = await fetch(`${baseUrl}/api/auth/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: targetQty })
      })

      if (res.ok) {
        if (targetQty <= 0) {
          setCartItems((prev) => prev.filter((item) => item.id !== id))
          toast.success("Item removed from cart.")
        } else {
          setCartItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity: targetQty } : item))
          )
          toast.success("Cart updated successfully.")
        }
      } else {
        toast.error("Could not update item quantity.")
      }
    } catch (err) {
      console.error("Quantity update error:", err)
      toast.error("Network problem. Cart update failed.")
    } finally {
      setActionLoading(false)
    }
  }

  const removeItem = async (id) => {
    setActionLoading(true)
    setLoadingMessage("Removing Item from Cart...")

    try {
      const res = await fetch(`${baseUrl}/api/auth/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item.id !== id))
        toast.success("Item deleted successfully.")
      } else {
        toast.error("Could not remove the item.")
      }
    } catch (err) {
      console.error("Remove item fault:", err)
      toast.error("Network problem. Item removal failed.")
    } finally {
      setActionLoading(false)
    }
  }

  const calculateDefaultEstimatedArrival = () => {
    try {
      const parsedDate = new Date()
      parsedDate.setDate(parsedDate.getDate() + 6)
      const targetDay = String(parsedDate.getDate()).padStart(2, '0')
      const targetMonth = String(parsedDate.getMonth() + 1).padStart(2, '0')
      const targetYear = parsedDate.getFullYear()
      return `${targetDay}/${targetMonth}/${targetYear}`
    } catch {
      return 'Within 6 Days'
    }
  }

  const handleProceedToCheckout = async () => {
    if (cartItems.some((item) => !item.quantity || item.quantity <= 0)) {
      toast.error("Invalid item quantity in cart.")
      return
    }

    setActionLoading(true)
    setLoadingMessage("Checking product options...")

    try {
      const updatedMap = { ...productDetailsMap }

      // Fetch product details for any item that lacks a selected option and isn't cached yet
      const idsToLookup = [
        ...new Set(
          cartItems
            .filter((item) => {
              const activeOption = String(item.selected_size ?? item.size ?? '').trim()
              if (activeOption !== '') return false
              const reqStatus = getProductVariantRequirement(item, updatedMap)
              const pid = item.product_id ?? item.productId
              return reqStatus === null && pid && !updatedMap[pid]
            })
            .map((item) => item.product_id ?? item.productId)
        )
      ]

      if (idsToLookup.length > 0) {
        await Promise.all(
          idsToLookup.map(async (pid) => {
            try {
              const res = await fetch(`${baseUrl}/api/products/${pid}`)
              if (res.ok) {
                const data = await res.json()
                const prod = data.product || data.data || data
                if (prod && typeof prod === 'object') {
                  updatedMap[pid] = prod
                }
              }
            } catch (err) {
              console.error(`Error verifying product ${pid}:`, err)
            }
          })
        )
        setProductDetailsMap(updatedMap)
      }

      const invalidItem = cartItems.find((item) => {
        const activeOption = String(item.selected_size ?? item.size ?? '').trim()
        const hasVariants = getProductVariantRequirement(item, updatedMap) === true
        return hasVariants && activeOption === ''
      })

      if (invalidItem) {
        toast.error(
          `Please click on "${invalidItem.name}" to select its size/color option before checking out.`,
          { duration: 4000 }
        )
        return
      }

      navigate('/checkout', { state: { subtotal } })
    } finally {
      setActionLoading(false)
    }
  }

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 text-gray-900 min-h-screen py-8 px-4 md:px-8 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* BREADCRUMB & PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-1">
                <span onClick={() => navigate('/')} className="hover:text-black cursor-pointer">Home</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-800">Shopping Cart</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Shopping Cart
              </h1>
            </div>

            <span className="text-xs font-bold text-gray-500">
              Total Items: <strong className="text-gray-900">{cartItems.length}</strong>
            </span>
          </div>

          {isLoading ? (
            <div className="relative min-h-[400px] border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
              <EcommerceLoader message="Loading Cart Items..." />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center mx-auto text-gray-400">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-800">Your Cart is Empty</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                  Looks like you haven't added anything to your cart yet.
                </p>
              </div>
              <Link to="/allproducts" className="inline-flex bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* LEFT CART ITEMS LIST */}
              <div className="lg:col-span-8 space-y-3 relative overflow-hidden">
                {actionLoading && <EcommerceLoader message={loadingMessage} />}

                {cartItems.map((item) => {
                  const activeSizeValue = String(item.selected_size ?? item.size ?? '').trim()
                  const hasVariants = getProductVariantRequirement(item, productDetailsMap) === true

                  return (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left">

                      <div
                        onClick={() => navigate(`/product/${item.product_id ?? item.productId}`, {
                          state: { fromCartItemId: item.id, existingSize: activeSizeValue, existingQty: item.quantity }
                        })}
                        className="flex items-center gap-3.5 w-full sm:w-auto cursor-pointer group flex-1"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 p-1 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-black">{item.name}</h3>

                          {/* VARIANT TAG */}
                          {activeSizeValue !== '' ? (
                            <div className="pt-0.5">
                              <span className="inline-block text-[10px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded">
                                Selected: {activeSizeValue}
                              </span>
                            </div>
                          ) : hasVariants ? (
                            <div className="pt-0.5">
                              <span className="inline-block text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded animate-pulse">
                                Re-select Size / Color Required
                              </span>
                            </div>
                          ) : null}

                          <p className="text-xs font-bold text-gray-900">₹{Number(item.price).toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      {/* CONTROLS */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0">
                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                          <button
                            disabled={actionLoading}
                            onClick={() => updateQuantity(item.id, item.quantity, -1)}
                            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold px-3 min-w-[28px] text-center text-gray-900">{item.quantity}</span>
                          <button
                            disabled={actionLoading}
                            onClick={() => updateQuantity(item.id, item.quantity, 1)}
                            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-gray-900">₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}</p>
                        </div>

                        <button
                          disabled={actionLoading}
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* RIGHT ORDER SUMMARY PANEL */}
              <div className="lg:col-span-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-5">
                <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 border-b border-gray-100 pb-3">Order Summary</h3>

                <div className="space-y-2.5 text-xs text-gray-600 font-medium border-b border-gray-100 pb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery</span>
                    <span className="text-emerald-600 uppercase text-[10px] font-extrabold bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Estimated Delivery:</span>
                  <span className="font-bold text-gray-900">{calculateDefaultEstimatedArrival()}</span>
                </div>

                <div className="flex justify-between items-baseline border-t border-gray-100 pt-3">
                  <span className="text-xs font-black uppercase text-gray-900">Total</span>
                  <span
                    className="inline-flex items-center justify-center text-white font-black px-1.5 py-0.5 text-2xl tracking-tight rounded-xl border-2 border-[#123815]"
                    style={{
                      backgroundColor: '#A5CE00',
                      boxShadow: '3px 3px 0px 0px #123815',
                    }}
                  >
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  disabled={actionLoading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#A5CE00] hover:bg-[#8DA800] text-white py-3.5 px-6 font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-semibold tracking-wider uppercase pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Safe & Secure Checkout
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Cart