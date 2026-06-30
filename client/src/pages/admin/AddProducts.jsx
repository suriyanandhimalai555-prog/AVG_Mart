import React, { useState, useEffect } from 'react'
import { Plus, X, Eye, Edit2, Trash2, Image, Layers, Package, Star } from 'lucide-react'
import { toast } from 'react-hot-toast' 

const API_BASE_URL = 'http://localhost:5000/api/products'

const AddProducts = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Dialog and popup controls state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProductId, setCurrentProductId] = useState(null)
  const [viewProduct, setViewProduct] = useState(null) 

  // Form input field states
  const [category, setCategory] = useState('')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [branchAdminPrice, setBranchAdminPrice] = useState('') // <-- Added state hook
  const [count, setCount] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  
  const [images, setImages] = useState([])       
  const [rawFiles, setRawFiles] = useState([])   

  const tshirtSizes = ['S', 'M', 'L', 'XL']
  const shoeSizes = ['7', '8', '9', '10', '11', '12']

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_BASE_URL)
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        toast.error("Failed to sync inventory from the database.")
      }
    } catch (err) {
      console.error("Network communication line breakdown matching data pipelines:", err)
      toast.error("Network error. Could not connect to product servers.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setRawFiles((prevFiles) => [...prevFiles, ...files])
    
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result])
      }
      reader.readAsDataURL(file)
    })
    toast.success(`${files.length} image(s) staged successfully.`)
  }

  const removeUploadedImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove))
    setRawFiles(rawFiles.filter((_, index) => index !== indexToRemove))
    toast.success("Image staging removed.")
  }

  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }

  const resetForm = () => {
    setCategory('')
    setSelectedSizes([])
    setName('')
    setDescription('')
    setOriginalPrice('')
    setOfferPrice('')
    setBranchAdminPrice('') // <-- Added reset action
    setCount('')
    setIsFeatured(false)
    setImages([])
    setRawFiles([])
    setIsEditing(false)
    setCurrentProductId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }

    const actionToastId = toast.loading(isEditing ? "Updating product record..." : "Publishing new product...");
    
    const formData = new FormData()
    formData.append('name', name)
    formData.append('category', category)
    formData.append('description', description)
    formData.append('originalPrice', originalPrice)
    formData.append('offerPrice', offerPrice)
    formData.append('branchAdminPrice', branchAdminPrice || '0') // <-- Added form append
    formData.append('count', count || '0')
    formData.append('isFeatured', isFeatured)

    const applicableSizes = (category === 't-shirt' || category === 'shoe') ? selectedSizes : []
    formData.append('sizes', JSON.stringify(applicableSizes))

    rawFiles.forEach((file) => {
      formData.append('productImages', file)
    })

    try {
      let response
      if (isEditing) {
        response = await fetch(`${API_BASE_URL}/${currentProductId}`, {
          method: 'PUT',
          body: formData,
        })
      } else {
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          body: formData,
        })
      }

      if (response.ok) {
        toast.success(isEditing ? "Product updated successfully!" : "Product published successfully!", { id: actionToastId })
        setIsModalOpen(false)
        resetForm()
        fetchProducts() 
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          toast.error(`Error: ${errorData.message || "Failed operation"}`, { id: actionToastId });
        } else {
          toast.error("Server processing error. Validation failed.", { id: actionToastId });
        }
      }
    } catch (error) {
      console.error("Submission operational runtime execution issue caught:", error)
      toast.error("Network error. Could not commit product updates.", { id: actionToastId })
    }
  }

  const handleEditTrigger = (product) => {
    setCurrentProductId(product.id)
    setName(product.name)
    setCategory(product.category)
    setSelectedSizes(product.sizes || [])
    setDescription(product.description || '')
    
    setOriginalPrice(product.original_price !== undefined ? product.original_price : product.originalPrice)
    setOfferPrice(product.offer_price !== undefined ? product.offer_price : product.offerPrice)
    setBranchAdminPrice(product.branch_admin_price !== undefined ? product.branch_admin_price : product.branchAdminPrice) // <-- Map values safely
    
    setCount(product.count)
    setIsFeatured(product.isFeatured || false)
    setImages(product.images || [])
    setRawFiles([]) 
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 text-xs p-1 text-left">
        <p className="font-bold text-white uppercase tracking-wider">Confirm Delete Operation?</p>
        <p className="text-white/60">Are you sure you want to permanently erase this inventory record asset?</p>
        <div className="flex gap-2 justify-end mt-1">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white font-medium uppercase tracking-wider text-[10px]"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const executionToastId = toast.loading("Erasing catalog entry element...");
              try {
                const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                  toast.success("Product permanently removed from database log indices.", { id: executionToastId });
                  fetchProducts();
                } else {
                  toast.error("Target resource drop script rejected by server.", { id: executionToastId });
                }
              } catch (err) {
                toast.error("Network processing fault during removal pipeline request.", { id: executionToastId });
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
      style: { background: '#111315', border: '1px solid rgba(255,255,255,0.1)' }
    });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-royal-dark/20 min-h-screen text-gray-canvas">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider">Product Inventory</h2>
          <p className="text-xs text-gray-canvas/50 font-medium mt-1">Manage, modify, and add your new store products.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-lime-accent text-royal-dark hover:shadow-[0_4px_25px_rgba(165,206,0,0.35)] transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Product</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-24 text-xs font-mono tracking-widest text-lime-accent uppercase animate-pulse">
          Synchronizing Live Database Records...
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-royal-main/10">
          <Layers className="w-12 h-12 text-gray-canvas/20 mb-4" />
          <p className="text-sm font-bold uppercase tracking-wider text-gray-canvas/40">No Products Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-royal-main/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between backdrop-blur-sm shadow-xl hover:border-white/10 transition-all duration-300">
              
              <div className="h-48 w-full bg-royal-dark/60 relative overflow-hidden group">
                <img 
                  src={product.images && product.images[0] ? product.images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest bg-royal-dark/90 text-lime-accent border border-white/10 px-2.5 py-1 rounded-full">
                  {product.category}
                </span>

                {product.isFeatured && (
                  <span className="absolute bottom-3 left-3 text-[9px] font-black uppercase tracking-widest bg-lime-accent text-royal-dark border border-lime-accent px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-royal-dark text-royal-dark" /> Featured
                  </span>
                )}

                <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest bg-black/80 text-white border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Package className="w-3 h-3 text-lime-accent" /> Stock: {product.count}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-gray-canvas tracking-wide line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-gray-canvas/50 line-clamp-2 font-medium">{product.description}</p>
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-gray-canvas/40 mr-1">Sizes:</span>
                    {product.sizes.map((sz, idx) => (
                      <span key={idx} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-canvas/80">{sz}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-baseline gap-2 border-t border-white/5 pt-3">
                  <span className="text-base font-black font-mono text-lime-accent">
                    ₹{product.offer_price !== undefined ? product.offer_price : product.offerPrice}
                  </span>
                  <span className="text-xs font-mono text-gray-canvas/40 line-through">
                    ₹{product.original_price !== undefined ? product.original_price : product.originalPrice}
                  </span>
                  {/* Visual Reference display label inside layout grids */}
                  <span className="text-[10px] text-gray-canvas/50 ml-auto self-center bg-white/5 px-2 py-0.5 border border-white/10 rounded">
                    Admin: ₹{product.branch_admin_price !== undefined ? product.branch_admin_price : product.branchAdminPrice || 0}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 grid grid-cols-3 gap-2 border-t border-white/5 bg-royal-dark/20">
                <button 
                  onClick={() => setViewProduct(product)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-gray-canvas/80 hover:bg-royal-main hover:text-white transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <button 
                  onClick={() => handleEditTrigger(product)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/20 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- POPUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto text-left">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black uppercase tracking-wider text-gray-canvas flex items-center gap-2">
                <Layers className="w-5 h-5 text-lime-accent" />
                <span>{isEditing ? 'Edit Product' : 'Add New Product'}</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Select Category *</label>
                <select
                  required
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setSelectedSizes([]); }}
                  className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-canvas uppercase tracking-wider focus:outline-none focus:border-lime-accent transition-colors cursor-pointer"
                >
                  <option value="" disabled className="bg-royal-dark text-gray-canvas/40">-- SELECT CATEGORY --</option>
                  <option value="t-shirt" className="bg-royal-dark text-gray-canvas">T-Shirt</option>
                  <option value="shoe" className="bg-royal-dark text-gray-canvas">Shoe</option>
                  <option value="belt" className="bg-royal-dark text-gray-canvas">Belt</option>
                  <option value="watch" className="bg-royal-dark text-gray-canvas">Watch</option>
                </select>
              </div>

              {category === 't-shirt' && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Select Shirt Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {tshirtSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSizeToggle(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider border transition-all cursor-pointer ${
                          selectedSizes.includes(sz)
                            ? 'bg-lime-accent text-royal-dark border-lime-accent font-black shadow-md'
                            : 'bg-white/5 text-gray-canvas/60 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {category === 'shoe' && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Select Shoe Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {shoeSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSizeToggle(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider border transition-all cursor-pointer ${
                          selectedSizes.includes(sz)
                            ? 'bg-lime-accent text-royal-dark border-lime-accent font-black shadow-md'
                            : 'bg-white/5 text-gray-canvas/60 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 bg-royal-main/20 border border-white/5 p-4 rounded-xl">
                <input 
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-lime-accent bg-royal-dark border-white/10 cursor-pointer"
                />
                <label htmlFor="featuredCheckbox" className="text-xs font-bold uppercase tracking-wider text-gray-canvas/80 cursor-pointer select-none">
                  Show this product in Featured Products list
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Product Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Premium Leather Chronograph Watch" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-gray-canvas placeholder-gray-canvas/30 focus:outline-none focus:border-lime-accent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Product Description</label>
                <textarea 
                  rows="3"
                  placeholder="Provide technical product specifications or descriptions..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-gray-canvas placeholder-gray-canvas/30 focus:outline-none focus:border-lime-accent transition-colors resize-none"
                />
              </div>

              {/* Grid layout blocks tracking values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Original Price *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-mono text-gray-canvas/40">₹</span>
                    <input 
                      type="number" 
                      required
                      placeholder="2499" 
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full bg-royal-main/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs font-mono font-medium text-gray-canvas focus:outline-none focus:border-lime-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Offer Price *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-mono text-gray-canvas/40">₹</span>
                    <input 
                      type="number" 
                      required
                      placeholder="1899" 
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      className="w-full bg-royal-main/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs font-mono font-medium text-gray-canvas focus:outline-none focus:border-lime-accent transition-colors"
                    />
                  </div>
                </div>

                {/* --- ADDED INPUT FIELD ELEMENT BLOCK --- */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Branch Admin Price *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-mono text-gray-canvas/40">₹</span>
                    <input 
                      type="number" 
                      required
                      placeholder="1350" 
                      value={branchAdminPrice}
                      onChange={(e) => setBranchAdminPrice(e.target.value)}
                      className="w-full bg-royal-main/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs font-mono font-medium text-gray-canvas focus:outline-none focus:border-lime-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Stock Count *</label>
                  <div className="relative flex items-center">
                    <input 
                      type="number" 
                      required
                      min="0"
                      placeholder="50" 
                      value={count}
                      onChange={(e) => setCount(e.target.value)}
                      className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono font-medium text-gray-canvas focus:outline-none focus:border-lime-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Upload Product Images *</label>
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-xl bg-royal-main/20 hover:border-white/20 transition-colors relative cursor-pointer group">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Image className="w-8 h-8 text-gray-canvas/40 group-hover:text-lime-accent transition-colors mb-2" />
                  <span className="text-xs font-bold text-gray-canvas/70">Click to upload files from device</span>
                </div>

                {images.length > 0 && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg border border-white/10 overflow-hidden bg-royal-dark">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(idx)}
                            className="absolute top-0.5 right-0.5 bg-black/80 hover:bg-red-500 text-white rounded-full p-0.5 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-gray-canvas/80 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-lime-accent text-royal-dark hover:shadow-[0_4px_20px_rgba(165,206,0,0.25)] transition-all cursor-pointer font-black"
                >
                  {isEditing ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- READ-ONLY VIEW WINDOW OVERLAY --- */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-6 text-left">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-lime-accent font-mono">Product Inspection Mode</span>
                <h3 className="text-base font-black uppercase tracking-wider text-gray-canvas">{viewProduct.name}</h3>
              </div>
              <button 
                onClick={() => setViewProduct(null)}
                className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-xl">
              {viewProduct.images && viewProduct.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Asset View ${idx}`} className="w-full h-32 object-cover rounded-xl border border-white/5 bg-royal-main/10" />
              ))}
            </div>

            <div className="space-y-4 text-xs font-medium">
              
              <div className="flex justify-between items-center bg-royal-main/20 p-3 rounded-xl border border-white/5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Showcase Level:</span>
                <span className={`font-black uppercase tracking-wider ${viewProduct.isFeatured ? 'text-lime-accent' : 'text-gray-canvas/40'}`}>
                  {viewProduct.isFeatured ? '★ Featured Product' : 'Standard Product'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-royal-main/20 p-3 rounded-xl border border-white/5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Category Layer:</span>
                <span className="text-lime-accent font-black uppercase tracking-wider">{viewProduct.category}</span>
              </div>

              <div className="flex justify-between items-center bg-royal-main/20 p-3 rounded-xl border border-white/5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Stock Available:</span>
                <span className="text-white font-mono font-bold">{viewProduct.count} units</span>
              </div>

              {/* Added read-only metadata tracking layout wrapper */}
              <div className="flex justify-between items-center bg-royal-main/20 p-3 rounded-xl border border-white/5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Branch Admin Price:</span>
                <span className="text-white font-mono font-bold">₹{viewProduct.branch_admin_price !== undefined ? viewProduct.branch_admin_price : viewProduct.branchAdminPrice || 0}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Product Description:</span>
                <p className="bg-royal-main/10 border border-white/5 p-3 rounded-xl text-gray-canvas/80 tracking-wide leading-relaxed font-normal">{viewProduct.description}</p>
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-4">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Price Details:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black font-mono text-lime-accent">
                    ₹{viewProduct.offer_price !== undefined ? viewProduct.offer_price : viewProduct.offerPrice}
                  </span>
                  <span className="text-xs font-mono text-gray-canvas/40 line-through">
                    ₹{viewProduct.original_price !== undefined ? viewProduct.original_price : viewProduct.originalPrice}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default AddProducts;