import React, { useState } from 'react'
import { Plus, X, Eye, Edit2, Trash2, Image, Layers, Package } from 'lucide-react'

const AddProducts = () => {
  // Main state to store products list
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Classic Over-Sized Black Tee",
      category: "t-shirt",
      sizes: ["M", "L", "XL"],
      description: "Premium heavy-weight cotton custom oversized streetwear fit.",
      originalPrice: "1999",
      offerPrice: "1499",
      count: "45",
      images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500"]
    }
  ])

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
  const [count, setCount] = useState('')
  const [images, setImages] = useState([]) // Stores Base64 data strings for images

  // Lists for size options
  const tshirtSizes = ['S', 'M', 'L', 'XL']
  const shoeSizes = ['7', '8', '9', '10', '11', '12']

  // Read images from user device and convert them into dynamic URL strings
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages((prevImages) => [...prevImages, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove a selected image before saving
  const removeUploadedImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove))
  }

  // Toggle selection for size arrays
  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }

  // Reset form when closing or preparing modal
  const resetForm = () => {
    setCategory('')
    setSelectedSizes([])
    setName('')
    setDescription('')
    setOriginalPrice('')
    setOfferPrice('')
    setCount('')
    setImages([])
    setIsEditing(false)
    setCurrentProductId(null)
  }

  // Form submit function (Handles Create & Update actions)
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const productPayload = {
      id: isEditing ? currentProductId : Date.now(),
      name,
      category,
      sizes: (category === 't-shirt' || category === 'shoe') ? selectedSizes : [],
      description,
      originalPrice,
      offerPrice,
      count: count || '0',
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"] 
    }

    if (isEditing) {
      setProducts(products.map(p => p.id === currentProductId ? productPayload : p))
    } else {
      setProducts([...products, productPayload])
    }

    setIsModalOpen(false)
    resetForm()
  }

  // Fill form data to trigger Edit view
  const handleEditTrigger = (product) => {
    setCurrentProductId(product.id)
    setName(product.name)
    setCategory(product.category)
    setSelectedSizes(product.sizes)
    setDescription(product.description)
    setOriginalPrice(product.originalPrice)
    setOfferPrice(product.offerPrice)
    setCount(product.count)
    setImages(product.images)
    setIsEditing(true)
    setIsModalOpen(true)
  }

  // Delete product action
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 bg-royal-dark/20 min-h-screen text-gray-canvas">
      
      {/* HEADER CONTROLS ROW */}
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

      {/* --- GRID DISPLAY LAYOUT FOR CARDS --- */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-royal-main/10">
          <Layers className="w-12 h-12 text-gray-canvas/20 mb-4" />
          <p className="text-sm font-bold uppercase tracking-wider text-gray-canvas/40">No Products Found</p>
          <p className="text-xs text-gray-canvas/30 mt-1">Click the "Add Product" button above to populate items.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-royal-main/40 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between backdrop-blur-sm shadow-xl hover:border-white/10 transition-all duration-300">
              
              {/* Product Card Image Banner */}
              <div className="h-48 w-full bg-royal-dark/60 relative overflow-hidden group">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest bg-royal-dark/90 text-lime-accent border border-white/10 px-2.5 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-widest bg-black/80 text-white border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Package className="w-3 h-3 text-lime-accent" /> Stock: {product.count}
                </span>
              </div>

              {/* Product Details Area */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-gray-canvas tracking-wide line-clamp-1">{product.name}</h4>
                  <p className="text-xs text-gray-canvas/50 line-clamp-2 font-medium">{product.description}</p>
                </div>

                {/* Sizing Tags Section */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-gray-canvas/40 mr-1">Sizes:</span>
                    {product.sizes.map((sz, idx) => (
                      <span key={idx} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-canvas/80">{sz}</span>
                    ))}
                  </div>
                )}

                {/* Pricing Area */}
                <div className="flex items-baseline gap-2 border-t border-white/5 pt-3">
                  <span className="text-base font-black font-mono text-lime-accent">₹{product.offerPrice}</span>
                  <span className="text-xs font-mono text-gray-canvas/40 line-through">₹{product.originalPrice}</span>
                </div>
              </div>

              {/* Card Actions Footer Section */}
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

      {/* --- ADD / EDIT PRODUCT INTERACTIVE FORM POPUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Heading Title */}
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

            {/* Main Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* CATEGORY SELECT LIST DROPDOWN */}
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

              {/* SIZE CONDITIONS SECTION */}
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

              {/* CORE IDENTITY DESIGNATION INPUT ROWS */}
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

              {/* FINANCIAL PRICING AND PRODUCT STOCK COUNT COLUMNS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Original Price (INR) *</label>
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
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Offer Price (INR) *</label>
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

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Product Count (Stock) *</label>
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

              {/* FILE UPLOAD INPUT FROM LOCAL DEVICE INTERFACE */}
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
                  <span className="text-[10px] text-gray-canvas/40 mt-1">You can select multiple photos at once</span>
                </div>

                {/* Displaying Uploaded File Thumbnails */}
                {images.length > 0 && (
                  <div className="pt-2">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-canvas/40 block mb-2">Selected Media Previews:</label>
                    <div className="flex flex-wrap gap-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg border border-white/10 overflow-hidden bg-royal-dark">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(idx)}
                            className="absolute top-0.5 right-0.5 bg-black/80 hover:bg-red-500 text-white rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SAVE & SUBMIT TERMINAL OPERATIONS ROW */}
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

      {/* --- READ-ONLY MODAL DETAIL POPUP ("VIEW" WINDOW OVERLAY) --- */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-6">
            
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

            {/* Media Gallery Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-xl">
              {viewProduct.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Asset View ${idx}`} className="w-full h-32 object-cover rounded-xl border border-white/5 bg-royal-main/10" />
              ))}
            </div>

            <div className="space-y-4 text-xs font-medium">
              <div className="flex justify-between items-center bg-royal-main/20 p-3 rounded-xl border border-white/5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Category Layer:</span>
                <span className="text-lime-accent font-black uppercase tracking-wider">{viewProduct.category}</span>
              </div>

              <div className="flex justify-between items-center bg-royal-main/20 p-3 rounded-xl border border-white/5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Stock Available:</span>
                <span className="text-white font-mono font-bold">{viewProduct.count} units</span>
              </div>

              {viewProduct.sizes && viewProduct.sizes.length > 0 && (
                <div className="flex justify-between items-center bg-royal-main/20 p-3 rounded-xl border border-white/5">
                  <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Available Size Matrix:</span>
                  <div className="flex gap-1">
                    {viewProduct.sizes.map((sz, i) => (
                      <span key={i} className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-royal-dark text-gray-canvas border border-white/10">{sz}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Product Description:</span>
                <p className="bg-royal-main/10 border border-white/5 p-3 rounded-xl text-gray-canvas/80 tracking-wide leading-relaxed font-normal">{viewProduct.description}</p>
              </div>

              <div className="flex justify-between items-center border-t border-white/10 pt-4">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Price Details:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black font-mono text-lime-accent">₹{viewProduct.offerPrice}</span>
                  <span className="text-xs font-mono text-gray-canvas/40 line-through">₹{viewProduct.originalPrice}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default AddProducts