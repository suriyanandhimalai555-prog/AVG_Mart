import React, { useState, useEffect } from 'react'
import { Plus, X, Eye, Edit2, Trash2, Image, Layers, Package, Star, CheckSquare, Square, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast' 

const API_BASE_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/products`
const API_CAT_URL = `${import.meta.env.VITE_APP_BASE_URL}/api/categories`

const AddProducts = () => {
  const [products, setProducts] = useState([])
  const [availableCategories, setAvailableCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Dialog and popup controls state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentProductId, setCurrentProductId] = useState(null)
  const [viewProduct, setViewProduct] = useState(null) 

  // Form input field states
  const [category, setCategory] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [offerPrice, setOfferPrice] = useState('')
  const [branchAdminPrice, setBranchAdminPrice] = useState('') 
  const [count, setCount] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  
  // Base structural tracking changes
  const [baseRawFiles, setBaseRawFiles] = useState([])   
  const [baseImages, setBaseImages] = useState([])
  
  // Upgraded to arrays supporting up to 5 images per color option
  const [colorSpecificFiles, setColorSpecificFiles] = useState({}) // format: { "Color: Red": [File, File] }
  const [colorSpecificPreviews, setColorSpecificPreviews] = useState({}) // format: { "Color: Red": [DataURL, DataURL] }

  // --- Dynamic Category Attributes State ---
  const [selectedSpecOptions, setSelectedSpecOptions] = useState([]) 
  const [customTextInputs, setCustomTextInputs] = useState({}) 

  const clothingSizesList = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']
  const footwearSizesList = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

  const normalizedCat = category.toLowerCase().trim()
  const isClothingCategory = ['t-shirt', 'tshirts', 'tshirt', 'shirt', 'clothing', 'clothes'].includes(normalizedCat)
  const isFootwearCategory = ['shoe', 'shoes', 'footwear', 'footwears'].includes(normalizedCat)

  const activeCategoryObject = availableCategories.find(cat => cat.name.toLowerCase() === normalizedCat)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_CAT_URL)
      if (response.ok) {
        const data = await response.json()
        setAvailableCategories(data)
      }
    } catch (err) {
      console.error("Failed fetching live category layout dependencies:", err)
    }
  }

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
      console.error("Network communication line breakdown:", err)
      toast.error("Network error. Could not connect to product servers.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBaseImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    setBaseRawFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBaseImages((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
    toast.success("General image staged.")
  }

  // Refactored Multi-Image support up to 5 per variant color choice
  const handleColorImageUpload = (colorKey, e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const currentFiles = colorSpecificFiles[colorKey] || []
    if (currentFiles.length + files.length > 15) {
      toast.error("You can only upload up to 15 images per color variant.")
      return
    }

    const updatedFiles = [...currentFiles, ...files]
    setColorSpecificFiles(prev => ({ ...prev, [colorKey]: updatedFiles }))
    
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setColorSpecificPreviews(prev => {
          const currentPreviews = prev[colorKey] || []
          return { ...prev, [colorKey]: [...currentPreviews, reader.result] }
        })
      }
      reader.readAsDataURL(file)
    })
    toast.success(`Staged ${files.length} asset variant views for color: ${colorKey.replace("Color: ", "")}`)
  }

  const removeColorImageSlot = (colorKey, indexToDrop) => {
    const updatedFiles = (colorSpecificFiles[colorKey] || []).filter((_, i) => i !== indexToDrop)
    const updatedPreviews = (colorSpecificPreviews[colorKey] || []).filter((_, i) => i !== indexToDrop)
    
    setColorSpecificFiles(prev => ({ ...prev, [colorKey]: updatedFiles }))
    setColorSpecificPreviews(prev => ({ ...prev, [colorKey]: updatedPreviews }))
  }

  const handleSpecToggle = (optionString) => {
    if (selectedSpecOptions.includes(optionString)) {
      setSelectedSpecOptions(selectedSpecOptions.filter(item => item !== optionString))
      if (optionString.startsWith("Color: ")) {
        const updatedFiles = { ...colorSpecificFiles }
        const updatedPreviews = { ...colorSpecificPreviews }
        delete updatedFiles[optionString]
        delete updatedPreviews[optionString]
        setColorSpecificFiles(updatedFiles)
        setColorSpecificPreviews(updatedPreviews)
      }
    } else {
      setSelectedSpecOptions([...selectedSpecOptions, optionString])
    }
  }

  const handleCustomTextChange = (specName, value) => {
    setCustomTextInputs(prev => ({ ...prev, [specName]: value }))
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
    setColorSpecificPreviews({})
    setIsEditing(false)
    setCurrentProductId(null)
    setSelectedSpecOptions([])
    setCustomTextInputs({})
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    
    // Validation checks for color images when adding a new item
    if (!isEditing) {
      const activeColorKeys = selectedSpecOptions.filter(key => key.startsWith("Color: "))
      for (const colorKey of activeColorKeys) {
        const filesForColor = colorSpecificFiles[colorKey] || []
        if (filesForColor.length === 0) {
          toast.error(`Please upload at least one image for variant: ${colorKey.replace("Color: ", "")}`)
          return
        }
      }
    }

    const hasColorImages = Object.values(colorSpecificFiles).some(arr => arr && arr.length > 0)
    if (baseRawFiles.length === 0 && !hasColorImages && !isEditing) {
      toast.error("Please upload at least one product asset image.");
      return;
    }

    const actionToastId = toast.loading(isEditing ? "Updating product record..." : "Publishing new product...");
    
    const formData = new FormData()
    formData.append('name', name)
    formData.append('category', category)
    formData.append('description', description)
    formData.append('originalPrice', originalPrice)
    formData.append('offerPrice', offerPrice)
    formData.append('branchAdminPrice', branchAdminPrice || '0') 
    formData.append('count', count || '0')
    formData.append('isFeatured', isFeatured)

    // Append standard fallback asset files
    const trackingUploadFiles = [...baseRawFiles]
    const activeColorKeys = Object.keys(colorSpecificFiles).filter(key => selectedSpecOptions.includes(key))
    
    // Map dynamically keeping tracking index records accurate
    let colorIndexOffsetMap = {}
    let runningIndexSum = baseRawFiles.length

    activeColorKeys.forEach((colorKey) => {
      const filesForColor = colorSpecificFiles[colorKey] || []
      if (filesForColor.length > 0) {
        // Record starting location index of files for this color
        colorIndexOffsetMap[colorKey] = runningIndexSum
        filesForColor.forEach(file => {
          trackingUploadFiles.push(file)
          runningIndexSum++
        })
      }
    })

    // Enforce max 15 limitation cleanly before submitting to backend middleware
    if (trackingUploadFiles.length > 15) {
      toast.dismiss(actionToastId)
      toast.error("Total image attachments cross the maximum layout limit (Max 15).")
      return
    }

    // Fixed key name string parameter securely targeting backend endpoint arrays map layout
    trackingUploadFiles.forEach((file) => {
      formData.append('productImages', file)
    })

    let finalPayloadSpecs = []
    
    selectedSpecOptions.forEach(item => {
      if (item.startsWith("Color: ")) {
        if (colorIndexOffsetMap[item] !== undefined) {
          // Send back index key metadata string to database backend tracking
          finalPayloadSpecs.push(`${item}__imgIdx:${colorIndexOffsetMap[item]}`)
        } else {
          finalPayloadSpecs.push(`${item}__imgIdx:0`) 
        }
      } else {
        finalPayloadSpecs.push(item)
      }
    })
    
    Object.keys(customTextInputs).forEach(key => {
      if (customTextInputs[key] && customTextInputs[key].trim() !== '') {
        finalPayloadSpecs.push(`${key}: ${customTextInputs[key].trim()}`)
      }
    })

    formData.append('sizes', JSON.stringify(finalPayloadSpecs))

    try {
      let response
      if (isEditing) {
        response = await fetch(`${API_BASE_URL}/${currentProductId}`, { method: 'PUT', body: formData })
      } else {
        response = await fetch(API_BASE_URL, { method: 'POST', body: formData })
      }

      if (response.ok) {
        toast.success(isEditing ? "Product updated successfully!" : "Product published successfully!", { id: actionToastId })
        setIsModalOpen(false)
        resetForm()
        fetchProducts() 
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(`Error: ${errorData.message || "Failed operation"}`, { id: actionToastId });
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Network error. Could not commit product updates.", { id: actionToastId })
    }
  }

  const handleEditTrigger = (product) => {
    setCurrentProductId(product.id)
    setName(product.name)
    setCategory(product.category)
    setDescription(product.description || '')
    setOriginalPrice(product.original_price !== undefined ? product.original_price : product.originalPrice)
    setOfferPrice(product.offer_price !== undefined ? product.offer_price : product.offerPrice)
    setBranchAdminPrice(product.branch_admin_price !== undefined ? product.branch_admin_price : product.branchAdminPrice) 
    setCount(product.count)
    setIsFeatured(product.isFeatured || false)
    
    setBaseImages(product.images || [])
    setBaseRawFiles([]) 

    const initialChecked = []
    const initialTexts = {}

    if (product.sizes && Array.isArray(product.sizes)) {
      product.sizes.forEach(item => {
        if (item.includes('__imgIdx:')) {
          const parts = item.split('__imgIdx:')
          initialChecked.push(parts[0])
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
    setColorSpecificPreviews({})
    setIsEditing(true)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 text-xs p-1 text-left">
        <p className="font-bold text-white uppercase tracking-wider">Confirm Delete Operation?</p>
        <p className="text-white/60">Are you sure you want to permanently erase this inventory record asset?</p>
        <div className="flex gap-2 justify-end mt-1">
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white font-medium uppercase tracking-wider text-[10px]">Cancel</button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const executionToastId = toast.loading("Erasing catalog entry...");
              try {
                const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                  toast.success("Product permanently removed.", { id: executionToastId });
                  fetchProducts();
                } else {
                  toast.error("Delete script rejected by server.", { id: executionToastId });
                }
              } catch (err) {
                toast.error("Network processing fault during removal.", { id: executionToastId });
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
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider"><span className='text-lime-400'>Product</span> Inventory</h2>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <span className="text-[9px] font-bold tracking-wider uppercase text-gray-canvas/40 mr-1">Specs:</span>
                    {product.sizes.map((sz, idx) => (
                      <span key={idx} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-lime-400">
                        {sz.split('__imgIdx:')[0]}
                      </span>
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
                  <span className="text-[10px] text-gray-canvas/50 ml-auto self-center bg-white/5 px-2 py-0.5 border border-white/10 rounded">
                    Admin: ₹{product.branch_admin_price !== undefined ? product.branch_admin_price : product.branchAdminPrice || 0}
                  </span>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 grid grid-cols-3 gap-2 border-t border-white/5 bg-royal-dark/20">
                <button onClick={() => setViewProduct(product)} className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-gray-canvas/80 hover:bg-royal-main hover:text-white transition-all cursor-pointer">
                  <Eye className="w-3.5 h-3.5" /> <span>View</span>
                </button>
                <button onClick={() => handleEditTrigger(product)} className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-blue-500/20 bg-blue-500/5 text-blue-400 hover:bg-blue-500/20 transition-all cursor-pointer">
                  <Edit2 className="w-3.5 h-3.5" /> <span>Edit</span>
                </button>
                <button onClick={() => handleDelete(product.id)} className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> <span>Delete</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- POPUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl relative flex flex-col max-h-[85vh] text-left">
            
            {/* Locked Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6 shrink-0">
              <h3 className="text-lg font-black uppercase tracking-wider text-gray-canvas flex items-center gap-2">
                <Layers className="w-5 h-5 text-lime-accent" />
                <span>{isEditing ? 'Edit Product' : 'Add New Product'}</span>
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Content View Body Zone */}
            <form id="productForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Product Name *</label>
                  <input 
                    type="text" required placeholder="e.g., Elite Sports Shoes" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-gray-canvas focus:outline-none focus:border-lime-accent text-left"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Select Category *</label>
                  <select
                    required
                    value={category}
                    onChange={(e) => { 
                      setCategory(e.target.value); 
                      setSelectedSpecOptions([]); 
                      setCustomTextInputs({}); 
                      setColorSpecificFiles({});
                      setColorSpecificPreviews({});
                    }}
                    className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-gray-canvas uppercase tracking-wider focus:outline-none focus:border-lime-accent transition-colors cursor-pointer"
                  >
                    <option value="" disabled className="bg-royal-dark text-gray-canvas/40">-- SELECT CATEGORY --</option>
                    {availableCategories.map((cat) => (
                      <option key={cat.id} value={cat.name} className="bg-royal-dark text-gray-canvas">
                        {cat.name.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60">Product Description</label>
                <textarea 
                  rows="2" placeholder="Provide product technical description specifications..." value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium text-gray-canvas focus:outline-none focus:border-lime-accent resize-none text-left"
                />
              </div>

              {/* Dynamic Categories Configurations Matrix */}
              {activeCategoryObject && activeCategoryObject.attributes && activeCategoryObject.attributes.length > 0 && (
                <div className="space-y-4 border-t border-white/5 pt-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-lime-400">Category Configured Specifications Matrix</h4>
                  
                  <div className="grid grid-cols-1 gap-4 bg-royal-main/20 p-4 rounded-2xl border border-white/5">
                    {(() => {
                      const normalAttributes = []
                      const colorTabValues = []

                      activeCategoryObject.attributes.forEach(attr => {
                        if (attr.startsWith("Color: ")) {
                          colorTabValues.push(attr)
                        } else {
                          normalAttributes.push(attr)
                        }
                      })

                      return (
                        <>
                          {colorTabValues.length > 0 && (
                            <div className="space-y-4 border-b border-white/5 pb-3">
                              <label className="text-[10px] font-black uppercase text-gray-canvas/50">Step 1: Select Available Color Variants</label>
                              <div className="flex flex-wrap gap-2">
                                {colorTabValues.map((fullValue, index) => {
                                  const displayColor = fullValue.replace("Color: ", "")
                                  const isChecked = selectedSpecOptions.includes(fullValue)
                                  return (
                                    <button
                                      type="button" key={index} onClick={() => handleSpecToggle(fullValue)}
                                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                                        isChecked ? 'bg-lime-accent text-royal-dark border-lime-accent shadow-md' : 'bg-white/5 border-white/10 text-white/60'
                                      }`}
                                    >
                                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 opacity-40" />}
                                      <span>{displayColor.toUpperCase()}</span>
                                    </button>
                                  )
                                })}
                              </div>

                              {/* Multi Image Upload Box Section for colors */}
                              {selectedSpecOptions.some(opt => opt.startsWith("Color: ")) && (
                                <div className="space-y-4 pt-3 border-t border-white/5">
                                  <label className="text-[10px] font-black uppercase text-lime-400">Step 2: Upload Images For Selected Colors (Max 5 Each)</label>
                                  <div className="grid grid-cols-1 gap-4">
                                    {selectedSpecOptions.filter(opt => opt.startsWith("Color: ")).map((colorKey, idx) => {
                                      const previews = colorSpecificPreviews[colorKey] || []
                                      return (
                                        <div key={idx} className="bg-royal-dark/80 p-4 rounded-xl border border-white/5 space-y-3">
                                          <div className="flex justify-between items-center text-[11px] font-bold text-white uppercase tracking-wider">
                                            <span>{colorKey.replace("Color: ", "")} Variant</span>
                                            <span className="text-[10px] font-mono text-lime-400">{previews.length} / 5 Images</span>
                                          </div>

                                          <div className="flex flex-wrap gap-2 items-center">
                                            {/* Previews List */}
                                            {previews.map((src, pIdx) => (
                                              <div key={pIdx} className="relative w-14 h-14 rounded-lg border border-white/10 overflow-hidden shrink-0">
                                                <img src={src} alt="preview" className="w-full h-full object-cover" />
                                                <button 
                                                  type="button" 
                                                  onClick={() => removeColorImageSlot(colorKey, pIdx)}
                                                  className="absolute top-0.5 right-0.5 bg-black/85 rounded-full p-0.5 hover:bg-red-500 transition-colors"
                                                >
                                                  <X className="w-2.5 h-2.5 text-white" />
                                                </button>
                                              </div>
                                            ))}

                                            {/* Upload Trigger Dropzone Box */}
                                            {previews.length < 5 && (
                                              <div className="relative w-14 h-14 rounded-lg bg-white/5 border border-dashed border-white/20 hover:border-lime-accent/50 transition-colors flex flex-col items-center justify-center shrink-0 cursor-pointer">
                                                <input 
                                                  type="file" multiple accept="image/*"
                                                  onChange={(e) => handleColorImageUpload(colorKey, e)}
                                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <Upload className="w-4 h-4 text-lime-accent" />
                                                <span className="text-[8px] mt-1 text-gray-canvas/40 font-bold">ADD</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {normalAttributes.map((attrName, index) => {
                            const isCheckboxValue = attrName.toLowerCase().includes("`kg`") || attrName.toLowerCase().includes("gram") || attrName.toLowerCase().includes("litre") || attrName.toLowerCase().includes("ml") || attrName.toLowerCase().includes("resistant")
                            
                            if (isCheckboxValue) {
                              const isChecked = selectedSpecOptions.includes(attrName)
                              return (
                                <div key={index} className="flex items-center gap-2 py-1">
                                  <button
                                    type="button" onClick={() => handleSpecToggle(attrName)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-bold ${
                                      isChecked ? 'bg-lime-accent/10 border-lime-accent text-lime-400' : 'bg-royal-dark border-white/5 text-gray-canvas/50'
                                    }`}
                                  >
                                    {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-lime-400" /> : <Square className="w-3.5 h-3.5 text-gray-canvas/30" />}
                                    <span>{attrName}</span>
                                  </button>
                                </div>
                              )
                            }

                            return (
                              <div key={index} className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/50 text-left block">{attrName}</label>
                                <input 
                                  type="text"
                                  placeholder={`Enter ${attrName} configuration...`}
                                  value={customTextInputs[attrName] || ''}
                                  onChange={(e) => handleCustomTextChange(attrName, e.target.value)}
                                  className="w-full bg-royal-dark border border-white/10 rounded-xl px-3 py-2.5 text-xs text-gray-canvas focus:outline-none focus:border-lime-accent text-left"
                                />
                              </div>
                            )
                          })}
                        </>
                      )
                    })()}
                  </div>
                </div>
              )}

              {/* Standard Sizes Blocks */}
              {isClothingCategory && (
                <div className="space-y-2 p-4 bg-lime-accent/5 rounded-2xl border border-lime-accent/10">
                  <label className="text-[10px] font-black uppercase tracking-wider text-lime-400 text-left block">Available Clothing Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {clothingSizesList.map((sz) => {
                      const isChecked = selectedSpecOptions.includes(sz)
                      return (
                        <button
                          key={sz} type="button" onClick={() => handleSpecToggle(sz)}
                          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider border transition-all cursor-pointer ${
                            isChecked ? 'bg-lime-accent text-royal-dark border-lime-accent font-black shadow-md' : 'bg-white/5 text-gray-canvas/60 border-white/10'
                          }`}
                        >
                          {sz}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {isFootwearCategory && (
                <div className="space-y-2 p-4 bg-lime-accent/5 rounded-2xl border border-lime-accent/10">
                  <label className="text-[10px] font-black uppercase tracking-wider text-lime-400 text-left block">Available Footwear Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {footwearSizesList.map((sz) => {
                      const isChecked = selectedSpecOptions.includes(sz)
                      return (
                        <button
                          key={sz} type="button" onClick={() => handleSpecToggle(sz)}
                          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider border transition-all cursor-pointer ${
                            isChecked ? 'bg-lime-accent text-royal-dark border-lime-accent font-black shadow-md' : 'bg-white/5 text-gray-canvas/60 border-white/10'
                          }`}
                        >
                          UK/US {sz}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* General Fallback Bulk Images Pickers */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60 text-left block">Additional General Images (Optional)</label>
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-xl bg-royal-main/20 hover:border-white/20 relative cursor-pointer group">
                  <input type="file" multiple accept="image/*" onChange={handleBaseImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Image className="w-8 h-8 text-gray-canvas/40 group-hover:text-lime-accent transition-colors mb-2" />
                  <span className="text-xs font-bold text-gray-canvas/70">Click to upload general views</span>
                </div>
                {baseImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {baseImages.map((img, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg border border-white/10 overflow-hidden">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => {
                            setBaseImages(baseImages.filter((_, i) => i !== idx));
                            setBaseRawFiles(baseRawFiles.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-0.5 right-0.5 bg-black/80 rounded-full p-0.5 hover:bg-red-500"
                        >
                          <X className="w-2.5 h-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing Metric Container Grids */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60 text-left block">Original Price *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-mono text-gray-canvas/40">₹</span>
                    <input 
                      type="number" required placeholder="2499" value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full bg-royal-main/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs font-mono text-gray-canvas focus:outline-none focus:border-lime-accent text-left"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60 text-left block">Offer Price *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-mono text-gray-canvas/40">₹</span>
                    <input 
                      type="number" required placeholder="1899" value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      className="w-full bg-royal-main/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs font-mono text-gray-canvas focus:outline-none focus:border-lime-accent text-left"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60 text-left block">Branch Admin *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-mono text-gray-canvas/40">₹</span>
                    <input 
                      type="number" required placeholder="1350" value={branchAdminPrice}
                      onChange={(e) => setBranchAdminPrice(e.target.value)}
                      className="w-full bg-royal-main/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-xs font-mono text-gray-canvas focus:outline-none focus:border-lime-accent text-left"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-canvas/60 text-left block">Stock Count *</label>
                  <input 
                    type="number" required min="0" placeholder="50" value={count}
                    onChange={(e) => setCount(e.target.value)}
                    className="w-full bg-royal-main/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-gray-canvas focus:outline-none focus:border-lime-accent text-left"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-royal-main/20 border border-white/5 p-4 rounded-xl">
                <input 
                  type="checkbox" id="featuredCheckbox" checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-lime-accent bg-royal-dark border-white/10 cursor-pointer"
                />
                <label htmlFor="featuredCheckbox" className="text-xs font-bold uppercase tracking-wider text-gray-canvas/80 cursor-pointer select-none">
                  Show this product in Featured Products list
                </label>
              </div>
            </form>

            {/* Locked Modal Action Control Footer Buttons */}
            <div className="border-t border-white/10 p-6 flex items-center justify-end gap-3 shrink-0 bg-royal-dark/95 rounded-b-3xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-gray-canvas/80 hover:bg-white/10 cursor-pointer">Cancel</button>
              <button form="productForm" type="submit" className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-lime-accent text-royal-dark hover:shadow-[0_4px_20px_rgba(165,206,0,0.25)] font-black cursor-pointer">
                {isEditing ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- READ-ONLY INSPECTION OVERLAY --- */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-royal-dark border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-6 text-left">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-lime-accent font-mono">Product Inspection Mode</span>
                <h3 className="text-base font-black uppercase tracking-wider text-gray-canvas">{viewProduct.name}</h3>
              </div>
              <button onClick={() => setViewProduct(null)} className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:text-red-400 hover:bg-red-500/10 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto rounded-xl">
              {viewProduct.images && viewProduct.images.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img} alt={`Asset View ${idx}`} className="w-full h-32 object-cover rounded-xl border border-white/5 bg-royal-main/10" />
                  <span className="absolute top-1 left-1 text-[8px] bg-black/80 px-1.5 py-0.5 rounded text-white font-mono">Slot #{idx + 1}</span>
                </div>
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

              <div className="flex justify-between items-center bg-royal-main/20 p-3 rounded-xl border border-white/5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Branch Admin Price:</span>
                <span className="text-white font-mono font-bold">₹{viewProduct.branch_admin_price !== undefined ? viewProduct.branch_admin_price : viewProduct.branchAdminPrice || 0}</span>
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-canvas/40 uppercase font-bold text-[10px]">Product Specifications / Sizes Bound:</span>
                <div className="flex flex-wrap gap-1 bg-royal-main/10 border border-white/5 p-3 rounded-xl">
                  {viewProduct.sizes && viewProduct.sizes.length > 0 ? (
                    viewProduct.sizes.map((sz, idx) => (
                      <span key={idx} className="text-[10px] bg-lime-accent/10 border border-lime-accent/20 text-lime-400 px-2 py-0.5 rounded font-mono font-bold">
                        {sz.split('__imgIdx:')[0]}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-canvas/30 italic">No custom parameters matched.</span>
                  )}
                </div>
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