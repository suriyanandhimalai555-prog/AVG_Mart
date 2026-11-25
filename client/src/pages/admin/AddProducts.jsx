import React, { useState, useEffect, useMemo } from 'react'
import {
  Plus,
  X,
  Eye,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Layers,
  Star,
  CheckCircle2,
  Clock,
  Store,
  ShieldCheck,
  Search,
  Package,
  Tag,
  SlidersHorizontal,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`
const API_CAT_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

const getSellerMeta = (product) => {
  const sellerObj = product.seller || product.sellerInfo || null
  const sellerId = product.sellerId ?? product.seller_id ?? sellerObj?.id ?? null

  const ownerName =
    product.ownerName ||
    product.owner_name ||
    sellerObj?.owner_name ||
    sellerObj?.ownerName ||
    null

  const storeName =
    product.storeName ||
    product.store_name ||
    sellerObj?.store_name ||
    sellerObj?.storeName ||
    null

  const sellerEmail =
    product.sellerEmail ||
    product.seller_email ||
    product.email ||
    sellerObj?.email ||
    null

  const sellerPhone =
    product.sellerPhone ||
    product.seller_phone ||
    product.phone ||
    sellerObj?.phone ||
    null

  const pickupLine =
    product.pickupAddress ||
    product.pickup_address ||
    product.address ||
    sellerObj?.pickup_address ||
    sellerObj?.address ||
    null

  const city = product.city || sellerObj?.city || null
  const state = product.state || sellerObj?.state || null
  const pincode = product.pincode || sellerObj?.pincode || null

  const sellerAddress =
    product.sellerAddress ||
    [pickupLine, city, state, pincode].filter(Boolean).join(', ') ||
    null

  const isSellerProduct = Boolean(
    sellerId || ownerName || storeName || sellerEmail || sellerPhone || sellerAddress
  )

  return {
    isSellerProduct,
    sellerId,
    sellerName: isSellerProduct
      ? ownerName || storeName || `Seller #${sellerId}`
      : 'AVG MART Admin',
    ownerName,
    storeName,
    sellerEmail,
    sellerPhone,
    sellerAddress
  }
}

const AddProducts = () => {
  const [products, setProducts] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Filter & search states
  const [sourceFilter, setSourceFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal & inspection states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProductId, setCurrentProductId] = useState(null)
  const [viewProduct, setViewProduct] = useState(null)

  // Form input states
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [branchAdminPrice, setBranchAdminPrice] = useState('')
  const [count, setCount] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)

  // Images & variants state
  const [baseRawFiles, setBaseRawFiles] = useState([])
  const [baseImages, setBaseImages] = useState([])
  const [colorSpecificFiles, setColorSpecificFiles] = useState({})
  const [selectedSpecOptions, setSelectedSpecOptions] = useState([])
  const [customTextInputs, setCustomTextInputs] = useState({})

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (viewProduct) setViewProduct(null)
        else if (isModalOpen) setIsModalOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [viewProduct, isModalOpen])

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_CAT_URL)
      if (response.ok) {
        const data = await response.json()
        setAvailableCategories(Array.isArray(data) ? data : data.categories || [])
      }
    } catch (err) {
      console.error('Failed fetching categories:', err)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(API_BASE_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      })
      if (response.ok) {
        const data = await response.json()
        const list = Array.isArray(data) ? data : data.products || []
        setProducts(list)
      } else {
        toast.error('Failed to load products from database.')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      toast.error('Network error while fetching products.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewTrigger = async (product) => {
    const productId = typeof product === 'object' ? product.id : product
    const fallbackProduct = typeof product === 'object' ? product : null
    const loadId = toast.loading('Loading full product details...')

    try {
      const response = await fetch(`${API_BASE_URL}/${productId}`)
      const resData = await response.json()

      if (response.ok) {
        const fetched = resData.product || resData.data || resData
        toast.dismiss(loadId)
        setViewProduct({
          ...(fallbackProduct || {}),
          ...(typeof fetched === 'object' && !Array.isArray(fetched) ? fetched : {})
        })
      } else {
        toast.dismiss(loadId)
        if (fallbackProduct) {
          setViewProduct(fallbackProduct)
        } else {
          toast.error(resData.message || 'Failed to load product details.')
        }
      }
    } catch (err) {
      console.error('Error fetching single product:', err)
      toast.dismiss(loadId)
      if (fallbackProduct) {
        setViewProduct(fallbackProduct)
      } else {
        toast.error('Network error while loading product details.')
      }
    }
  }

  const handleApproveTrigger = async (productId) => {
    const loadId = toast.loading('Approving product...')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/${productId}/approve`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const resData = await response.json()

      if (response.ok) {
        toast.success(resData.message || 'Product approved & live!', { id: loadId })
        fetchProducts()
        if (viewProduct?.id === productId) {
          setViewProduct((prev) => ({ ...prev, is_approved: true, isApproved: true }))
        }
      } else {
        toast.error(resData.message || 'Failed to approve product.', { id: loadId })
      }
    } catch (err) {
      console.error('Error approving product:', err)
      toast.error('Network error during approval.', { id: loadId })
    }
  }

  const handleBaseImageUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setBaseRawFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBaseImages((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
    toast.success(`${files.length} image(s) added.`)
  }

  const resetForm = () => {
    setCategory('')
    setName('')
    setDescription('')
    setOriginalPrice('')
    setOfferPrice('')
    setBranchAdminPrice('')
    setCount('')
    setIsFeatured(false)
    setBaseImages([])
    setBaseRawFiles([])
    setColorSpecificFiles({})
    setIsEditing(false)
    setCurrentProductId(null)
    setSelectedSpecOptions([])
    setCustomTextInputs({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const hasColorImages = Object.values(colorSpecificFiles).some((arr) => arr && arr.length > 0)
    if (baseRawFiles.length === 0 && !hasColorImages && !isEditing) {
      toast.error('Please upload at least one product image.')
      return
    }

    const actionToastId = toast.loading(isEditing ? 'Updating product...' : 'Publishing product...')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('category', category)
    formData.append('description', description)
    formData.append('originalPrice', originalPrice)
    formData.append('offerPrice', offerPrice)
    formData.append('branchAdminPrice', branchAdminPrice || '0')
    formData.append('count', count || '0')
    formData.append('isFeatured', isFeatured)

    const trackingUploadFiles = [...baseRawFiles]
    const activeColorKeys = Object.keys(colorSpecificFiles).filter((key) =>
      selectedSpecOptions.includes(key)
    )

    const colorIndexOffsetMap = {}
    let runningIndexSum = baseRawFiles.length

    activeColorKeys.forEach((colorKey) => {
      const filesForColor = colorSpecificFiles[colorKey] || []
      if (filesForColor.length > 0) {
        colorIndexOffsetMap[colorKey] = runningIndexSum
        filesForColor.forEach((file) => {
          trackingUploadFiles.push(file)
          runningIndexSum++
        })
      }
    })

    if (trackingUploadFiles.length > 15) {
      toast.dismiss(actionToastId)
      toast.error('Maximum 15 images allowed per product.')
      return
    }

    trackingUploadFiles.forEach((file) => {
      formData.append('productImages', file)
    })

    const finalPayloadSpecs = []
    selectedSpecOptions.forEach((item) => {
      if (item.startsWith('Color: ')) {
        finalPayloadSpecs.push(`${item}__imgIdx:${colorIndexOffsetMap[item] ?? 0}`)
      } else {
        finalPayloadSpecs.push(item)
      }
    })

    Object.keys(customTextInputs).forEach((key) => {
      if (customTextInputs[key]?.trim()) {
        finalPayloadSpecs.push(`${key}: ${customTextInputs[key].trim()}`)
      }
    })

    formData.append('sizes', JSON.stringify(finalPayloadSpecs))

    try {
      const token = localStorage.getItem('token')
      const url = isEditing ? `${API_BASE_URL}/${currentProductId}` : API_BASE_URL
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        toast.success(isEditing ? 'Product updated successfully!' : 'Product added successfully!', {
          id: actionToastId
        })
        setIsModalOpen(false)
        resetForm()
        fetchProducts()
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData.message || 'Operation failed.', { id: actionToastId })
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Network error while saving product.', { id: actionToastId })
    }
  }

  const handleEditTrigger = (product) => {
    setCurrentProductId(product.id)
    setName(product.name || '')
    setCategory(product.category || '')
    setDescription(product.description || '')
    setOriginalPrice(product.original_price ?? product.originalPrice ?? '')
    setOfferPrice(product.offer_price ?? product.offerPrice ?? '')
    setBranchAdminPrice(product.branch_admin_price ?? product.branchAdminPrice ?? '')
    setCount(product.count ?? '')
    setIsFeatured(Boolean(product.is_featured ?? product.isFeatured))

    setBaseImages(Array.isArray(product.images) ? product.images : [])
    setBaseRawFiles([])

    const initialChecked = []
    const initialTexts = {}

    if (Array.isArray(product.sizes)) {
      product.sizes.forEach((item) => {
        if (item.includes('__imgIdx:')) {
          initialChecked.push(item.split('__imgIdx:')[0])
        } else if (item.includes(': ')) {
          const parts = item.split(': ')
          const label = parts[0]
          const val = parts.slice(1).join(': ')
          if (label === 'Color') {
            initialChecked.push(item)
          } else {
            initialTexts[label] = val
          }
        } else {
          initialChecked.push(item)
        }
      })
    }

    setSelectedSpecOptions(initialChecked)
    setCustomTextInputs(initialTexts)
    setColorSpecificFiles({})
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2.5 text-xs p-1 text-left">
          <p className="font-bold text-white">Delete this product?</p>
          <p className="text-white/60 text-[11px]">This action cannot be undone.</p>
          <div className="flex gap-2 justify-end pt-1">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-[11px] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                toast.dismiss(t.id)
                const execId = toast.loading('Deleting product...')
                try {
                  const token = localStorage.getItem('token')
                  const response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                  })
                  if (response.ok) {
                    toast.success('Product deleted.', { id: execId })
                    if (viewProduct?.id === id) setViewProduct(null)
                    fetchProducts()
                  } else {
                    toast.error('Could not delete product.', { id: execId })
                  }
                } catch {
                  toast.error('Network error while deleting.', { id: execId })
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 6000,
        position: 'top-center',
        style: { background: '#151922', border: '1px solid rgba(255,255,255,0.12)' }
      }
    )
  }

  const { adminCount, sellerCount, filteredProducts } = useMemo(() => {
    let adminTotal = 0
    let sellerTotal = 0

    products.forEach((p) => {
      if (getSellerMeta(p).isSellerProduct) sellerTotal += 1
      else adminTotal += 1
    })

    const q = searchQuery.trim().toLowerCase()
    const filtered = products.filter((p) => {
      const meta = getSellerMeta(p)
      if (sourceFilter === 'seller' && !meta.isSellerProduct) return false
      if (sourceFilter === 'admin' && meta.isSellerProduct) return false

      if (!q) return true
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        meta.sellerName.toLowerCase().includes(q) ||
        (meta.storeName || '').toLowerCase().includes(q) ||
        (meta.sellerEmail || '').toLowerCase().includes(q) ||
        (meta.sellerPhone || '').toLowerCase().includes(q) ||
        (meta.sellerAddress || '').toLowerCase().includes(q)
      )
    })

    return { adminCount: adminTotal, sellerCount: sellerTotal, filteredProducts: filtered }
  }, [products, sourceFilter, searchQuery])

  const renderProductCard = (product) => {
    const meta = getSellerMeta(product)
    const isApproved = Boolean(product.is_approved ?? product.isApproved)
    const isFeaturedItem = Boolean(product.is_featured ?? product.isFeatured)
    const offer = product.offer_price ?? product.offerPrice ?? 0
    const original = product.original_price ?? product.originalPrice ?? 0
    const stock = product.count ?? 0

    return (
      <div
        key={product.id}
        className="bg-royal-main/35 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-lime-400/40 transition-all duration-200"
      >
        <div>
          {/* Image Header */}
          <div className="h-44 w-full bg-royal-dark/70 relative overflow-hidden">
            <img
              src={
                product.images?.[0] ||
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Top Left: Source Badge */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {meta.isSellerProduct ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/90 text-slate-950 shadow">
                  <Store className="w-3 h-3" /> Seller Added
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-lime-400 text-slate-950 shadow">
                  <ShieldCheck className="w-3 h-3" /> Admin Added
                </span>
              )}
            </div>

            {/* Top Right: Approval Status */}
            <div className="absolute top-3 right-3">
              {isApproved ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white shadow">
                  <CheckCircle2 className="w-3 h-3" /> Live
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-400/95 text-slate-950 shadow">
                  <Clock className="w-3 h-3" /> Pending
                </span>
              )}
            </div>

            {isFeaturedItem && (
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/85 text-lime-400 border border-lime-400/30">
                <Star className="w-3 h-3 fill-lime-400 text-lime-400" /> Featured
              </span>
            )}
          </div>

          {/* Card Body */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-lime-400/90 bg-lime-400/10 px-2.5 py-0.5 rounded-md">
                {product.category || 'Uncategorized'}
              </span>
              <span className="text-[11px] text-gray-canvas/60 font-mono">
                Stock: <strong className="text-gray-canvas">{stock}</strong>
              </span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-gray-canvas line-clamp-1">{product.name}</h4>
              <p className="text-xs text-gray-canvas/55 line-clamp-2 mt-1">
                {product.description || 'No description provided.'}
              </p>
            </div>

            {/* Seller Attribution, Contact & Address Box */}
            <div className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="text-[10px] uppercase tracking-wider text-gray-canvas/45 block">
                    {meta.isSellerProduct ? 'Seller (Owner)' : 'Added By'}
                  </span>
                  <span className="font-semibold text-gray-canvas truncate block">
                    {meta.sellerName}
                    {meta.storeName ? ` • ${meta.storeName}` : ''}
                  </span>
                </div>
                {meta.sellerId && (
                  <span className="text-[10px] font-mono text-gray-canvas/50 shrink-0">
                    #{meta.sellerId}
                  </span>
                )}
              </div>

              {meta.isSellerProduct && (
                <div className="pt-1.5 border-t border-white/10 space-y-1 text-[11px] text-gray-canvas/75">
                  {meta.sellerPhone && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="font-mono">{meta.sellerPhone}</span>
                    </div>
                  )}
                  {meta.sellerEmail && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 text-amber-300 shrink-0" />
                      <span className="truncate">{meta.sellerEmail}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">
                      {meta.sellerAddress || 'Address not provided'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-base font-extrabold font-mono text-lime-400">
                ₹{Number(offer).toLocaleString('en-IN')}
              </span>
              {Number(original) > Number(offer) && (
                <span className="text-xs font-mono text-gray-canvas/45 line-through">
                  ₹{Number(original).toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 border-t border-white/10 bg-royal-dark/30 flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleViewTrigger(product)}
            className="flex-1 min-w-[72px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-gray-canvas transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          {!isApproved && (
            <button
              onClick={() => handleApproveTrigger(product.id)}
              className="flex-1 min-w-[82px] flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          )}

          <button
            onClick={() => handleEditTrigger(product)}
            className="p-2 rounded-xl border border-sky-400/25 bg-sky-400/10 text-sky-300 hover:bg-sky-400/20 transition cursor-pointer"
            title="Edit Product"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => handleDelete(product.id)}
            className="p-2 rounded-xl border border-red-400/25 bg-red-400/10 text-red-300 hover:bg-red-400/20 transition cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-royal-dark min-h-screen text-gray-canvas rounded-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            <span className="text-lime-400">Product</span> Inventory & Approvals
          </h2>
          <p className="text-xs sm:text-sm text-gray-canvas/60 mt-1">
            View admin and seller products separately, review seller submissions, and inspect full details.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter Tabs + Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-royal-main/30 border border-white/10">
          <button
            onClick={() => setSourceFilter('all')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              sourceFilter === 'all'
                ? 'bg-lime-400 text-slate-950 font-bold'
                : 'text-gray-canvas/70 hover:text-white'
            }`}
          >
            All ({products.length})
          </button>
          <button
            onClick={() => setSourceFilter('admin')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              sourceFilter === 'admin'
                ? 'bg-lime-400 text-slate-950 font-bold'
                : 'text-gray-canvas/70 hover:text-white'
            }`}
          >
            Admin Added ({adminCount})
          </button>
          <button
            onClick={() => setSourceFilter('seller')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              sourceFilter === 'seller'
                ? 'bg-sky-400 text-slate-950 font-bold'
                : 'text-gray-canvas/70 hover:text-white'
            }`}
          >
            Seller Added ({sellerCount})
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-canvas/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product, seller, phone, email..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-royal-main/30 border border-white/10 text-xs text-gray-canvas placeholder:text-gray-canvas/40 focus:outline-none focus:border-lime-400"
          />
        </div>
      </div>

      {/* Product Listings */}
      {isLoading ? (
        <div className="text-center py-20 text-xs font-mono tracking-wider text-lime-400 uppercase animate-pulse">
          Loading Products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/15 rounded-2xl bg-royal-main/15">
          <Layers className="w-10 h-10 text-gray-canvas/25 mb-3" />
          <p className="text-sm font-semibold text-gray-canvas/60">No matching products found</p>
          <p className="text-xs text-gray-canvas/40 mt-1">
            Try switching filters or clearing your search query.
          </p>
        </div>
      ) : sourceFilter === 'all' ? (
        <div className="space-y-10">
          {/* Seller Products Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm sm:text-base font-bold text-gray-canvas">
                  Seller Added Products
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-400/15 text-sky-300 font-semibold">
                  {filteredProducts.filter((p) => getSellerMeta(p).isSellerProduct).length}
                </span>
              </div>
            </div>

            {filteredProducts.filter((p) => getSellerMeta(p).isSellerProduct).length === 0 ? (
              <p className="text-xs text-gray-canvas/50 py-4">No seller products in this view.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts
                  .filter((p) => getSellerMeta(p).isSellerProduct)
                  .map(renderProductCard)}
              </div>
            )}
          </section>

          {/* Admin Products Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-lime-400" />
                <h3 className="text-sm sm:text-base font-bold text-gray-canvas">
                  Admin Added Products
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-lime-400/15 text-lime-300 font-semibold">
                  {filteredProducts.filter((p) => !getSellerMeta(p).isSellerProduct).length}
                </span>
              </div>
            </div>

            {filteredProducts.filter((p) => !getSellerMeta(p).isSellerProduct).length === 0 ? (
              <p className="text-xs text-gray-canvas/50 py-4">No admin products in this view.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts
                  .filter((p) => !getSellerMeta(p).isSellerProduct)
                  .map(renderProductCard)}
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map(renderProductCard)}
        </div>
      )}

      {/* --- ADD / EDIT PRODUCT POPUP --- */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#141923] border border-white/15 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] text-left overflow-hidden"
          >
            {/* Popup Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#181f2c]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center text-lime-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {isEditing ? 'Edit Product Details' : 'Add New Product'}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {isEditing
                      ? 'Update pricing, stock, images, or product information.'
                      : 'Fill out product details and upload images to publish.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Popup Body */}
            <form id="productForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Elite Sports Shoes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0f131b] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200">Category *</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0f131b] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400 cursor-pointer"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {availableCategories.map((cat) => (
                      <option key={cat.id || cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-200">Description</label>
                <textarea
                  rows="3"
                  placeholder="Write product details, material, warranty, or highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0f131b] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-lime-400 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-200">
                  Product Images {!isEditing && '*'}
                </label>
                <div className="flex flex-col items-center justify-center p-5 border border-dashed border-white/20 rounded-xl bg-[#0f131b]/70 hover:border-lime-400/50 relative cursor-pointer transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBaseImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="w-6 h-6 text-lime-400/80 mb-1.5" />
                  <span className="text-xs font-medium text-gray-200">
                    Click to upload product images (up to 15)
                  </span>
                </div>

                {baseImages.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {baseImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-16 h-16 rounded-xl border border-white/15 overflow-hidden bg-black/40"
                      >
                        <img src={img} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            setBaseImages((prev) => prev.filter((_, i) => i !== idx))
                            setBaseRawFiles((prev) => prev.filter((_, i) => i !== idx))
                          }}
                          className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 rounded-full p-0.5 text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200">Original Price *</label>
                  <input
                    type="number"
                    required
                    placeholder="2499"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-[#0f131b] border border-white/15 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200">Offer Price *</label>
                  <input
                    type="number"
                    required
                    placeholder="1899"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full bg-[#0f131b] border border-white/15 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200">Branch Price *</label>
                  <input
                    type="number"
                    required
                    placeholder="1350"
                    value={branchAdminPrice}
                    onChange={(e) => setBranchAdminPrice(e.target.value)}
                    className="w-full bg-[#0f131b] border border-white/15 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200">Stock Count *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="50"
                    value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="w-full bg-[#0f131b] border border-white/15 rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-lime-400"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0f131b] border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-lime-400 rounded cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-medium text-gray-200">
                  Mark as Featured Product
                </span>
              </label>
            </form>

            {/* Popup Footer */}
            <div className="border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3 bg-[#181f2c]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                form="productForm"
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 transition cursor-pointer"
              >
                {isEditing ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- FULL PRODUCT DETAILS POPUP --- */}
      {viewProduct && (() => {
        const meta = getSellerMeta(viewProduct)
        const isApproved = Boolean(viewProduct.is_approved ?? viewProduct.isApproved)
        const isFeaturedItem = Boolean(viewProduct.is_featured ?? viewProduct.isFeatured)
        const original = Number(viewProduct.original_price ?? viewProduct.originalPrice ?? 0)
        const offer = Number(viewProduct.offer_price ?? viewProduct.offerPrice ?? 0)
        const branchPrice = Number(viewProduct.branch_admin_price ?? viewProduct.branchAdminPrice ?? 0)
        const discountPct =
          original > 0 && offer < original
            ? Math.round(((original - offer) / original) * 100)
            : 0

        const cleanSpecs = Array.isArray(viewProduct.sizes)
          ? viewProduct.sizes.map((s) => String(s).split('__imgIdx:')[0])
          : []

        return (
          <div
            onClick={() => setViewProduct(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#141923] border border-white/15 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] text-left overflow-hidden"
            >
              {/* Popup Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-4 bg-[#181f2c]">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {meta.isSellerProduct ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-400/15 text-sky-300 border border-sky-400/30">
                        <Store className="w-3 h-3" /> Seller Added
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-lime-400/15 text-lime-300 border border-lime-400/30">
                        <ShieldCheck className="w-3 h-3" /> Admin Added
                      </span>
                    )}

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        isApproved
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      {isApproved ? 'Live on Store' : 'Pending Approval'}
                    </span>

                    {isFeaturedItem && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-400/15 text-purple-300 border border-purple-400/30">
                        <Star className="w-3 h-3 fill-purple-300" /> Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-white">{viewProduct.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Product ID: <span className="font-mono text-gray-200">#{viewProduct.id}</span> •
                    Category: <span className="text-lime-400 font-semibold">{viewProduct.category}</span>
                  </p>
                </div>

                <button
                  onClick={() => setViewProduct(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                  aria-label="Close product details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Popup Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Images */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-lime-400" /> Product Images (
                    {viewProduct.images?.length || 0})
                  </h4>
                  {viewProduct.images && viewProduct.images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {viewProduct.images.map((img, idx) => (
                        <a
                          key={idx}
                          href={img}
                          target="_blank"
                          rel="noreferrer"
                          className="group block rounded-xl overflow-hidden border border-white/10 bg-[#0f131b] aspect-square"
                        >
                          <img
                            src={img}
                            alt={`${viewProduct.name} ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">No images available.</p>
                  )}
                </div>

                {/* Seller / Source Information */}
                <div className="p-4 rounded-xl bg-[#0f131b] border border-white/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-sky-400" /> Source & Seller Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block">
                        {meta.isSellerProduct ? 'Seller Name (Owner)' : 'Created By'}
                      </span>
                      <span className="font-semibold text-white">{meta.sellerName}</span>
                    </div>
                    {meta.storeName && (
                      <div>
                        <span className="text-gray-400 block">Store Name</span>
                        <span className="font-semibold text-white">{meta.storeName}</span>
                      </div>
                    )}
                    {meta.sellerId && (
                      <div>
                        <span className="text-gray-400 block">Seller ID</span>
                        <span className="font-mono text-gray-200">#{meta.sellerId}</span>
                      </div>
                    )}
                    {meta.isSellerProduct && (
                      <>
                        <div>
                          <span className="text-gray-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" /> Phone Number
                          </span>
                          <span className="font-mono text-gray-200">
                            {meta.sellerPhone || 'Not provided'}
                          </span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-amber-300" /> Email ID
                          </span>
                          <span className="text-gray-200">
                            {meta.sellerEmail || 'Not provided'}
                          </span>
                        </div>
                        <div className="sm:col-span-2 pt-2 border-t border-white/10">
                          <span className="text-gray-400 flex items-center gap-1 mb-0.5">
                            <MapPin className="w-3.5 h-3.5 text-sky-400" /> Pickup / Seller Address
                          </span>
                          <span className="text-gray-200 leading-relaxed block">
                            {meta.sellerAddress || 'No address added for this seller'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#0f131b] border border-white/10">
                    <span className="text-[11px] text-gray-400 block">Offer Price</span>
                    <span className="text-base font-extrabold font-mono text-lime-400">
                      ₹{offer.toLocaleString('en-IN')}
                    </span>
                    {discountPct > 0 && (
                      <span className="ml-1.5 text-[11px] font-semibold text-emerald-400">
                        ({discountPct}% OFF)
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0f131b] border border-white/10">
                    <span className="text-[11px] text-gray-400 block">Original Price</span>
                    <span className="text-base font-bold font-mono text-gray-200">
                      ₹{original.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0f131b] border border-white/10">
                    <span className="text-[11px] text-gray-400 block">Branch Price</span>
                    <span className="text-base font-bold font-mono text-gray-200">
                      ₹{branchPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0f131b] border border-white/10">
                    <span className="text-[11px] text-gray-400 block">Available Stock</span>
                    <span className="text-base font-bold font-mono text-white flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-lime-400" />
                      {viewProduct.count ?? 0}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-lime-400" /> Description
                  </h4>
                  <p className="text-sm text-gray-200 leading-relaxed bg-[#0f131b] border border-white/10 rounded-xl p-4">
                    {viewProduct.description || 'No description provided for this product.'}
                  </p>
                </div>

                {/* Variants / Specifications */}
                {cleanSpecs.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-lime-400" /> Variants &
                      Specifications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cleanSpecs.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-[#0f131b] border border-white/10 text-gray-200"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created Date */}
                {(viewProduct.created_at || viewProduct.createdAt) && (
                  <div className="text-xs text-gray-400 pt-1">
                    Created:{' '}
                    <span className="text-gray-200">
                      {new Date(viewProduct.created_at || viewProduct.createdAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Popup Footer Actions */}
              <div className="border-t border-white/10 px-6 py-4 flex flex-wrap items-center justify-between gap-3 bg-[#181f2c]">
                <button
                  onClick={() => handleDelete(viewProduct.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>

                <div className="flex items-center gap-2.5">
                  {!isApproved && (
                    <button
                      onClick={() => handleApproveTrigger(viewProduct.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Product
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const target = viewProduct
                      setViewProduct(null)
                      handleEditTrigger(target)
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-400/15 hover:bg-sky-400/25 text-sky-300 border border-sky-400/30 transition cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => setViewProduct(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}

export default AddProducts