import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Image as ImageIcon, Layers, Upload, X, ShoppingBag, Search } from 'lucide-react'
import { toast } from 'react-hot-toast'

const API_BANNER_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/banners`
const API_PRODUCTS_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`

const AppBanner = () => {
  const [banners, setBanners] = useState([])
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [selectedProductId, setSelectedProductId] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchBanners()
    fetchProducts()
  }, [])

  const fetchBanners = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_BANNER_URL)
      const data = await response.json()
      if (response.ok && data.success) {
        setBanners(data.banners)
      } else {
        toast.error(data.message || 'Failed to fetch active banners.')
      }
    } catch (err) {
      console.error('Network error:', err)
      toast.error('Network error. Could not connect to banner server.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_PRODUCTS_URL)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (err) {
      console.error('Failed to fetch product list:', err)
    }
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const clearSelectedImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!imageFile) {
      toast.error('Please select an image file to upload.')
      return
    }

    setIsSubmitting(true)
    const loadId = toast.loading('Uploading banner asset...')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('productId', selectedProductId || '')
    formData.append('image', imageFile)

    try {
      const response = await fetch(API_BANNER_URL, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('Banner published successfully!', { id: loadId })
        setTitle('')
        setSelectedProductId('')
        setProductSearch('')
        clearSelectedImage()
        fetchBanners()
      } else {
        toast.error(data.message || 'Failed to publish banner.', { id: loadId })
      }
    } catch (err) {
      console.error('Submission error:', err)
      toast.error('Network error while committing banner upload.', { id: loadId })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 text-xs p-1 text-left">
        <p className="font-bold text-white uppercase tracking-wider">Confirm Delete Operation?</p>
        <p className="text-white/60">Are you sure you want to permanently erase this banner asset?</p>
        <div className="flex gap-2 justify-end mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white font-medium uppercase tracking-wider text-[10px]"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              const loadId = toast.loading('Purging banner record...')
              try {
                const response = await fetch(`${API_BANNER_URL}/${id}`, {
                  method: 'DELETE',
                })
                const data = await response.json()

                if (response.ok && data.success) {
                  toast.success('Banner removed permanently.', { id: loadId })
                  fetchBanners()
                } else {
                  toast.error(data.message || 'Delete operation failed.', { id: loadId })
                }
              } catch (err) {
                console.error('Delete error:', err)
                toast.error('Network processing fault during removal.', { id: loadId })
              }
            }}
            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-wider text-[10px]"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: { background: '#111315', border: '1px solid rgba(255,255,255,0.1)' },
    })
  }

  // Filtered product array for search input
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category?.toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-royal-dark min-h-screen text-gray-canvas rounded-2xl max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 text-left">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">
          <span className="text-lime-400">App Banner</span> Management
        </h2>
        <p className="text-xs text-gray-canvas/50 font-medium mt-1">
          Upload promotional banners and directly link them to store products.
        </p>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-royal-main/40 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Banner Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">
              Banner Title / Tagline (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Diwali Special Mega Sale - 50% OFF"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-gray-canvas focus:outline-none focus:border-lime-accent"
            />
          </div>

          {/* Select Linked Product */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-lime-400">
              Link Target Product (Optional)
            </label>
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-canvas/40 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-royal-main/40 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-canvas focus:outline-none focus:border-lime-accent"
                />
              </div>

              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-royal-dark border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-canvas uppercase tracking-wider focus:outline-none focus:border-lime-accent transition-colors cursor-pointer"
              >
                <option value="">-- NO PRODUCT LINKED --</option>
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id} className="bg-royal-dark text-gray-canvas">
                    {p.name.toUpperCase()} (₹{p.offerPrice || p.offer_price}) - [{p.category}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Select File Image */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">
              Select Banner Asset Image *
            </label>
            
            <div className="relative border border-dashed border-white/15 rounded-xl p-4 bg-royal-main/20 hover:border-lime-accent/50 transition-colors flex items-center justify-center min-h-[50px] cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex items-center gap-2 text-xs text-gray-canvas/70 font-bold group-hover:text-lime-accent transition-colors">
                <Upload className="w-4 h-4 text-lime-400" />
                <span>{imageFile ? imageFile.name : 'Click or Drag to Upload Banner'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Image Preview */}
        {imagePreview && (
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] font-black uppercase tracking-wider text-lime-400 block">
              Staged Image Preview
            </span>
            <div className="relative max-w-md h-40 rounded-2xl border border-white/10 overflow-hidden bg-black/40">
              <img src={imagePreview} alt="Banner Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={clearSelectedImage}
                className="absolute top-2 right-2 bg-black/80 p-1.5 rounded-full hover:bg-red-500 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-lime-accent text-royal-dark hover:shadow-[0_4px_25px_rgba(165,206,0,0.35)] transition-all font-black disabled:opacity-50"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isSubmitting ? 'Publishing...' : 'Publish New Banner'}</span>
        </button>
      </form>

      {/* Live Banners Gallery */}
      <div className="space-y-4 border-t border-white/10 pt-6 text-left">
        <h3 className="text-xs font-black uppercase tracking-wider text-gray-canvas/60 flex items-center gap-2">
          <Layers className="w-4 h-4 text-lime-400" />
          <span>Active Banners Registry ({banners.length})</span>
        </h3>

        {isLoading ? (
          <div className="text-center py-12 text-xs font-mono text-lime-accent uppercase animate-pulse">
            Fetching active app banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-royal-main/10">
            <ImageIcon className="w-12 h-12 text-gray-canvas/20 mb-4" />
            <p className="text-sm font-bold uppercase tracking-wider text-gray-canvas/40">
              No Active Banners Found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-royal-main/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between backdrop-blur-sm shadow-xl hover:border-white/10 transition-all group"
              >
                <div className="h-44 w-full bg-royal-dark/60 relative overflow-hidden">
                  <img
                    src={banner.image_url}
                    alt={banner.title || 'App Banner'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Linked Product Badge Tag */}
                  {banner.product_name && (
                    <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest bg-lime-accent text-royal-dark border border-lime-accent px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <ShoppingBag className="w-3 h-3 text-royal-dark" />
                      <span>{banner.product_name}</span>
                    </span>
                  )}
                </div>

                <div className="p-4 flex items-center justify-between border-t border-white/5 bg-royal-dark/30">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-gray-canvas tracking-wide line-clamp-1">
                      {banner.title || 'Untitled Banner Asset'}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-canvas/40">
                      Uploaded: {new Date(banner.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppBanner